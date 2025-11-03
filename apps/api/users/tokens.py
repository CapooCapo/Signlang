from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserToken(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        return token

    def validate(self, attrs):
        attrs = {
            "username": self.initial_data.get("email"),
            "password": self.initial_data.get("password"),
        }
        return super().validate(attrs)

