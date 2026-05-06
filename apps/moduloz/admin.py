from django.contrib import admin
from .models import Module, Quiz, QuizAttempt

class QuizInline(admin.TabularInline):
    model = Quiz
    extra = 2
    fields = ("question", "option_a", "option_b", "option_c", "option_d", "correct", "explanation")

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("order", "icon", "title", "duration_mins", "created_at")
    list_display_links = ("title",)
    list_editable = ("order",)
    search_fields = ("title",)
    prepopulated_fields = {"slug": ("title",)}
    inlines = [QuizInline]


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("module", "question")
    list_filter = ("module",)

@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ("user", "module", "score", "total", "created_at")
    list_filter = ("module",)
