from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLES = [
        ("athlete", "Athlete"),
        ("coach", "Coach"),
        ("student", "Student"),
        ("enthusiast", "Enthusiast")
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLES, default="athlete")
    GENDERS = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    ]
    gender = models.CharField(max_length=10, choices=GENDERS, default="male", blank=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True)
    points = models.IntegerField(default=0)
    badges = models.JSONField(default=list)
    country = models.CharField(max_length=100, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    social_media_link = models.URLField(blank=True)

    # Added fields for the new UI
    timezone = models.CharField(max_length=100, blank=True, default="CET (UTC+1)")
    day_streak = models.IntegerField(default=14)
    certificates = models.IntegerField(default=8)
    learning_time_hours = models.IntegerField(default=42)
    contributions = models.IntegerField(default=128)
    def __str__(self):
        return f"{self.user.username} — {self.role}"
    