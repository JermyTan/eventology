from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

from eventology.common.exceptions import BadRequest

from .permission_middlewares import check_access
from .models import User
from .logic import get_users, user_to_json

# Create your views here.
class SingleUserView(APIView):
    @check_access
    def get(self, request, requester: User, user_id: int):
        try:
            user = get_users(id=user_id).get()
        except User.DoesNotExist as e:
            raise NotFound(detail="No user found.", code="not_found")
        except Exception as e:
            raise BadRequest(e)

        data = user_to_json(user)

        return Response(data, status=status.HTTP_200_OK)
