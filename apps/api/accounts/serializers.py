from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password as dj_validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework.exceptions import AuthenticationFailed
from .service import UserService

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=True, allow_blank=False, max_length=120)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Email already in use")]
    )
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    password_confirm = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields = ("email", "password", "password_confirm", "full_name")

    def validate_password(self, value):
        dj_validate_password(value)
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": ["Passwords do not match"]})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        return UserService.register_user(validated_data)

class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["email"], password=attrs["password"])
        if not user:
            raise AuthenticationFailed("Invalid credentials")
        if not user.is_verified:
            raise AuthenticationFailed("Account not verified. Please check your email.")
        attrs["user"] = user
        return attrs

class VerifyAccountSerializer(serializers.Serializer):
    token = serializers.CharField()

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def validate_password(self, value):
        dj_validate_password(value)
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": ["Passwords do not match"]})
        return attrs

class GoogleLoginSerializer(serializers.Serializer):
    token = serializers.CharField()
