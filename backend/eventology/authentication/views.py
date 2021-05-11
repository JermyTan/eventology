from rest_framework_simplejwt.views import TokenViewBase
from .serializers import (
    LoginSerializer,
    AccessTokenRefreshSerializer,
)

# Create your views here.
class LoginView(TokenViewBase):
    serializer_class = LoginSerializer


class AccessTokenRefreshView(TokenViewBase):
    serializer_class = AccessTokenRefreshSerializer
