from os import access
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from backend.common.responses import res_message
from .serializers import RegisterSerializer, SignInSerializer
from .tokens import UserToken
from users import serializers

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if s.is_valid(raise_exception=True):
            s.save()
            return Response({"message":"Congratulation , have a good time!!!"}, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserToken

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        u = request.user
        return Response({"id": u.id, "email": getattr(u, "email", None)})


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = SignInSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        user = s.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return res_message(200, "ok", {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": getattr(user, "full_name", ""),
            },
        })

class RefreshView(APIView):
    permission_classes = [IsAuthenticated]
    #def post(self, request):


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
class ForgotPasswordView(APIView):
    permission_classes = [IsAuthenticated]
class ResetPasswordView(APIView):
    permission_classes = [IsAuthenticated]
class ResetPasswordConfirmView(APIView):
    permission_classes = [IsAuthenticated]

