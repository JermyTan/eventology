from django.urls import path

from .views import SingleUserView

urlpatterns = [
    path("<int:user_id>", SingleUserView.as_view(), name="single_user"),
]
