from typing import Optional, Iterable, Sequence
from datetime import datetime
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
    NAME,
    EVENT,
)
from eventology.common.parsers import parse_datetime_to_ms_timestamp
from users.logic import user_to_json
from users.models import User

from .models import EventCategory, Event, EventSignUp, EventLike, EventComment


def get_event_categories(*args, **kwargs) -> QuerySet[EventCategory]:
    return EventCategory.objects.filter(*args, **kwargs)


def get_events(*args, **kwargs) -> QuerySet[Event]:
    return Event.objects.filter(*args, **kwargs)


def get_event_sign_ups(*args, **kwargs) -> QuerySet[EventSignUp]:
    return EventSignUp.objects.filter(*args, **kwargs)


def get_event_likes(*args, **kwargs) -> QuerySet[EventLike]:
    return EventLike.objects.filter(*args, **kwargs)


def get_event_comments(*args, **kwargs) -> QuerySet[EventComment]:
    return EventComment.objects.filter(*args, **kwargs)


def event_category_to_json(event_category: EventCategory) -> dict:
    return {
        ID: event_category.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(event_category.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(event_category.updated_at),
        NAME: event_category.name,
    }


def event_sign_up_to_json(
    event_sign_up: EventSignUp, user: User, include_event_details: bool = False
) -> dict:
    data = {
        ID: event_sign_up.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(event_sign_up.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(event_sign_up.updated_at),
        USER: user_to_json(event_sign_up.user),
    }

    data.update(
        {EVENT: event_to_json(event=event_sign_up.event, user=user)}
        if include_event_details
        else {EVENT_ID: event_sign_up.event_id}
    )

    return data


def event_like_to_json(
    event_like: EventLike, user: User, include_event_details: bool = False
) -> dict:
    data = {
        ID: event_like.id,
        CREATED_AT: parse_datetime_to_ms_timestamp(event_like.created_at),
        UPDATED_AT: parse_datetime_to_ms_timestamp(event_like.updated_at),
        USER: user_to_json(event_like.user),
    }

    data.update(
        {EVENT: event_to_json(event=event_like.event, user=user)}
        if include_event_details
        else {EVENT_ID: event_like.event_id}
    )

    return data


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

    if event.category is not None:
        data.update({CATEGORY: event.category.name})

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


def get_requested_event_sign_ups(
    event_id: Optional[int], user_id: Optional[int]
) -> QuerySet[EventSignUp]:
    event_sign_ups = get_event_sign_ups().select_related("event", "user")

    if event_id is not None:
        event_sign_ups = event_sign_ups.filter(event_id=event_id)

    if user_id is not None:
        event_sign_ups = event_sign_ups.filter(user_id=user_id)

    return event_sign_ups


def get_requested_event_likes(
    event_id: Optional[int], user_id: Optional[int]
) -> QuerySet[EventLike]:
    event_likes = get_event_likes().select_related("event", "user")

    if event_id is not None:
        event_likes = event_likes.filter(event_id=event_id)

    if user_id is not None:
        event_likes = event_likes.filter(user_id=user_id)

    return event_likes


def get_requested_event_comments(
    event_id: Optional[int], user_id: Optional[int]
) -> QuerySet[EventComment]:
    event_comments = get_event_comments().select_related("event", "user")

    if event_id is not None:
        event_comments = event_comments.filter(event_id=event_id)

    if user_id is not None:
        event_comments = event_comments.filter(user_id=user_id)

    return event_comments


def get_requested_events(
    user_id: Optional[int],
    category: Optional[str],
    start_date_time: datetime,
    end_date_time: datetime,
    offset: int,
    limit: Optional[int],
) -> QuerySet[Event]:
    events = (
        get_events()
        .exclude(end_date_time__lt=start_date_time)
        .exclude(start_date_time__gt=end_date_time)
    ).select_related("creator", "category")

    if user_id is not None:
        events = events.filter(creator_id=user_id)

    if category is not None:
        events = events.filter(category__name=category)

    if limit is not None:
        events = events[offset : offset + limit]
    else:
        events = events[offset:]

    return events


def create_event_sign_up(event_id: int, user: User) -> EventSignUp:
    event = get_events(id=event_id).get()

    new_event_sign_up = EventSignUp.objects.create(event=event, user=user)

    return new_event_sign_up


def create_event_like(event_id: int, user: User) -> EventLike:
    event = get_events(id=event_id).get()

    new_event_like = EventLike.objects.create(event=event, user=user)

    return new_event_like


def create_event_comment(event_id: int, user: User, content: str) -> EventComment:
    event = get_events(id=event_id).get()

    new_event_comment = EventComment.objects.create(
        event=event, user=user, content=content
    )

    return new_event_comment


def delete_event_sign_up(event_id: int, user: User) -> EventSignUp:
    event_sign_up_to_be_deleted = get_event_sign_ups(
        event_id=event_id, user=user
    ).select_related("event", "user")

    deleted_event_sign_up = event_sign_up_to_be_deleted.get()

    event_sign_up_to_be_deleted.delete()

    return deleted_event_sign_up


def delete_event_like(event_id: int, user: User) -> EventLike:
    event_like_to_be_deleted = get_event_likes(
        event_id=event_id, user=user
    ).select_related("event", "user")

    deleted_event_like = event_like_to_be_deleted.get()

    event_like_to_be_deleted.delete()

    return deleted_event_like


def delete_event_comments(ids: Iterable[int]) -> Sequence[EventComment]:
    event_comments_to_be_deleted = get_event_comments(id__in=ids).select_related(
        "event", "user"
    )

    deleted_event_comments = [
        event_comment for event_comment in event_comments_to_be_deleted
    ]

    event_comments_to_be_deleted.delete()

    return deleted_event_comments
