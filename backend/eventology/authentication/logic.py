from users.models import User

from rest_framework_simplejwt.tokens import RefreshToken

from eventology.common.constants import REFRESH, ACCESS


def get_tokens(user: User) -> dict:
    refreshToken = RefreshToken.for_user(user)

    return {
        REFRESH: str(refreshToken),
        ACCESS: str(refreshToken.access_token),
    }
