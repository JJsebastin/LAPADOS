from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
from .models import Module, Quiz, QuizAttempt
from apps.accounts.models import UserProfile


def landing(request):
    """Public landing page — redirects authenticated users straight to the dashboard."""
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'landing.html')


@login_required(login_url='/accounts/login/')
def dashboard(request):
    modules = Module.objects.all()
    from apps.blogs.models import Blog
    recent_blogs = Blog.objects.filter(is_approved=True)[:3]
    
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
        
    # Streak Logic (Last 7 days) — timezone-aware local date
    from datetime import timedelta
    from django.utils import timezone
    from django.utils.timezone import localdate

    today = localdate()          # Use local date, not UTC date
    streak_days_list = []
    consecutive_streak = 0

    if request.user.is_authenticated:
        # Get all distinct dates (as local dates) the user attempted a quiz
        raw_dates = QuizAttempt.objects.filter(user=request.user).values_list('created_at', flat=True)
        attempts_dates = set()
        for dt in raw_dates:
            attempts_dates.add(dt.astimezone(timezone.get_current_timezone()).date())

        # Build last-7-days list
        for i in range(6, -1, -1):
            d = today - timedelta(days=i)
            streak_days_list.append({"date": d, "active": d in attempts_dates})

        # Calculate consecutive streak (today backwards)
        check = today
        while check in attempts_dates:
            consecutive_streak += 1
            check -= timedelta(days=1)
    else:
        streak_days_list = [{"date": today - timedelta(days=i), "active": False} for i in range(6, -1, -1)]
        consecutive_streak = 0

    # icon = static image filename in static/img/
    stats = [
        ("cubes.png", modules.count() or "5", "Modules"),
        ("quiz.png", "17+", "Quiz Questions"),
        ("torch.png", f"{consecutive_streak} Day{'s' if consecutive_streak != 1 else ''}", "Streak"),
    ]
    return render(request, "moduloz/dashboard.html", {
        "modules": modules,
        "recent_blogs": recent_blogs,
        "stats": stats,
        "radar_labels": json.dumps(radar_labels),
        "radar_data": json.dumps(radar_data),
        "streak_days_list": streak_days_list,
        "streak_days": consecutive_streak,
    })


@login_required(login_url='/accounts/login/')
def moduloz_list(request):
    modules = Module.objects.all()
    quizzes = Quiz.objects.all().select_related("module")
    return render(request, "moduloz/list.html", {
        "modules": modules,
        "quizzes": quizzes,
    })


@login_required(login_url='/accounts/login/')
def module_detail(request, slug):
    module = get_object_or_404(Module, slug=slug)
    quizzes = module.quizzes.all()
    return render(request, "moduloz/detail.html", {"module": module, "quizzes": quizzes})



