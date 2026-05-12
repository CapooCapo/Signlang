from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

class EmailService:
    @staticmethod
    def send_verification_email(user, token):
        subject = "Verify your SignLang account"
        verification_url = f"{settings.FRONTEND_URL}/verify?token={token}"
        message = f"Hi {user.full_name or user.email},\n\nPlease verify your account by clicking the link below:\n{verification_url}\n\nThis link will expire in 24 hours."
        
        # We can use templates later, but for now simple text
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

    @staticmethod
    def send_password_reset_email(user, token):
        subject = "Reset your SignLang password"
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        message = f"Hi {user.full_name or user.email},\n\nYou requested a password reset. Click the link below to set a new password:\n{reset_url}\n\nIf you did not request this, please ignore this email."
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
