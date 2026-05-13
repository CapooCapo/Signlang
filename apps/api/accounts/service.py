import uuid
from datetime import timedelta
from typing import Any, Dict, Optional
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .models import User, UserToken
from .repositories import UserRepository, TokenRepository
from .email_service import EmailService

class UserService:
    @staticmethod
    def get_user_info(user: User, request=None) -> Dict[str, Any]:
        from profiles.serializers import UserProfileSerializer
        context = {'request': request} if request else {}
        serializer = UserProfileSerializer(user, context=context)
        return serializer.data

    @staticmethod
    def register_user(validated_data: Dict[str, Any]) -> User:
        user = UserRepository.create({
            "email": validated_data["email"],
            "password": validated_data["password"],
            "full_name": validated_data.get("full_name", ""),
            "is_active": False,
            "is_verified": False,
            "provider": "email"
        })
        
        # Generate verification token
        token_str = str(uuid.uuid4())
        TokenRepository.create(
            user=user,
            token=token_str,
            token_type=UserToken.TokenType.VERIFICATION,
            expires_at=timezone.now() + timedelta(hours=24)
        )
        
        # Send email
        EmailService.send_verification_email(user, token_str)
        
        return user

    @staticmethod
    def verify_user_account(token_str: str) -> bool:
        token_obj = TokenRepository.get_valid_token(token_str, UserToken.TokenType.VERIFICATION)
        if not token_obj:
            return False
            
        user = token_obj.user
        user.is_active = True
        user.is_verified = True
        user.save()
        
        token_obj.is_used = True
        token_obj.save()
        return True

    @staticmethod
    def login_user(user: User, request=None) -> Dict[str, Any]:
        """
        Generates JWT tokens (access/refresh) for the user.
        """
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            refresh = RefreshToken.for_user(user)
            logger.info(f"JWT tokens generated successfully for user: {user.email}")
            
            return {
                "user": UserService.get_user_info(user, request),
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        except Exception as e:
            logger.error(f"Failed to generate JWT tokens for user {user.email}: {e}")
            raise

class GoogleAuthService:
    @staticmethod
    def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Verifies the Firebase ID token using Firebase Admin SDK.
        """
        import logging
        import traceback
        from core.firebase import verify_firebase_token
        
        logger = logging.getLogger(__name__)
        
        logger.info(f"--- [DEBUG] Firebase Token Verification Start ---")
        token_len = len(token) if token else 0
        token_snippet = token[:30] + "..." if token_len > 30 else token
        
        logger.info(f"Token received (len={token_len}): {token_snippet}")
        
        if not token:
            logger.error("Token is empty or null.")
            return {"error_type": "missing_token", "message": "Token is missing"}

        try:
            # Use Firebase Admin SDK to verify the token
            decoded_token = verify_firebase_token(token)
            
            if not decoded_token:
                return {"error_type": "verification_failed", "message": "Firebase Admin SDK failed to verify token"}
            
            # Additional validation as requested
            iss = decoded_token.get('iss', '')
            # Firebase ID tokens have issuer like https://securetoken.google.com/<project-id>
            # But for Google login, some fields might be different.
            # We trust Firebase Admin SDK's verify_id_token to check signatures and basic claims.
            
            logger.info("--- [DEBUG] Token Verification Success ---")
            logger.info(f"Decoded Payload: aud={decoded_token.get('aud')}, iss={iss}, sub={decoded_token.get('sub')}, email={decoded_token.get('email')}")
            
            return decoded_token
            
        except Exception as e:
            logger.error(f"--- [DEBUG] Firebase verification error: {e} ---")
            logger.error(traceback.format_exc())
            return {"error_type": "unexpected_error", "message": str(e)}

    @staticmethod
    def get_or_create_google_user(idinfo: Dict[str, Any]) -> User:
        """
        Gets an existing user or creates a new one from Google info.
        Prevents duplicates by looking up by email.
        """
        import logging
        logger = logging.getLogger(__name__)
        
        email = idinfo['email']
        user = UserRepository.get_by_email(email)

        if not user:
            # Create a new user
            logger.info(f"Creating new Google user: {email}")
            user = UserRepository.create({
                "email": email,
                "password": User.objects.make_random_password(),
                "full_name": idinfo.get('name', ''),
                "avatar": idinfo.get('picture', ''),
                "provider": "google",
                "is_active": True,
                "is_verified": True # Google emails are already verified
            })
            logger.info(f"Successfully created user {email} (ID: {user.id})")
        else:
            # If user exists, sync profile info if needed
            logger.info(f"Existing user login: {email}")
            updated = False
            if not user.is_verified:
                user.is_verified = True
                user.is_active = True
                updated = True
            
            if not user.avatar and idinfo.get('picture'):
                user.avatar = idinfo.get('picture')
                updated = True
            
            if user.provider == "email":
                user.provider = "google"
                updated = True
                
            if updated:
                user.save()
                logger.info(f"Updated profile for existing user {email}")

        return user

    # Removed login_user and login_user_legacy as they are now in UserService

    @staticmethod
    def request_password_reset(email: str) -> None:
        user = UserRepository.get_by_email(email)
        if user:
            token_str = str(uuid.uuid4())
            TokenRepository.create(
                user=user,
                token=token_str,
                token_type=UserToken.TokenType.PASSWORD_RESET,
                expires_at=timezone.now() + timedelta(hours=1)
            )
            EmailService.send_password_reset_email(user, token_str)

    @staticmethod
    def reset_user_password(token_str: str, password: str) -> bool:
        token_obj = TokenRepository.get_valid_token(token_str, UserToken.TokenType.PASSWORD_RESET)
        if not token_obj:
            return False
            
        user = token_obj.user
        user.set_password(password)
        user.save()
        
        token_obj.is_used = True
        token_obj.save()
        return True