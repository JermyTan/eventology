from django.urls import path
from .views import LoginView, AccessTokenRefreshView

urlpatterns = [
    path("login", LoginView.as_view(), name="login"),
    path("refresh", AccessTokenRefreshView.as_view(), name="token_refresh"),
]
