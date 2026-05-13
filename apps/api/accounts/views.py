from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from backend.common.responses import res_message
from .serializers import (
    RegisterSerializer, SignInSerializer, VerifyAccountSerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer, GoogleLoginSerializer
)
from .service import UserService, GoogleAuthService

class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        UserService.register_user(serializer.validated_data)
        return res_message(201, "Registration successful. Please check your email to verify your account.")

class VerifyAccountView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data["token"]
        
        if UserService.verify_user_account(token):
            return res_message(200, "Account verified successfully. You can now login.")
        return res_message(400, "Invalid or expired verification token.")

class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = SignInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        auth_data = UserService.login_user(user, request)
        return res_message(200, "Login successful", auth_data)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        UserService.request_password_reset(serializer.validated_data["email"])
        return res_message(200, "If an account exists with this email, a reset link has been sent.")

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        success = UserService.reset_user_password(
            serializer.validated_data["token"],
            serializer.validated_data["password"]
        )
        
        if success:
            return res_message(200, "Password reset successful. You can now login.")
        return res_message(400, "Invalid or expired reset token.")

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return res_message(400, "Refresh token is required")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return res_message(200, "Logged out successfully.")
        except Exception:
            # If token is already blacklisted or invalid, we still want to "log out" the user on frontend
            return res_message(200, "Logged out successfully.")

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return res_message(200, "User info retrieved", UserService.get_user_info(request.user, request))

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        import logging
        from django.conf import settings
        logger = logging.getLogger(__name__)
        
        token = request.data.get("token")
        token_len = len(token) if token else 0
        token_snippet = token[:30] + "..." if token_len > 30 else token
        
        logger.info(f"--- [DEBUG] Google Login Request Payload ---")
        logger.info(f"Data keys: {list(request.data.keys())}")
        logger.info(f"Token length: {token_len}")
        logger.info(f"Token snippet: {token_snippet}")
        
        serializer = GoogleLoginSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer validation failed: {serializer.errors}")
            return res_message(400, "Invalid request payload.", {
                "status": "error",
                "step": "serializer_validation",
                "errors": serializer.errors
            })
        
        token = serializer.validated_data["token"]
        idinfo = GoogleAuthService.verify_google_token(token)
        
        if not idinfo or "error_type" in idinfo:
            error_msg = idinfo.get("message", "Unknown verification error") if idinfo else "No response from verification service"
            error_type = idinfo.get("error_type", "unknown") if idinfo else "none"
            
            # Detailed structured debug response as requested
            debug_info = {
                "status": "error",
                "step": "token_verification",
                "error_type": error_type,
                "message": error_msg
            }
            
            if error_type == "audience_mismatch":
                debug_info.update({
                    "expected": idinfo.get("expected"),
                    "received": idinfo.get("received")
                })
            
            logger.error(f"Google login failed at step {debug_info['step']}: {error_msg}")
            return res_message(401, error_msg, debug_info)
            
        logger.info(f"Token verified for email: {idinfo.get('email')}")
        user = GoogleAuthService.get_or_create_google_user(idinfo)
        auth_data = UserService.login_user(user, request)
        
        logger.info(f"Google Login Success: {user.email}")
        return res_message(200, "Google login successful", auth_data)

class GoogleDebugView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        import django
        import firebase_admin
        from django.conf import settings
        from django.utils import timezone
        import logging
        
        logger = logging.getLogger(__name__)
        logger.info("Debug endpoint accessed.")
        
        return res_message(200, "Debug info", {
            "GOOGLE_CLIENT_ID": getattr(settings, 'GOOGLE_CLIENT_ID', 'Not Set'),
            "firebase_initialized": bool(firebase_admin._apps),
            "versions": {
                "django": django.get_version(),
                "firebase-admin": firebase_admin.__version__
            },
            "server_time_utc": timezone.now().isoformat()
        })
