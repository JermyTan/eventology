from django.db.models import QuerySet

from eventology.common.constants import (
    ID,
    CREATED_AT,
    UPDATED_AT,
    TITLE,
    CREATOR,
    VENUE,
    DESCRIPTION,
    START_DATE_TIME,
    END_DATE_TIME,
    IMAGES,
    CATEGORY,
    LIKE_COUNT,
    SIGN_UP_COUNT,
    HAS_LIKED,
    HAS_SIGN_UPED,
    SIGN_UPS,
    LIKES,
    COMMENTS,
    USER,
    EVENT_ID,
    CONTENT,
)
from eventology.common.parsers import parse_datetime_to_ms_timestamp
from users.logic import user_to_json
from users.models import User

from .models import Event, EventSignUp, EventLike, EventComment


def get_events(*args, **kwargs) -> QuerySet[Event]:
    return Event.objects.filter(*args, **kwargs)


def get_event_sign_ups(*args, **kwargs) -> QuerySet[EventSignUp]:
    return EventSignUp.objects.filter(*args, **kwargs)


def get_event_likes(*args, **kwargs) -> QuerySet[EventLike]:
    return EventLike.objects.filter(*args, **kwargs)


def get_event_comments(*args, **kwargs) -> QuerySet[EventComment]:
    return EventComment.objects.filter(*args, **kwargs)


def event_sign_up_to_json(event_sign_up: EventSignUp) -> dict:
    return {
        ID: event_sign_up.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(event_sign_up.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(event_sign_up.updated_at),
        USER: user_to_json(event_sign_up.user),
        EVENT_ID: event_sign_up.event_id,
    }


def event_like_to_json(event_like: EventLike) -> dict:
    return {
        ID: event_like.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(event_like.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(event_like.updated_at),
        USER: user_to_json(event_like.user),
        EVENT_ID: event_like.event_id,
    }


def event_comment_to_json(event_comment: EventComment) -> dict:
    return {
        ID: event_comment.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(event_comment.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(event_comment.updated_at),
        USER: user_to_json(event_comment.user),
        EVENT_ID: event_comment.event_id,
        CONTENT: event_comment.content,
    }


def event_to_json(
    event: Event, user: User, include_additional_details: bool = False
) -> dict:
    data = {
        ID: event.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(event.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(event.updated_at),
        TITLE: event.title,
        CREATOR: user_to_json(event.creator),
        CATEGORY: event.category.name,
        IMAGES: event.image_urls,
        START_DATE_TIME: parse_datetime_to_ms_timestamp(event.start_date_time),
        END_DATE_TIME: parse_datetime_to_ms_timestamp(event.end_date_time),
        VENUE: event.venue,
        DESCRIPTION: event.description,
        SIGN_UP_COUNT: event.eventsignup_set.count(),
        LIKE_COUNT: event.eventlike_set.count(),
        HAS_SIGN_UPED: get_event_sign_ups(event=event, user=user).exists(),
        HAS_LIKED: get_event_likes(event=event, user=user).exists(),
    }

    if include_additional_details:
        additional_data = {
            SIGN_UPS: [
                event_sign_up_to_json(event_sign_up)
                for event_sign_up in get_event_sign_ups(event=event)
            ],
            LIKES: [
                event_like_to_json(event_like)
                for event_like in get_event_likes(event=event)
            ],
            COMMENTS: [
                event_comment_to_json(event_comment)
                for event_comment in get_event_comments(event=event)
            ],
        }

        data.update(additional_data)

    return data
