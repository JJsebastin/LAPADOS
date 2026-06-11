from django.views.generic import ListView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import NewsArticle

class NewsListView(LoginRequiredMixin, ListView):
    model = NewsArticle
    template_name = 'news/list.html'
    context_object_name = 'articles'
    
    def get_queryset(self):
        return NewsArticle.objects.filter(is_published=True)

class NewsDetailView(LoginRequiredMixin, DetailView):
    model = NewsArticle
    template_name = 'news/detail.html'
    context_object_name = 'article'

    def get_queryset(self):
        return NewsArticle.objects.filter(is_published=True)
