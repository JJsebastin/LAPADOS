import google.generativeai as genai
import os
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.utils.text import slugify
from django.contrib import messages
from .models import Blog
from .forms import BlogForm

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

FILTER_CHOICES = [
    ("all", "All Posts"),
    ("article", "Articles"),
    ("infographic", "Infographics"),
    ("awareness", "Awareness"),
]

@login_required
def create_blog(request):
    if request.method == "POST":
        form = BlogForm(request.POST, request.FILES)
        if form.is_valid():
            blog = form.save(commit=False)
            blog.author = request.user
            blog.slug = slugify(blog.title)

            blog.is_approved = True  # Automatically publish
            blog.save()
            messages.success(request, "Blog published successfully!")
            return redirect("blog_list")
    else:
        form = BlogForm()
    return render(request, "blogs/create.html", {"form": form})


def blog_list(request):
    blogs = Blog.objects.filter(is_approved=True)
    return render(request, "blogs/list.html", {
        "blogs": blogs,
        "filter_choices": FILTER_CHOICES,
    })

def blog_detail(request, slug):
    blog = get_object_or_404(Blog, slug=slug, is_approved=True)
    return render(request, "blogs/detail.html", {"blog": blog})