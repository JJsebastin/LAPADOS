from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/", views.dashboard, name="dashboard"),
    path("modules/", views.moduloz_list, name="moduloz_list"),
    path("module/<slug:slug>/", views.module_detail, name="module_detail"),
    path("module/<slug:slug>/lesson/", views.lesson_detail, name="lesson_detail"),
    path("module/<slug:slug>/quiz/submit/", views.submit_quiz, name="submit_quiz"),
]
