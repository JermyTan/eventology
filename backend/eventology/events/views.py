from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permission_middlewares import check_access
from users.models import User
from .logic import get_events, event_to_json

# Create your views here.
class EventsView(APIView):
    @check_access
    def get(self, request, requester: User):
        data = [
            event_to_json(event=event, user=requester)
            for event in get_events().select_related("creator", "category")
        ]

        return Response(data, status=status.HTTP_200_OK)
