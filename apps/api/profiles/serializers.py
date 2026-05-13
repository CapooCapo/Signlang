from rest_framework import serializers
from .models import Profile, PrivacySettings
from accounts.models import User

class PrivacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacySettings
        fields = ['show_activity', 'show_groups', 'show_learning_progress', 'profile_visibility']

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name', required=False)
    # Map avatar to user.avatar and make it writable
    avatar = serializers.ImageField(source='user.avatar', required=False, allow_null=True)
    
    class Meta:
        model = Profile
        fields = ['email', 'full_name', 'bio', 'city', 'cover_image', 'avatar', 'website', 'phone', 'created_at']

    def update(self, instance, validated_data):
        # Handle nested user data if present (like avatar or full_name)
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                # CRITICAL: Prevent PATCH from overwriting existing image with null
                if attr == 'avatar' and value is None:
                    continue
                setattr(user, attr, value)
            user.save()
            
        # CRITICAL: Prevent PATCH from overwriting existing cover_image with null
        if 'cover_image' in validated_data and validated_data['cover_image'] is None:
            validated_data.pop('cover_image')
            
        return super().update(instance, validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    privacy_settings = PrivacySettingsSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'avatar', 'profile', 'privacy_settings']
