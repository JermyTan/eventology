from django.db import models
from treeckle.common.models import TimestampedModel

# Create your models here.
class User(TimestampedModel):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.name} ({self.email})"
