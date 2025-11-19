import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Blog } from "@/entities/Blog";
import { Comment } from "@/entities/Comment";
import { User } from "@/entities/User";
import { ArrowLeft, MessageSquare, ThumbsUp, Send } from "lucide-react";
import { format } from "date-fns";

export default function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const blogId = new URLSearchParams(location.search).get("id");

  const loadData = useCallback(async () => {
    if (!blogId) return;
    setIsLoading(true);
    try {
      const [blogData, commentData, currentUser] = await Promise.all([
        Blog.get(blogId),
        Comment.filter({ blog_id: blogId }, "-created_date"),
        User.me(),
      ]);
      setBlog(blogData);
      setComments(commentData);
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading details:", error);
    }
    setIsLoading(false);
  }, [blogId]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleLike = async () => {
    if (!user || !blog) return;
    const alreadyLiked = blog.liked_by?.includes(user.email);
    const newLikedBy = alreadyLiked ? blog.liked_by.filter(e => e !== user.email) : [...(blog.liked_by || []), user.email];
    const newLikesCount = newLikedBy.length;
    
    await Blog.update(blogId, { liked_by: newLikedBy, likes_count: newLikesCount });
    setBlog({ ...blog, liked_by: newLikedBy, likes_count: newLikesCount });
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    const createdComment = await Comment.create({ blog_id: blogId, content: newComment, author_email: user.email, author_name: user.full_name });
    setComments([createdComment, ...comments]);
    setNewComment("");
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!blog) return <div className="p-6">Post not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to={createPageUrl("Blogs")} className="flex items-center gap-2 text-slate-600 hover:text-slate-900"><ArrowLeft className="w-4 h-4" />Back to Blogs</Link>
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
          {blog.type === 'infographic' && blog.image_url && <img src={blog.image_url} alt={blog.title} className="rounded-t-lg object-cover w-full" />}
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-slate-900">{blog.title}</CardTitle>
            <div className="flex items-center gap-3 text-sm text-slate-500 pt-2">
              <Avatar className="w-8 h-8"><AvatarFallback>{blog.author_name?.[0]?.toUpperCase()}</AvatarFallback></Avatar>
              <span>By {blog.author_name}</span><span>•</span><span>{format(new Date(blog.created_date), 'MMMM d, yyyy')}</span>
            </div>
          </CardHeader>
          <CardContent><p className="text-slate-700 whitespace-pre-wrap">{blog.content}</p></CardContent>
          <CardFooter className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleLike}><ThumbsUp className={`w-4 h-4 mr-2 ${blog.liked_by?.includes(user?.email) ? 'text-blue-600' : ''}`} />{blog.likes_count} Likes</Button>
            <Button variant="ghost" size="sm"><MessageSquare className="w-4 h-4 mr-2" />{comments.length} Comments</Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
          <CardHeader><CardTitle className="text-xl font-bold">Comments</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCommentSubmit} className="flex items-start gap-4 mb-6">
              <Avatar><AvatarFallback>{user?.full_name?.[0]?.toUpperCase()}</AvatarFallback></Avatar>
              <div className="flex-1 space-y-2">
                <Textarea placeholder="Add your comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700"><Send className="w-3 h-3 mr-2"/>Post Comment</Button>
              </div>
            </form>
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-4">
                  <Avatar><AvatarFallback>{comment.author_name?.[0]?.toUpperCase()}</AvatarFallback></Avatar>
                  <div className="flex-1 bg-slate-100 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{comment.author_name}</span>
                      <span className="text-xs text-slate-500">{format(new Date(comment.created_date), 'PPp')}</span>
                    </div>
                    <p className="text-sm text-slate-800">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}