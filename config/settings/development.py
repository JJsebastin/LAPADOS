"""
LAPDOS — Development Settings
Run with: DJANGO_SETTINGS_MODULE=config.settings.development
"""
from .base import *  # noqa: F401,F403

DEBUG = True
ALLOWED_HOSTS = ["*"]

# Development-friendly session settings
SESSION_COOKIE_AGE = 86400  # 24 hours in dev
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
