from django.db import models
from django.utils import timezone

class NewsArticle(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(help_text="Write your article here using Markdown formatting.")
    image = models.ImageField(upload_to="news_images/", blank=True, null=True, help_text="Cover image for the news article.")
    source_name = models.CharField(max_length=100, blank=True, help_text="e.g., WADA, Quora, Twitter")
    source_url = models.URLField(blank=True, help_text="Original link to the news source")
    
    is_published = models.BooleanField(default=True)
    published_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title
