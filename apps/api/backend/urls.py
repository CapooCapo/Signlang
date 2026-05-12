from django.contrib import admin
from django.urls import path, include
from backend.common.views import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('users.urls')),
    path('api/v1/community/', include('community.urls')),
    path('api/v1/profiles/', include('profiles.urls')),
    path('health/', health_check, name='health_check'),
]
