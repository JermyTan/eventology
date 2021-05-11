from django.utils.translation import gettext_lazy as _

from rest_framework import serializers, exceptions

from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings

from users.models import User
from users.logic import user_to_json, get_users
from eventology.common.constants import REFRESH

from .logic import get_tokens


class BaseAuthenticationSerializer(serializers.Serializer):
    default_error_messages = {"invalid_user": _("Invalid user.")}

    def raiseInvalidUser(self):
        authenticationFailedException = exceptions.AuthenticationFailed(
            self.error_messages.get("invalid_user"),
            code="invalid_user",
        )
        raise authenticationFailedException


class LoginSerializer(BaseAuthenticationSerializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs["email"]

        try:
            user = get_users(email=email).get()
        except (User.DoesNotExist, User.MultipleObjectsReturned) as e:
            self.raiseInvalidUser()

        tokens = get_tokens(user=user)
        data = user_to_json(user=user)
        data.update(tokens)

        return data


class AccessTokenRefreshSerializer(
    TokenRefreshSerializer,
    BaseAuthenticationSerializer,
):
    def validate(self, attrs):
        tokens = super().validate(attrs)

        user_id = RefreshToken(tokens[REFRESH]).get(key=api_settings.USER_ID_CLAIM)

        try:
            user = get_users(id=user_id).get()
        except (User.DoesNotExist, User.MultipleObjectsReturned) as e:
            self.raiseInvalidUser()

        data = user_to_json(user=user)
        data.update(tokens)

        return data
