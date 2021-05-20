from datetime import datetime

from django.db import IntegrityError
from django.utils.timezone import make_aware

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

from eventology.common.parsers import parse_ms_timestamp_to_datetime
from eventology.common.exceptions import Conflict, BadRequest
from users.permission_middlewares import check_access
from users.models import User
from .logic import (
    get_event_categories,
    get_events,
    event_category_to_json,
    event_to_json,
    event_sign_up_to_json,
    event_like_to_json,
    event_comment_to_json,
    get_requested_events,
    get_requested_event_sign_ups,
    get_requested_event_likes,
    get_requested_event_comments,
    create_event_sign_up,
    create_event_like,
    create_event_comment,
    delete_event_sign_ups,
    delete_event_likes,
    delete_event_comments,
)
from .serializers import (
    GetEventSerializer,
    GetAdditionalEventDataSerializer,
    PostSerializer,
    PostEventCommentSerializer,
    DeleteSerializer,
)
from .models import Event

# Create your views here.
class EventCategoriesView(APIView):
    @check_access
    def get(self, request, requester: User):
        data = [event_category_to_json(category) for category in get_event_categories()]

        return Response(data, status=status.HTTP_200_OK)


class EventsView(APIView):
    @check_access
    def get(self, request, requester: User):
        serializer = GetEventSerializer(data=request.query_params.dict())

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        user_id = validated_data.get("user_id", None)
        category = validated_data.get("category", None)
        start_date_time = validated_data.get("start_date_time", None)
        end_date_time = validated_data.get("end_date_time", None)
        offset = validated_data.get("offset", 0)
        limit = validated_data.get("limit", None)

        events = get_requested_events(
            user_id=user_id,
            category=category,
            start_date_time=parse_ms_timestamp_to_datetime(start_date_time)
            if start_date_time is not None
            else make_aware(datetime.min),
            end_date_time=parse_ms_timestamp_to_datetime(end_date_time)
            if end_date_time is not None
            else make_aware(datetime.max),
            offset=offset,
            limit=limit,
        )

        data = [event_to_json(event=event, user=requester) for event in events]

        return Response(data, status=status.HTTP_200_OK)


class EventSignUpsView(APIView):
    @check_access
    def get(self, request, requester: User):
        serializer = GetAdditionalEventDataSerializer(data=request.query_params.dict())

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        event_id = validated_data.get("event_id", None)
        user_id = validated_data.get("user_id", None)

        event_sign_ups = get_requested_event_sign_ups(
            event_id=event_id, user_id=user_id
        )

        data = [
            event_sign_up_to_json(event_sign_up) for event_sign_up in event_sign_ups
        ]

        return Response(data, status=status.HTTP_200_OK)

    @check_access
    def post(self, request, requester: User):
        serializer = PostSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        event_id = serializer.validated_data.get("event_id", None)

        try:
            new_event_sign_up = create_event_sign_up(event_id=event_id, user=requester)
        except (Event.DoesNotExist, Event.MultipleObjectsReturned) as e:
            raise NotFound("No event found.", code="not_found")
        except IntegrityError as e:
            raise Conflict(detail="Event has already been signed up.")
        except Exception as e:
            raise BadRequest(e)

        data = event_sign_up_to_json(new_event_sign_up)

        return Response(data, status=status.HTTP_201_CREATED)

    @check_access
    def delete(self, request, requester: User):
        serializer = DeleteSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        event_sign_up_ids = serializer.validated_data.get("ids", [])

        deleted_event_sign_ups = delete_event_sign_ups(ids=event_sign_up_ids)

        data = [
            event_sign_up_to_json(event_sign_up)
            for event_sign_up in deleted_event_sign_ups
        ]

        return Response(data, status=status.HTTP_200_OK)


class EventLikesView(APIView):
    @check_access
    def get(self, request, requester: User):
        serializer = GetAdditionalEventDataSerializer(data=request.query_params.dict())

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        event_id = validated_data.get("event_id", None)
        user_id = validated_data.get("user_id", None)

        event_likes = get_requested_event_likes(event_id=event_id, user_id=user_id)

        data = [event_like_to_json(event_like) for event_like in event_likes]

        return Response(data, status=status.HTTP_200_OK)

    @check_access
    def post(self, request, requester: User):
        serializer = PostSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        event_id = serializer.validated_data.get("event_id", None)

        try:
            new_event_like = create_event_like(event_id=event_id, user=requester)
        except (Event.DoesNotExist, Event.MultipleObjectsReturned) as e:
            raise NotFound("No event found.", code="not_found")
        except IntegrityError as e:
            raise Conflict(detail="Event has already been liked.")
        except Exception as e:
            raise BadRequest(e)

        data = event_like_to_json(new_event_like)

        return Response(data, status=status.HTTP_201_CREATED)

    @check_access
    def delete(self, request, requester: User):
        serializer = DeleteSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        event_like_ids = serializer.validated_data.get("ids", [])

        deleted_event_likes = delete_event_likes(ids=event_like_ids)

        data = [event_like_to_json(event_like) for event_like in deleted_event_likes]

        return Response(data, status=status.HTTP_200_OK)


class EventCommentsView(APIView):
    @check_access
    def get(self, request, requester: User):
        serializer = GetAdditionalEventDataSerializer(data=request.query_params.dict())

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        event_id = validated_data.get("event_id", None)
        user_id = validated_data.get("user_id", None)

        event_comments = get_requested_event_comments(
            event_id=event_id, user_id=user_id
        )

        data = [
            event_comment_to_json(event_comment) for event_comment in event_comments
        ]

        return Response(data, status=status.HTTP_200_OK)

    @check_access
    def post(self, request, requester: User):
        serializer = PostEventCommentSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        event_id = validated_data.get("event_id", None)
        content = validated_data.get("content", "")

        try:
            new_event_comment = create_event_comment(
                event_id=event_id, user=requester, content=content
            )
        except (Event.DoesNotExist, Event.MultipleObjectsReturned) as e:
            raise NotFound("No event found.", code="not_found")
        except Exception as e:
            raise BadRequest(e)

        data = event_comment_to_json(new_event_comment)

        return Response(data, status=status.HTTP_201_CREATED)

    @check_access
    def delete(self, request, requester: User):
        serializer = DeleteSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        event_comment_ids = serializer.validated_data.get("ids", [])

        deleted_event_comments = delete_event_comments(ids=event_comment_ids)

        data = [
            event_comment_to_json(event_comment)
            for event_comment in deleted_event_comments
        ]

        return Response(data, status=status.HTTP_200_OK)
