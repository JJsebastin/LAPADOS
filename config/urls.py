from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.moduloz.views import landing

urlpatterns = [
    path("secure-dashboard-x7/", admin.site.urls),  # Hardened: non-default admin URL
    path("accounts/", include("allauth.urls")),
    path("", landing, name="landing"),                    # Public landing page (/ root)
    path("", include("apps.moduloz.urls")),               # Root URLs handled by moduloz app
    path("blogs/", include("apps.blogs.urls")),
    path("news/", include("apps.news.urls")),
    path("accounts/profile/", include("apps.accounts.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
