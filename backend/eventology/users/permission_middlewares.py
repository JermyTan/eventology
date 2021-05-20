from django.utils.translation import gettext_lazy as _

from rest_framework.exceptions import AuthenticationFailed

from .models import User
from .logic import get_users


def check_access(view_method):
    def _arguments_wrapper(instance, request, *args, **kwargs):
        requester_id = request.user.id

        try:
            requester = get_users(id=requester_id).get()

        except (User.DoesNotExist, User.MultipleObjectsReturned) as e:
            raise AuthenticationFailed(
                detail=_("Invalid user."),
                code="invalid_user",
            )

        return view_method(instance, request, requester=requester, *args, **kwargs)

    return _arguments_wrapper
