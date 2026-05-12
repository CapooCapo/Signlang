from django.contrib import admin
from .models import User, UserToken

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "full_name", "is_verified", "is_active")
    list_filter = ("is_verified", "is_active", "role")
    search_fields = ("email", "full_name")

@admin.register(UserToken)
class UserTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "token_type", "created_at", "expires_at", "is_used")
    list_filter = ("token_type", "is_used")
    search_fields = ("user__email", "token")
    