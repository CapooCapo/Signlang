from rest_framework import serializers
from .models import Profile, PrivacySettings
from users.models import User

class PrivacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacySettings
        fields = ['show_activity', 'show_groups', 'show_learning_progress', 'profile_visibility']

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = Profile
        fields = ['email', 'full_name', 'bio', 'city', 'cover_image', 'avatar', 'website', 'phone', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    privacy_settings = PrivacySettingsSerializer()

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'profile', 'privacy_settings']
