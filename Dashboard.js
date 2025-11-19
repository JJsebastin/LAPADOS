
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Award, Users, Brain, TrendingUp, Target, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";
import { UserProgress } from "@/entities/UserProgress";
import { User } from "@/entities/User";
import { Post } from "@/entities/Post";

export default function Dashboard() {
  const [userProgress, setUserProgress] = useState(null);
  const [user, setUser] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const progress = await UserProgress.filter({user_email: currentUser.email});
      if (progress.length > 0) {
        setUserProgress(progress[0]);
      }

      const posts = await Post.list("-created_date", 3);
      setRecentPosts(posts);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getXPToNextLevel = () => {
    if (!userProgress) return 100;
    const currentLevel = userProgress.level;
    return currentLevel * 200; // 200 XP per level
  };

  const getXPProgress = () => {
    if (!userProgress) return 0;
    const xpForCurrentLevel = (userProgress.level - 1) * 200;
    const xpInCurrentLevel = userProgress.total_points - xpForCurrentLevel;
    const xpNeededForNext = 200;
    return Math.min((xpInCurrentLevel / xpNeededForNext) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Athlete'}! 🏆
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Ready to continue your clean sport journey?
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Current Streak</CardTitle>
                <Zap className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{userProgress?.current_streak || 0}</div>
                <p className="text-xs text-slate-500">days in a row</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total XP</CardTitle>
                <Star className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{userProgress?.total_points || 0}</div>
                <p className="text-xs text-slate-500">experience points</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Level</CardTitle>
                <Award className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{userProgress?.level || 1}</div>
                <div className="mt-2">
                  <Progress value={getXPProgress()} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">{Math.round(getXPProgress())}% to next level</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Badges Earned</CardTitle>
                <Target className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{userProgress?.earned_badges?.length || 0}</div>
                <p className="text-xs text-slate-500">achievements unlocked</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Users className="h-6 w-6" />
                Join the Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 mb-4">
                Share your journey and connect with fellow clean athletes.
              </p>
              <Link to={createPageUrl("Community")}>
                <Button variant="secondary" className="w-full">
                  View Community Feed
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Brain className="h-6 w-6" />
                Take a Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-4">
                Test your knowledge and earn XP with our interactive quizzes.
              </p>
              <Link to={createPageUrl("Quiz")}>
                <Button variant="secondary" className="w-full">
                  Start Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Latest Community Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-slate-900 mb-2 truncate">{post.title}</h4>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>by {post.author_name}</span>
                      <span>{post.likes_count} likes</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

