from django.db import models
from eventology.common.models import TimestampedModel

# Create your models here.
class User(TimestampedModel):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    profile_image_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.email})"
