from django.contrib import admin
from .models import NewsArticle

@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'source_name', 'published_date', 'is_published')
    list_filter = ('is_published', 'source_name', 'published_date')
    search_fields = ('title', 'content', 'source_name')
    date_hierarchy = 'published_date'
