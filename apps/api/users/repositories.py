from typing import Optional, Type, List
from django.db import models
from .models import User, UserToken

class UserRepository:
    @staticmethod
    def get_by_email(email: str) -> Optional[User]:
        return User.objects.filter(email=email).first()

    @staticmethod
    def get_by_id(user_id: int) -> Optional[User]:
        return User.objects.filter(id=user_id).first()

    @staticmethod
    def create(validated_data: dict) -> User:
        return User.objects.create_user(**validated_data)

class TokenRepository:
    @staticmethod
    def create(user: User, token: str, token_type: str, expires_at) -> UserToken:
        return UserToken.objects.create(
            user=user,
            token=token,
            token_type=token_type,
            expires_at=expires_at
        )

    @staticmethod
    def get_valid_token(token_str: str, token_type: str) -> Optional[UserToken]:
        from django.utils import timezone
        return UserToken.objects.filter(
            token=token_str,
            token_type=token_type,
            is_used=False,
            expires_at__gt=timezone.now()
        ).first()
