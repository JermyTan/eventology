from django.urls import path

from .views import (
    EventCategoriesView,
    EventsView,
    SingleEventView,
    EventSignUpsView,
    EventLikesView,
    EventCommentsView,
)

urlpatterns = [
    path("", EventsView.as_view(), name="events"),
    path("categories", EventCategoriesView.as_view(), name="event_categories"),
    path("signups", EventSignUpsView.as_view(), name="event_sign_ups"),
    path("likes", EventLikesView.as_view(), name="event_likes"),
    path("comments", EventCommentsView.as_view(), name="event_comments"),
    path("<int:event_id>", SingleEventView.as_view(), name="single_event"),
]
