from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import UserProfile
from apps.moduloz.models import QuizAttempt
from apps.blogs.models import Blog

@login_required
def profile(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    attempts = QuizAttempt.objects.filter(user=request.user).order_by("-created_at")[:5]
    blogs = Blog.objects.filter(author=request.user).order_by("-created_at")[:5]
    published_blogs_count = Blog.objects.filter(author=request.user, is_approved=True).count()
    return render(request, "accounts/profile.html", {
        "profile": profile, "attempts": attempts, "blogs": blogs, "published_blogs_count": published_blogs_count
    })

@login_required
def edit_profile(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if request.method == "POST":
        user = request.user
        user.first_name = request.POST.get("first_name", user.first_name)
        user.last_name = request.POST.get("last_name", user.last_name)
        user.email = request.POST.get("email", user.email)
        user.save()

        profile.country = request.POST.get("country", profile.country)
        profile.nationality = request.POST.get("nationality", profile.nationality)
        profile.social_media_link = request.POST.get("social_media_link", profile.social_media_link)
        profile.gender = request.POST.get("gender", profile.gender)
        
        if "avatar" in request.FILES:
            profile.avatar = request.FILES["avatar"]
            
        profile.save()
        return redirect("profile")
        
    return render(request, "accounts/edit_profile.html", {"profile": profile})