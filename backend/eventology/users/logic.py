from django.db.models import QuerySet

from eventology.common.constants import ID, NAME, EMAIL, CREATED_AT, UPDATED_AT
from eventology.common.parsers import parse_datetime_to_ms_timestamp

from .models import User


def user_to_json(user: User) -> dict:
    return {
        ID: user.id,
        NAME: user.name,
        EMAIL: user.email,
        CREATED_AT: parse_datetime_to_ms_timestamp(user.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(user.updated_at),
    }


def get_users(*args, **kwargs) -> QuerySet[User]:
    return User.objects.filter(*args, **kwargs)
