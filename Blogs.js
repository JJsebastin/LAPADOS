import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Blog } from "@/entities/Blog";
import { User } from "@/entities/User";
import { motion } from "framer-motion";
import { Plus, MessageSquare, ThumbsUp, TrendingUp, Clock, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("latest");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      const sortOrder = filter === 'popular' ? '-likes_count' : '-created_date';
      const blogData = await Blog.list(sortOrder);
      setBlogs(blogData);
    } catch (error) {
      console.error("Error loading blog data:", error);
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleLike = async (blogId) => {
    if (!user) return;
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) return;
    
    const alreadyLiked = blog.liked_by?.includes(user.email);
    const newLikedBy = alreadyLiked ? blog.liked_by.filter(e => e !== user.email) : [...(blog.liked_by || []), user.email];
    const newLikesCount = newLikedBy.length;
    
    await Blog.update(blogId, { liked_by: newLikedBy, likes_count: newLikesCount });
    setBlogs(blogs.map(b => b.id === blogId ? { ...b, liked_by: newLikedBy, likes_count: newLikesCount } : b));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Blogs & Infographics</h1>
            <p className="text-xl text-slate-600">Community knowledge and official materials.</p>
          </div>
          <Link to={createPageUrl("CreateBlog")}>
            <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Create Post</Button>
          </Link>
        </motion.div>

        <div className="flex gap-2">
          <Button variant={filter === 'latest' ? 'default' : 'outline'} onClick={() => setFilter('latest')}><Clock className="w-4 h-4 mr-2" />Latest</Button>
          <Button variant={filter === 'popular' ? 'default' : 'outline'} onClick={() => setFilter('popular')}><TrendingUp className="w-4 h-4 mr-2" />Popular</Button>
        </div>

        <div className="space-y-6">
          {isLoading ? (Array(3).fill(0).map((_, i) => <Card key={i} className="animate-pulse h-48 bg-slate-200"></Card>)) : (
            blogs.map((blog, index) => (
              <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  {blog.type === 'infographic' && blog.image_url && (
                    <img src={blog.image_url} alt={blog.title} className="rounded-t-lg object-cover w-full h-48" />
                  )}
                  <CardHeader>
                    <div className="flex items-start gap-4">
                       <Avatar><AvatarFallback>{blog.author_name?.[0]?.toUpperCase()}</AvatarFallback></Avatar>
                      <div>
                        <Link to={createPageUrl(`BlogDetail?id=${blog.id}`)}>
                          <CardTitle className="text-xl font-bold text-slate-900 hover:text-blue-600">{blog.title}</CardTitle>
                        </Link>
                        <p className="text-sm text-slate-500">
                          By {blog.author_name} • {formatDistanceToNow(new Date(blog.created_date), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 line-clamp-3">{blog.content}</p>
                  </CardContent>
                  <CardFooter className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => handleLike(blog.id)}>
                      <ThumbsUp className={`w-4 h-4 mr-2 ${blog.liked_by?.includes(user?.email) ? 'text-blue-600' : ''}`} />
                      {blog.likes_count} Likes
                    </Button>
                    <Link to={createPageUrl(`BlogDetail?id=${blog.id}`)}><Button variant="ghost" size="sm"><MessageSquare className="w-4 h-4 mr-2" />Comments</Button></Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
