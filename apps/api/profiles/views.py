from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import Profile, PrivacySettings
from .serializers import ProfileSerializer, PrivacySettingsSerializer, UserProfileSerializer
from django.shortcuts import get_object_or_404
from backend.common.responses import res_message
from accounts.models import User

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class ProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    @decorators.action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        
        if request.method == 'GET':
            serializer = ProfileSerializer(profile, context={'request': request})
            return res_message(200, "Profile retrieved", serializer.data)
        
        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        
        print("REQUEST DATA:", request.data)
        print("REQUEST FILES:", request.FILES)
        print("AVATAR FILE:", request.FILES.get("avatar"))
        
        if serializer.is_valid():
            serializer.save()
            return res_message(200, "Profile updated", serializer.data)
            
        print("SERIALIZER ERRORS:", serializer.errors)
        return res_message(400, "Invalid data", serializer.errors)

    @decorators.action(detail=False, methods=['get'], url_path='u/(?P<username>[^/.]+)')
    def by_username(self, request, username=None):
        # In this system, email is used as username or we search by full_name/email
        user = get_object_or_404(User, email=username) # Or implement a proper username field
        profile = get_object_or_404(Profile, user=user)
        
        # Check privacy settings
        privacy = user.privacy_settings
        if privacy.profile_visibility == 'PRIVATE' and user != request.user:
            return res_message(403, "This profile is private.")
            
        serializer = UserProfileSerializer(user, context={'request': request})
        data = serializer.data
        
        # Filter data based on privacy
        if user != request.user:
            if not privacy.show_activity: data.pop('activity', None) # We'll add activity logic later
            if not privacy.show_groups: data.pop('groups', None)
            
        return res_message(200, "Profile retrieved", data)

class PrivacySettingsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PrivacySettingsSerializer

    def get_queryset(self):
        return PrivacySettings.objects.filter(user=self.request.user)

    @decorators.action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        settings = get_object_or_404(PrivacySettings, user=request.user)
        if request.method == 'GET':
            serializer = PrivacySettingsSerializer(settings)
            return res_message(200, "Privacy settings retrieved", serializer.data)
        
        serializer = PrivacySettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return res_message(200, "Privacy settings updated", serializer.data)
        return res_message(400, "Invalid data", serializer.errors)
