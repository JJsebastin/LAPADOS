from django.views.generic import ListView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import NewsArticle
from .services import get_live_news, is_api_configured


class NewsListView(LoginRequiredMixin, ListView):
    model = NewsArticle
    template_name = 'news/list.html'
    context_object_name = 'articles'

    def get_queryset(self):
        return NewsArticle.objects.filter(is_published=True)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Fetch live news from SerpAPI (cached for 30 min)
        context['api_configured'] = is_api_configured()
        if context['api_configured']:
            live_news = get_live_news(category="all", num_per_category=6)
            context['anti_doping_news'] = live_news.get('anti_doping', [])
            context['sports_news'] = live_news.get('sports', [])
            context['fitness_news'] = live_news.get('fitness', [])
        else:
            context['anti_doping_news'] = []
            context['sports_news'] = []
            context['fitness_news'] = []

        # Determine active tab from query param
        context['active_tab'] = self.request.GET.get('tab', 'anti_doping')
        return context


class NewsDetailView(LoginRequiredMixin, DetailView):
    model = NewsArticle
    template_name = 'news/detail.html'
    context_object_name = 'article'

    def get_queryset(self):
        return NewsArticle.objects.filter(is_published=True)
