import os, json, base64, re, logging
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.conf import settings
from groq import Groq

logger = logging.getLogger(__name__)

# Configure Groq
client = Groq(api_key=settings.GROQ_API_KEY)

# Maximum input length to prevent abuse
MAX_INPUT_LENGTH = 2000

SYSTEM_PROMPT = """You are LAPDOS AI — an expert anti-doping assistant trained on WADA guidelines, 
the Prohibited List, supplement safety, and athlete health. When analyzing drugs/supplements:
1. Identify the substance name if visible
2. State if it's on the WADA Prohibited List
3. Mention if a TUE (Therapeutic Use Exemption) is required
4. Give a clear SAFE / CAUTION / PROHIBITED verdict
5. Recommend consulting a sports physician before use
Be concise, factual, and use bullet points. Never encourage doping."""


def _sanitize_input(text: str) -> str:
    """Strip HTML tags and truncate user input for safety."""
    # Remove HTML tags
    cleaned = re.sub(r'<[^>]+>', '', text)
    # Truncate to max length
    return cleaned[:MAX_INPUT_LENGTH].strip()


@login_required
def assistant_page(request):
    return render(request, "ai_assistant/chat.html")

@login_required
@require_POST
def chat(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"error": "Invalid request format."}, status=400)
    
    raw_message = data.get("message", "")
    message = _sanitize_input(raw_message)
    
    if not message:
        return JsonResponse({"error": "Message cannot be empty."}, status=400)
    
    history = data.get("history", [])  # [{role, content}, ...]

    try:
        # Convert history to Groq format
        groq_history = [{"role": "system", "content": SYSTEM_PROMPT}]
        for h in history:
            groq_history.append({
                "role": "user" if h["role"] == "user" else "assistant",
                "content": _sanitize_input(h.get("content", ""))
            })
        
        # Add the current message
        groq_history.append({"role": "user", "content": message})

        chat_completion = client.chat.completions.create(
            messages=groq_history,
            model="llama-3.3-70b-versatile",
        )

        # Log interaction metadata (not content) for audit
        logger.info(
            "AI chat | user=%s | msg_len=%d | history_len=%d",
            request.user.id, len(message), len(history)
        )

        return JsonResponse({"reply": chat_completion.choices[0].message.content})

    except Exception as e:
        logger.error("AI chat error | user=%s | error=%s", request.user.id, str(e))
        # Never expose raw LLM errors to the client
        return JsonResponse({"error": "AI service temporarily unavailable. Please try again."}, status=503)


@login_required
@require_POST
def analyze_image(request):
    image_file = request.FILES.get("image")
    if not image_file:
        return JsonResponse({"error": "No image uploaded."}, status=400)
    
    # Validate file size (5MB limit)
    if image_file.size > 5 * 1024 * 1024:
        return JsonResponse({"error": "Image too large. Maximum size is 5MB."}, status=400)
    
    # Validate MIME type
    allowed_types = {"image/jpeg", "image/png", "image/gif", "image/webp"}
    if image_file.content_type not in allowed_types:
        return JsonResponse({"error": "Invalid image format. Use JPEG, PNG, GIF, or WebP."}, status=400)

    try:
        # Read image bytes and encode to base64
        image_data = image_file.read()
        mime_type = image_file.content_type
        base64_image = base64.b64encode(image_data).decode('utf-8')

        prompt = """Analyze this drug/supplement image for an athlete.
        1. Identify the substance or product name
        2. Check if it's on the WADA Prohibited List
        3. State if a prescription or TUE is required
        4. Give a final verdict: SAFE ✅ / CAUTION ⚠️ / PROHIBITED 🚫
        Be clear and concise."""

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            model="llama-3.2-11b-vision-preview",
        )

        # Log interaction metadata
        logger.info(
            "AI image analysis | user=%s | file_size=%d | mime=%s",
            request.user.id, image_file.size, mime_type
        )

        return JsonResponse({"result": chat_completion.choices[0].message.content})

    except Exception as e:
        logger.error("AI image analysis error | user=%s | error=%s", request.user.id, str(e))
        return JsonResponse({"error": "Image analysis service temporarily unavailable."}, status=503)
