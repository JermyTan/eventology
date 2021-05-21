from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.db.models import Q, F

from eventology.common.models import TimestampedModel
from users.models import User

# Create your models here.
class EventCategory(TimestampedModel):
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name}"


class Event(TimestampedModel):
    title = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(
        EventCategory, on_delete=models.SET_NULL, blank=True, null=True
    )
    image_urls = ArrayField(models.URLField(), default=list, blank=True)
    image_ids = ArrayField(models.CharField(max_length=100), default=list, blank=True)
    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()
    venue = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(image_urls__len=F("image_ids__len")),
                name="num_image_urls_eq_num_image_ids",
            ),
            models.CheckConstraint(
                check=Q(start_date_time__lte=F("end_date_time")),
                name="event_start_date_time_lte_end_date_time",
            ),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} | {self.creator}"


class EventSignUp(TimestampedModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user_id", "event_id"], name="unique_user_event_signup"
            )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.name} | {self.event}"


class EventLike(TimestampedModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user_id", "event_id"], name="unique_user_event_like"
            )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.name} | {self.event}"


class EventComment(TimestampedModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.user.name} | {self.event}"