MODULE_LESSONS = {
    "what-is-doping": [
        {
            "title": "What is the WADA Code?",
            "tag": "Overview",
            "body": """<p>The <strong>World Anti-Doping Code (WADA Code)</strong> is the core document
            that harmonizes anti-doping policies, rules and regulations within sport organizations
            and among public authorities around the world.</p>
            <p>First adopted in 2003 and subsequently revised in 2009, 2015, and 2021, the Code
            provides the framework for anti-doping policies, rules, and regulations for sport
            organizations and public authorities.</p>""",
            "callouts": [
                {"type":"note","icon":"ℹ️","label":"Key Fact",
                 "text":"The 2021 Code became effective on 1 January 2021 and applies to all signatories."},
                {"type":"tip","icon":"💡","label":"Remember",
                 "text":"WADA does not directly test athletes — testing is conducted by Anti-Doping Organizations (ADOs)."},
            ],
            "diagram": """
            <div class="flow-diagram">
              <div class="flow-node primary">WADA</div>
              <div class="flow-arrow">→</div>
              <div class="flow-node">National ADOs</div>
              <div class="flow-arrow">→</div>
              <div class="flow-node">Sport Federations</div>
              <div class="flow-arrow">→</div>
              <div class="flow-node success">Athletes</div>
            </div>""",
            "diagram_label": "Figure 1 — WADA Code enforcement hierarchy",
            "stats": [
                {"num":"200+","lbl":"Countries"},
                {"num":"670+","lbl":"Signatories"},
                {"num":"2003","lbl":"Year Founded"},
            ],
        },
        {
            "title": "The 11 Anti-Doping Rule Violations",
            "tag": "Core Rules",
            "body": """<p>The WADA Code lists <span class="key-term">11 Anti-Doping Rule Violations (ADRVs)</span>
            that athletes and their support personnel must avoid.</p>
            <p>Understanding each violation is critical — ignorance is <strong>not</strong> a defence under
            the strict liability principle.</p>""",
            "callouts": [
                {"type":"danger","icon":"⚠️","label":"Strict Liability",
                 "text":"An athlete is responsible for any prohibited substance found in their sample, regardless of how it got there."},
            ],
            "table": {
                "cols": ["#","Violation","Who it Applies To","Potential Sanction"],
                "rows": [
                    ["1","Presence of prohibited substance","Athletes","Up to 4 years"],
                    ["2","Use / attempted use","Athletes","Up to 4 years"],
                    ["3","Evading / refusing sample collection","Athletes","Up to 4 years"],
                    ["4","Whereabouts failure (3 in 12 months)","Athletes","1–2 years"],
                    ["5","Tampering with doping control","All persons","Up to 4 years"],
                    ["6","Possession of prohibited substance","Athletes & Support","Up to 4 years"],
                    ["7","Trafficking / attempted trafficking","All persons","4 years to lifetime"],
                    ["8","Administration to athlete","Support personnel","4 years to lifetime"],
                    ["9","Complicity","All persons","Up to 4 years"],
                    ["10","Prohibited association","Athletes","Up to 2 years"],
                    ["11","Acts of retaliation","All persons","Up to 4 years"],
                ],
            },
        },
        {
            "title": "The Prohibited List",
            "tag": "Key Concepts",
            "body": """<p>The <span class="key-term">Prohibited List</span> is updated annually and published
            by WADA every 1 October, coming into effect on 1 January of the following year.</p>
            <p>It is organized into substances prohibited <em>at all times</em>, substances prohibited
            <em>in-competition only</em>, and substances prohibited <em>in particular sports</em>.</p>""",
            "diagram": """
            <div class="pyramid">
              <div class="pyramid-tier" style="background:#E74C3C;width:200px;">S0 — Non-Approved</div>
              <div class="pyramid-tier" style="background:#E67E22;width:260px;">S1 — Anabolic Agents</div>
              <div class="pyramid-tier" style="background:#F59E0B;width:320px;">S2 — Peptide Hormones / EPO</div>
              <div class="pyramid-tier" style="background:#27AE60;width:380px;">S3 — Beta-2 Agonists</div>
              <div class="pyramid-tier" style="background:#2F80ED;width:440px;">S4–S9 — Other Classes</div>
            </div>""",
            "diagram_label": "Figure 2 — Prohibited substance categories (S-classes)",
            "callouts": [
                {"type":"warn","icon":"🔍","label":"Check Before You Take",
                 "text":"Always verify supplements on GlobalDRO.com or via your sport federation before ingesting anything."},
            ],
            "defs": [
                {"term":"TUE","desc":"Therapeutic Use Exemption — allows an athlete to use a prohibited substance for legitimate medical reasons."},
                {"term":"ADAMS","desc":"Anti-Doping Administration & Management System — WADA's online database for whereabouts and TUEs."},
                {"term":"RTP","desc":"Registered Testing Pool — elite athletes subject to enhanced whereabouts requirements."},
            ],
        },
        {
            "title": "Whereabouts & Testing",
            "tag": "Compliance",
            "body": """<p>Elite athletes in the <span class="key-term">Registered Testing Pool (RTP)</span>
            must file quarterly whereabouts information specifying:</p>
            <ul>
              <li>A daily <strong>60-minute time slot</strong> where they can be found for testing</li>
              <li>Regular residence and training locations</li>
              <li>Competition schedule</li>
            </ul>
            <p>Three <strong>Whereabouts Failures</strong> within a 12-month period constitute an ADRV.</p>""",
            "callouts": [
                {"type":"tip","icon":"📱","label":"ADAMS App",
                 "text":"Athletes can submit whereabouts via the ADAMS mobile app, making compliance easier than ever."},
            ],
            "table": {
                "cols": ["Failure Type","Description","Consequence"],
                "rows": [
                    ["Filing Failure","Missed quarterly filing deadline",
                     '<span class="td-badge blue">Warning → Strike</span>'],
                    ["Missed Test","Not present during declared 60-min slot",
                     '<span class="td-badge red">Strike</span>'],
                    ["3 Strikes in 12 months","Combination of above failures",
                     '<span class="td-badge red">1–2 Year Ban</span>'],
                ],
            },
        },
    ],
    # Add more module slugs here as needed
}

DEFAULT_SECTIONS = [
    {
        "title": "Introduction",
        "tag": "Overview",
        "body": "<p>This module covers foundational concepts. Read each section carefully before taking the quiz.</p>",
        "callouts": [
            {"type":"note","icon":"ℹ️","label":"Study Tip",
             "text":"Take notes as you read — the quiz tests comprehension, not memorization."},
        ],
    },
    {
        "title": "Core Concepts",
        "tag": "Theory",
        "body": "<p>The key principles of this topic are explored in detail below. Pay attention to highlighted terms.</p>",
        "callouts": [
            {"type":"tip","icon":"💡","label":"Key Point",
             "text":"Focus on the definitions and the relationships between concepts."},
        ],
    },
    {
        "title": "Practical Application",
        "tag": "Application",
        "body": "<p>Applying what you have learned is essential to mastery. Review the examples and think about how they apply in real-world scenarios.</p>",
        "callouts": [
            {"type":"warn","icon":"⚠️","label":"Important",
             "text":"Always verify information with official sources before making decisions."},
        ],
    },
]


@login_required(login_url='/accounts/login/')
def lesson_detail(request, slug):
    module = get_object_or_404(Module, slug=slug)
    quizzes = module.quizzes.all()
    sections = MODULE_LESSONS.get(slug, DEFAULT_SECTIONS)
    return render(request, "moduloz/lesson.html", {
        "module": module,
        "quizzes": quizzes,
        "sections": sections,
    })

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
                         