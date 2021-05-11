from django.contrib import admin

from .models import (
    Event,
    EventCategory,
    EventSignUp,
    EventLike,
    EventComment,
)

# Register your models here.
admin.site.register(Event)
admin.site.register(EventCategory)
admin.site.register(EventSignUp)
admin.site.register(EventLike)
admin.site.register(EventComment)
