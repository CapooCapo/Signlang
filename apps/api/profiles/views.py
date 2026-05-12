from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import Profile, PrivacySettings
from .serializers import ProfileSerializer, PrivacySettingsSerializer, UserProfileSerializer
from users.models import User
from django.shortcuts import get_object_or_404

class ProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    @decorators.action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        if request.method == 'GET':
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Also update full_name if provided in request.data for the user
            if 'full_name' in request.data:
                request.user.full_name = request.data['full_name']
                request.user.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(detail=False, methods=['get'], url_path='u/(?P<username>[^/.]+)')
    def by_username(self, request, username=None):
        # In this system, email is used as username or we search by full_name/email
        user = get_object_or_404(User, email=username) # Or implement a proper username field
        profile = get_object_or_404(Profile, user=user)
        
        # Check privacy settings
        privacy = user.privacy_settings
        if privacy.profile_visibility == 'PRIVATE' and user != request.user:
            return Response({'detail': 'This profile is private.'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = UserProfileSerializer(user)
        data = serializer.data
        
        # Filter data based on privacy
        if user != request.user:
            if not privacy.show_activity: data.pop('activity', None) # We'll add activity logic later
            if not privacy.show_groups: data.pop('groups', None)
            
        return Response(data)

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
            return Response(serializer.data)
        
        serializer = PrivacySettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
