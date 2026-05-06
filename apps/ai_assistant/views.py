import os, json, base64
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from groq import Groq

# Configure Groq
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are LAPDOS AI — an expert anti-doping assistant trained on WADA guidelines, 
the Prohibited List, supplement safety, and athlete health. When analyzing drugs/supplements:
1. Identify the substance name if visible
2. State if it's on the WADA Prohibited List
3. Mention if a TUE (Therapeutic Use Exemption) is required
4. Give a clear SAFE / CAUTION / PROHIBITED verdict
5. Recommend consulting a sports physician before use
Be concise, factual, and use bullet points. Never encourage doping."""

@login_required
def assistant_page(request):
    return render(request, "ai_assistant/chat.html")

@login_required
@require_POST
def chat(request):
    data = json.loads(request.body)
    message = data.get("message", "")
    history = data.get("history", [])  # [{role, content}, ...]

    try:
        # Convert history to Groq format
        groq_history = [{"role": "system", "content": SYSTEM_PROMPT}]
        for h in history:
            groq_history.append({
                "role": "user" if h["role"] == "user" else "assistant",
                "content": h["content"]
            })
        
        # Add the current message
        groq_history.append({"role": "user", "content": message})

        chat_completion = client.chat.completions.create(
            messages=groq_history,
            model="llama-3.3-70b-versatile",
        )

        return JsonResponse({"reply": chat_completion.choices[0].message.content})

    except Exception as e:
        return JsonResponse({"reply": f"Error: {str(e)}"}, status=500)


@login_required
@require_POST
def analyze_image(request):
    image_file = request.FILES.get("image")
    if not image_file:
        return JsonResponse({"error": "No image uploaded"}, status=400)

    try:
        # Read image bytes and encode to base64
        image_data = image_file.read()
        mime_type = image_file.content_type  # e.g. image/jpeg
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

        return JsonResponse({"result": chat_completion.choices[0].message.content})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
