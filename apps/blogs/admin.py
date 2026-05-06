from django.contrib import admin
from .models import Blog

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "post_type", "is_approved", "created_at")
    list_filter = ("post_type", "is_approved")
    list_editable = ("is_approved",)
    search_fields = ("title", "author__username", "tags")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("ai_check_result", "created_at")
    fieldsets = (
        (None, {"fields": ("author", "title", "slug", "post_type", "content", "cover_image", "tags")}),
        ("Moderation", {"fields": ("is_approved", "ai_check_result", "created_at")}),
    )
