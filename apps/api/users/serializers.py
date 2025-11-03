from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import (
    validate_password as dj_validate_password,
)
from rest_framework import fields, serializers
from rest_framework.validators import UniqueValidator
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from typing import Any

User = get_user_model()

# RegisterSerializer start
class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=True, allow_blank=False, max_length=120)

    email = serializers.EmailField(
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Email already in use")
        ]
    )

    password = serializers.CharField(write_only=True, trim_whitespace=False)
    password2 = serializers.CharField(
        write_only=True, trim_whitespace=False, label="Confirm password"
    )

    # nếu có field này trên model thì giữ; không thì xóa dòng này
    date_of_birth = serializers.DateField(
        required=False, allow_null=True, input_formats=["%Y-%m-%d"]
    )

    class Meta:
        model = User
        fields = ("email", "password", "password2", "full_name", "date_of_birth")

    def validate_email(self, value: Any) -> Any:
        return value.strip().lower()

    def validate_password(self, value: str) -> str:
        dj_validate_password(value)  # dùng alias để không đè tên method
        return value

    def validate_full_name(self, value: str) -> str:
        v = value.strip()
        if not v:
            raise serializers.ValidationError("Full name is required")
        return " ".join(v.split())  # gộp khoảng trắng thừa (optional)

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": ["Passwords do not match"]})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2", None)

        user = User(
            email=validated_data["email"],
            full_name=validated_data.get("full_name", ""),
            date_of_birth=validated_data.get(
                "date_of_birth"
            ),  # xóa dòng này nếu model KHÔNG có field này
        )

        user.set_password(validated_data["password"])
        user.save()
        return user
# RegisterSerializer end

# Sign in Start
class SignInSerializer(serializers.Serializer):  # KHÔNG dùng ModelSerializer cho login
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password") or ""
        if not email or not password:
            raise ValidationError({"detail": "Email and password are required"})

        # Nếu USERNAME_FIELD = "email" thì authenticate(username=email, password=...)
        user = authenticate(username=email, password=password)
        if not user:
            raise AuthenticationFailed("Invalid credentials")

        attrs["user"] = user
        return attrs
# signIn end

# refresh pass start
class RefreshSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField()

    def validate(self,attrs):
        email = attrs.get("email", "").strip().lower()

        if not email:
            raise ValidationError({"detail": "email is not availble"})

        user = authenticate(username=email)
        if not user:
            raise AuthenticationFailed("Invalid credentials")

        attrs["user"] = user
        return attrs


