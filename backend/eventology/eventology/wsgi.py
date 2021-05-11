"""
WSGI config for eventology project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

## use for dev
from dotenv import load_dotenv

load_dotenv(".env.backend.dev")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "eventology.settings")

application = get_wsgi_application()
