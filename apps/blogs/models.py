from django.db import models
from django.contrib.auth.models import User

class Blog(models.Model):
    TYPES = [("article","Article"),("infographic","Infographic"),("awareness","Awareness Post")]
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    post_type = models.CharField(max_length=20, choices=TYPES, default="article")
    content = models.TextField()
    cover_image = models.ImageField(upload_to="blogs/", blank=True)
    tags = models.CharField(max_length=200, blank=True)
    is_approved = models.BooleanField(default=False)
    ai_check_result = models.TextField(blank=True)   # AI authenticity check result
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title