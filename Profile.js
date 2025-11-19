
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { User as UserIcon, Award, Brain, TrendingUp, Calendar as CalendarIcon, Target } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UserProgress } from "@/entities/UserProgress";
import { User } from "@/entities/User";
import { Badge as BadgeEntity } from "@/entities/Badge";
import { format, subDays, parseISO } from "date-fns";

export default function Profile() {
  const [userProgress, setUserProgress] = useState(null);
  const [user, setUser] = useState(null);
  const [badges, setBadges] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [streakData, setStreakData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfileData = useCallback(async () => {
    try {
      const [currentUser, badgeData] = await Promise.all([
        User.me(),
        BadgeEntity.list()
      ]);
      
      setUser(currentUser);
      setBadges(badgeData);

      const progress = await UserProgress.filter({user_email: currentUser.email});
      if (progress.length > 0) {
        setUserProgress(progress[0]);
        generateActivityData(progress[0]);
        generateStreakData(progress[0]);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
    setIsLoading(false);
  }, []); 

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]); 

  const generateActivityData = (progress) => {
    const quizHistory = progress.quiz_history || [];
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayQuizzes = quizHistory.filter(quiz => {
        const quizDate = new Date(quiz.completed_at);
        return format(quizDate, 'yyyy-MM-dd') === format(quizDate, 'yyyy-MM-dd'); // Corrected comparison from date to quizDate
      });
      
      last7Days.push({
        day: format(date, 'EEE'),
        quizzes: dayQuizzes.length,
        points: dayQuizzes.reduce((sum, quiz) => sum + quiz.score, 0)
      });
    }
    
    setActivityData(last7Days);
  };

  const generateStreakData = (progress) => {
    // Generate a simple 30-day view for streak visualization
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      // Simulate activity - in real app, this would come from actual data
      const hasActivity = i < (progress.current_streak || 0);
      days.push({
        date,
        hasActivity
      });
    }
    setStreakData(days);
  };

  const getXPToNextLevel = () => {
    if (!userProgress) return 100;
    const currentLevel = userProgress.level;
    return currentLevel * 200;
  };

  const getXPProgress = () => {
    if (!userProgress) return 0;
    const xpForCurrentLevel = (userProgress.level - 1) * 200;
    const xpInCurrentLevel = userProgress.total_points - xpForCurrentLevel;
    const xpNeededForNext = 200;
    return Math.min((xpInCurrentLevel / xpNeededForNext) * 100, 100);
  };

  const getEarnedBadges = () => {
    if (!userProgress?.earned_badges || !badges.length) return [];
    return badges.filter(badge => userProgress.earned_badges.includes(badge.id));
  };

  const getAvailableBadges = () => {
    if (!userProgress?.earned_badges || !badges.length) return badges;
    return badges.filter(badge => !userProgress.earned_badges.includes(badge.id));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-slate-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-200 rounded-xl"></div>
            <div className="h-48 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {user?.full_name?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    {user?.full_name || 'Clean Sport Athlete'}
                  </h1>
                  <p className="text-blue-100 mb-4">{user?.email}</p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="text-center">
                      <div className="text-2xl font-bold">Level {userProgress?.level || 1}</div>
                      <div className="text-blue-100 text-sm">Current Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{userProgress?.total_points || 0}</div>
                      <div className="text-blue-100 text-sm">Total XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{userProgress?.current_streak || 0}</div>
                      <div className="text-blue-100 text-sm">Day Streak</div>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="mb-2 text-white/80">Progress to Level {(userProgress?.level || 1) + 1}</div>
                  <Progress value={getXPProgress()} className="w-32 h-3 bg-white/20" />
                  <div className="text-sm text-white/80 mt-1">
                    {Math.round(getXPProgress())}% Complete
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                    <TrendingUp className="w-5 h-5" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="points" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Streak Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                    <CalendarIcon className="w-5 h-5" />
                    Learning Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-10 gap-2 mb-4">
                    {streakData.map((day, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-sm ${
                          day.hasActivity
                            ? "bg-green-500"
                            : "bg-slate-200"
                        }`}
                        title={format(day.date, 'MMM d')}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>30 days ago</span>
                    <span>Today</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                    <Target className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Quizzes Taken</span>
                    </div>
                    <span className="font-semibold">
                      {userProgress?.quiz_history?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-500" />
                      <span className="text-slate-600">Badges Earned</span>
                    </div>
                    <span className="font-semibold">
                      {userProgress?.earned_badges?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-orange-500" />
                      <span className="text-slate-600">Longest Streak</span>
                    </div>
                    <span className="font-semibold">
                      {userProgress?.longest_streak || 0} days
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                    <Award className="w-5 h-5" />
                    Badge Collection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Earned Badges</h4>
                      <div className="grid grid-cols-4 gap-3">
                        {getEarnedBadges().slice(0, 8).map((badge) => (
                          <div key={badge.id} className="text-center">
                            <div className={`w-12 h-12 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold ${
                              badge.color === 'gold' ? 'bg-yellow-500' :
                              badge.color === 'silver' ? 'bg-gray-400' :
                              badge.color === 'bronze' ? 'bg-amber-600' :
                              badge.color === 'blue' ? 'bg-blue-500' :
                              badge.color === 'green' ? 'bg-green-500' :
                              'bg-purple-500'
                            }`}>
                              <Award className="w-6 h-6" />
                            </div>
                            <p className="text-xs text-slate-600 truncate" title={badge.name}>
                              {badge.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {getAvailableBadges().length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Available Badges</h4>
                        <div className="grid grid-cols-4 gap-3">
                          {getAvailableBadges().slice(0, 4).map((badge) => (
                            <div key={badge.id} className="text-center opacity-50">
                              <div className="w-12 h-12 rounded-full mx-auto mb-1 flex items-center justify-center bg-slate-300 text-slate-500">
                                <Award className="w-6 h-6" />
                              </div>
                              <p className="text-xs text-slate-500 truncate" title={badge.name}>
                                {badge.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
