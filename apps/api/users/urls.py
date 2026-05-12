from django.urls import path
from .views import (
    RegisterView, LoginView, VerifyAccountView, 
    ForgotPasswordView, ResetPasswordView, LogoutView, MeView, GoogleLoginView, GoogleDebugView
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("verify/", VerifyAccountView.as_view(), name="verify"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("google/", GoogleLoginView.as_view(), name="google-login"),
    path("google/debug/", GoogleDebugView.as_view(), name="google-debug"),
]
