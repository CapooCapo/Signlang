from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, PrivacySettingsViewSet

router = DefaultRouter()
router.register(r'user', ProfileViewSet, basename='profile')
router.register(r'privacy', PrivacySettingsViewSet, basename='privacy')

urlpatterns = [
    path('', include(router.urls)),
]
