from django.db import models
from django.conf import settings

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    city = models.CharField(max_length=100, blank=True)
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    website = models.URLField(max_length=200, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.email}"

class PrivacySettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='privacy_settings')
    show_activity = models.BooleanField(default=True)
    show_groups = models.BooleanField(default=True)
    show_learning_progress = models.BooleanField(default=True)
    profile_visibility = models.CharField(
        max_length=20,
        choices=[('PUBLIC', 'Public'), ('PRIVATE', 'Private')],
        default='PUBLIC'
    )

    def __str__(self):
        return f"Privacy for {self.user.email}"
