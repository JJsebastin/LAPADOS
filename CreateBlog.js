import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Blog } from "@/entities/Blog";
import { User } from "@/entities/User";
import { UploadFile } from "@/integrations/Core";
import { ArrowLeft, Send, Upload } from "lucide-react";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("blog");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const user = await User.me();
      let imageUrl = "";
      if (imageFile && type === 'infographic') {
        const { file_url } = await UploadFile({ file: imageFile });
        imageUrl = file_url;
      }

      await Blog.create({
        title,
        content,
        type,
        image_url: imageUrl,
        author_email: user.email,
        author_name: user.full_name,
      });
      navigate(createPageUrl("Blogs"));
    } catch (error) {
      console.error("Error creating blog:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("Blogs"))}>
                <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-slate-900">Create New Post</h1>
        </div>
        
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <Input id="title" placeholder="A catchy title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Post Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">Blog / Story</SelectItem>
                      <SelectItem value="infographic">Infographic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {type === 'infographic' && (
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1">Infographic Image</label>
                  <Input id="image" type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
                </div>
              )}

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <Textarea id="content" placeholder="Share your story or describe your infographic..." value={content} onChange={(e) => setContent(e.target.value)} required rows={10} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Publish Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}