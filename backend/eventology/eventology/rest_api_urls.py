from django.urls import include, path


urlpatterns = [
    path("gateway/", include("authentication.urls")),
    path("events/", include("events.urls")),
]
