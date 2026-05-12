from typing import Any, Optional

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom manager for the User model where email is the unique identifier."""

    def create_user(self, email: str, password: Optional[str] = None, **extra_fields: Any) -> "User":
        """Create and save a regular User with the given email and password."""
        if not email:
            raise ValueError("The Email field must be set")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: Optional[str] = None, **extra_fields: Any) -> "User":
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model that supports using email instead of username.
    """
    class Roles(models.TextChoices):
        ADMIN = "admin", "Admin"
        USER = "user", "User"
        LECTURER = "lecturer", "Lecturer"
        CENTER = "center", "Center"

    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=120, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    # Core status fields
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    
    # Profile information
    role = models.CharField(
        max_length=50, 
        choices=Roles.choices, 
        default=Roles.USER,
        blank=True
    )
    avatar = models.URLField(max_length=500, blank=True, null=True)
    provider = models.CharField(max_length=50, default="email")
    
    bank = models.CharField(max_length=100, blank=True)
    education = models.CharField(max_length=200, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    hometown = models.CharField(max_length=100, blank=True)
    workplace = models.CharField(max_length=100, blank=True)
    
    objects: UserManager = UserManager()
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self) -> str:
        return self.email


class UserToken(models.Model):
    """
    Model for storing temporary tokens for verification and password reset.
    """
    class TokenType(models.TextChoices):
        VERIFICATION = "verification", "Verification"
        PASSWORD_RESET = "password_reset", "Password Reset"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tokens")
    token = models.CharField(max_length=100, unique=True)
    token_type = models.CharField(max_length=20, choices=TokenType.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    @property
    def is_expired(self) -> bool:
        """Check if the token has passed its expiration date."""
        return timezone.now() > self.expires_at

    def __str__(self) -> str:
        return f"{self.user.email} - {self.token_type} ({self.token[:8]}...)"
