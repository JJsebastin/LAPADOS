from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
from .models import Module, Quiz, QuizAttempt
from apps.accounts.models import UserProfile

def dashboard(request):
    modules = Module.objects.all()
    from apps.blogs.models import Blog
    recent_blogs = Blog.objects.filter(is_approved=True)[:3]
    
    # Calculate Streak (dummy implementation for now unless we add real streak logic)
    streak_days = 0
    if request.user.is_authenticated:
        streak_days = QuizAttempt.objects.filter(user=request.user).values('created_at__date').distinct().count()

    # Radar Chart Data
    radar_labels = [m.title for m in modules]
    radar_data = []
    if request.user.is_authenticated:
        for m in modules:
            best_attempt = QuizAttempt.objects.filter(user=request.user, module=m).order_by('-score').first()
            if best_attempt and best_attempt.total > 0:
                radar_data.append(int((best_attempt.score / best_attempt.total) * 100))
            else:
                radar_data.append(0)
    else:
        radar_data = [0] * len(radar_labels)
        
    # Streak Logic (Last 7 days)
    from datetime import timedelta
    from django.utils import timezone
    today = timezone.now().date()
    streak_days_list = []
    
    if request.user.is_authenticated:
        attempts_dates = set(QuizAttempt.objects.filter(user=request.user).values_list('created_at__date', flat=True))
        for i in range(6, -1, -1):
            d = today - timedelta(days=i)
            streak_days_list.append({"date": d, "active": d in attempts_dates})
    else:
        streak_days_list = [{"date": today - timedelta(days=i), "active": False} for i in range(6, -1, -1)]

    stats = [
        ("📚", modules.count() or "5", "Modules"),
        ("❓", "17+", "Quiz Questions"),
        ("🤖", "AI", "Drug Checker"),
        ("🔥", f"{streak_days} Days", "Streak"),
    ]
    return render(request, "moduloz/dashboard.html", {
        "modules": modules,
        "recent_blogs": recent_blogs,
        "stats": stats,
        "radar_labels": json.dumps(radar_labels),
        "radar_data": json.dumps(radar_data),
        "streak_days_list": streak_days_list,
    })

def moduloz_list(request):
    modules = Module.objects.all()
    quizzes = Quiz.objects.all().select_related("module")
    return render(request, "moduloz/list.html", {
        "modules": modules,
        "quizzes": quizzes,
    })


def module_detail(request, slug):
    module = get_object_or_404(Module, slug=slug)
    quizzes = module.quizzes.all()
    return render(request, "moduloz/detail.html", {"module": module, "quizzes": quizzes})

@login_required
@require_POST
def submit_quiz(request, slug):
    module = get_object_or_404(Module, slug=slug)
    data = json.loads(request.body)
    answers = data.get("answers", {})
    quizzes = module.quizzes.all()
    score = 0
    results = []
    for q in quizzes:
        user_ans = answers.get(str(q.id), "")
        correct = user_ans.upper() == q.correct
        if correct:
            score += 1
        results.append({
            "id": q.id, "correct": correct,
            "your_answer": user_ans, "right_answer": q.correct,
            "explanation": q.explanation
        })
    attempt = QuizAttempt.objects.create(
        user=request.user, module=module, score=score, total=quizzes.count()
    )
    # Award points
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    profile.points += score * 10
    if attempt.percentage == 100 and "perfect" not in profile.badges:
        profile.badges.append("perfect")
    profile.save()
    return JsonResponse({"score": score, "total": quizzes.count(),
                         "percentage": attempt.percentage, "results": results})
                         