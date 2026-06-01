"""
LAPDOS — Production Settings
Run with: DJANGO_SETTINGS_MODULE=config.settings.production
"""
import os
from .base import *  # noqa: F401,F403

DEBUG = False
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

# ─── HTTPS Enforcement ──────────────────────────────────────
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000       # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True          # HTTPS-only cookies
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"              # Clickjacking protection
SECURE_CONTENT_TYPE_NOSNIFF = True

# ─── Session — Strict in Production ─────────────────────────
SESSION_COOKIE_AGE = 3600             # 1 hour
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

# ─── Database (PostgreSQL) ──────────────────────────────────
# Expects DATABASE_URL env var, e.g.:
# DATABASE_URL=postgres://user:pass@host:5432/dbname
# If not set, falls back to base.py SQLite default

# ─── Content Security Policy (requires django-csp) ──────────
# Uncomment when django-csp is installed:
# MIDDLEWARE += ["csp.middleware.CSPMiddleware"]
# CSP_DEFAULT_SRC = ("'self'",)
# CSP_SCRIPT_SRC = ("'self'", "cdn.jsdelivr.net", "cdnjs.cloudflare.com", "'unsafe-inline'")
# CSP_STYLE_SRC  = ("'self'", "fonts.googleapis.com", "'unsafe-inline'")
# CSP_FONT_SRC   = ("'self'", "fonts.gstatic.com")
# CSP_IMG_SRC    = ("'self'", "data:", "blob:")
# CSP_CONNECT_SRC = ("'self'", "api.groq.com")

# ─── Logging ────────────────────────────────────────────────
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django.security": {
            "handlers": ["console"],
            "level": "WARNING",
        },
    },
}
