from django.urls import path
from . import views

urlpatterns = [
    path("", views.assistant_page, name="ai_assistant"),
    path("chat/", views.chat, name="ai_chat"),
    path("analyze/", views.analyze_image, name="ai_analyze"),
]