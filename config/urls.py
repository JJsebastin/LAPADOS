from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("secure-dashboard-x7/", admin.site.urls),  # Hardened: non-default admin URL
    path("accounts/", include("allauth.urls")),
    path("", include("apps.moduloz.urls")),
    path("blogs/", include("apps.blogs.urls")),
    path("ai/", include("apps.ai_assistant.urls")),
    path("accounts/profile/", include("apps.accounts.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

