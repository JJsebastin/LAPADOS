from django import forms
from .models import Blog

class BlogForm(forms.ModelForm):
    class Meta:
        model = Blog
        fields = ["title", "post_type", "content", "cover_image", "tags"]
        widgets = {
            "content": forms.Textarea(attrs={"rows": 10, "class": "w-full"}),
            "tags": forms.TextInput(attrs={"placeholder": "wada, supplements, testing"}),
        }