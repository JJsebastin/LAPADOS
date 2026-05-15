import markdown as md
from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter(name='markdown')
def render_markdown(value):
    """
    Converts a Markdown string to safe HTML with common extensions.
    Usage in template: {{ blog.content|markdown }}
    """
    extensions = [
        'markdown.extensions.fenced_code',
        'markdown.extensions.tables',
        'markdown.extensions.nl2br',
        'markdown.extensions.sane_lists',
        'markdown.extensions.toc',
    ]
    html = md.markdown(value or '', extensions=extensions)
    return mark_safe(html)
