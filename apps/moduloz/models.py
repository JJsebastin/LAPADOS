from django.db import models
from django.contrib.auth.models import User

class Module(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=10, default="📚")
    order = models.IntegerField(default=0)
    content = models.TextField()          # HTML/rich text
    duration_mins = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title

class Quiz(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="quizzes")
    question = models.TextField()
    option_a = models.CharField(max_length=300)
    option_b = models.CharField(max_length=300)
    option_c = models.CharField(max_length=300)
    option_d = models.CharField(max_length=300)
    correct = models.CharField(max_length=1, choices=[("A","A"),("B","B"),("C","C"),("D","D")])
    explanation = models.TextField(blank=True)

    def __str__(self):
        return f"Q: {self.question[:60]}"

class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    score = models.IntegerField()
    total = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def percentage(self):
        return int((self.score / self.total) * 100) if self.total else 0
        