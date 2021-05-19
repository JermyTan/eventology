from django.urls import path

from .views import EventCategoriesView, EventsView

urlpatterns = [
    path("", EventsView.as_view(), name="events"),
    path("categories", EventCategoriesView.as_view(), name="event_categories"),
]
