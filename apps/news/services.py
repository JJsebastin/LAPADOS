"""
LAPDOS News — SerpAPI Google News Service
Fetches live news from Google News via SerpAPI for sports/anti-doping topics.
Results are cached to avoid excessive API usage.
"""
import logging
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

# Cache timeout in seconds (30 minutes)
CACHE_TIMEOUT = 60 * 30

# Search queries for different news categories
NEWS_QUERIES = {
    "anti_doping": "doping in sports OR anti-doping OR WADA banned substances",
    "sports": "sports news latest updates OR world athletics OR Olympics",
    "fitness": "bodybuilding fitness OR sports nutrition OR athletic training",
}


def _fetch_serpapi_news(query, num_results=10):
    """
    Fetch news results from SerpAPI's Google News engine.
    Returns a list of article dicts or an empty list on failure.
    """
    api_key = getattr(settings, "SERPAPI_KEY", "")
    if not api_key or api_key == "your_serpapi_key_here":
        logger.warning("SerpAPI key is not configured. Skipping live news fetch.")
        return []

    try:
        from serpapi import GoogleSearch

        params = {
            "engine": "google_news",
            "q": query,
            "gl": "us",
            "hl": "en",
            "api_key": api_key,
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        articles = []
        news_results = results.get("news_results", [])

        for item in news_results[:num_results]:
            # Handle "top stories" sub-stories format
            if "stories" in item:
                for story in item["stories"][:3]:
                    articles.append(_parse_article(story))
            else:
                articles.append(_parse_article(item))

        return articles

    except ImportError:
        logger.error(
            "serpapi package is not installed. "
            "Run: pip install google-search-results"
        )
        return []
    except Exception as e:
        logger.error("SerpAPI fetch error: %s", str(e))
        return []


def _parse_article(item):
    """Parse a single SerpAPI news result into a clean dict."""
    # Extract thumbnail from different possible locations
    thumbnail = ""
    if "thumbnail" in item:
        thumbnail = item["thumbnail"]
    elif "images" in item and isinstance(item["images"], dict):
        thumbnail = item["images"].get("thumbnail", "")

    return {
        "title": item.get("title", "Untitled"),
        "link": item.get("link", "#"),
        "snippet": item.get("snippet", item.get("title", "")),
        "source": item.get("source", {}).get("name", "Unknown")
            if isinstance(item.get("source"), dict)
            else item.get("source", "Unknown"),
        "date": item.get("date", ""),
        "thumbnail": thumbnail,
    }


def get_live_news(category="all", num_per_category=6):
    """
    Get live news articles, with caching.

    Args:
        category: 'anti_doping', 'sports', 'fitness', or 'all'
        num_per_category: Number of articles per category

    Returns:
        dict with keys for each category containing lists of article dicts
    """
    cache_key = f"lapdos_news_{category}_{num_per_category}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    results = {}

    if category == "all":
        for cat_key, query in NEWS_QUERIES.items():
            results[cat_key] = _fetch_serpapi_news(query, num_per_category)
    elif category in NEWS_QUERIES:
        results[category] = _fetch_serpapi_news(
            NEWS_QUERIES[category], num_per_category
        )

    # Only cache if we got results
    if any(results.values()):
        cache.set(cache_key, results, CACHE_TIMEOUT)

    return results


def is_api_configured():
    """Check whether the SerpAPI key is properly set."""
    api_key = getattr(settings, "SERPAPI_KEY", "")
    return bool(api_key) and api_key != "your_serpapi_key_here"
