from datetime import datetime

from django.utils.timezone import make_aware

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from eventology.common.parsers import parse_ms_timestamp_to_datetime
from users.permission_middlewares import check_access
from users.models import User
from .logic import get_events, event_to_json, get_requested_events
from .serializers import GetEventSerializer

# Create your views here.
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
