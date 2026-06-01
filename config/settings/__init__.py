"""
Settings package — defaults to development settings for backward compatibility.
Production deployments should set DJANGO_SETTINGS_MODULE=config.settings.production
"""
from config.settings.development import *  # noqa: F401,F403
