
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Crown, TrendingUp, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { UserProgress } from "@/entities/UserProgress";
import { User } from "@/entities/User";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState("points"); // points, streak, level
  const [timeFilter, setTimeFilter] = useState("all"); // all, weekly, monthly
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [filter, timeFilter]);

  const loadLeaderboard = async () => {
    try {
      const [progressData, currentUserData] = await Promise.all([
        UserProgress.list("-total_points"),
        User.me()
      ]);
      
      // Get user details for each progress record
      const users = await User.list();
      const userMap = users.reduce((map, user) => {
        map[user.email] = user;
        return map;
      }, {});

      const enrichedData = progressData.map((progress, index) => ({
        ...progress,
        user: userMap[progress.user_email] || { full_name: "Unknown User", email: progress.user_email },
        rank: index + 1
      }));

      setLeaderboardData(enrichedData);
      setCurrentUser(currentUserData);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
    setIsLoading(false);
  };

  const getCurrentUserRank = () => {
    const userProgress = leaderboardData.find(item => item.user_email === currentUser?.email);
    return userProgress?.rank || "-";
  };

  const getSortedData = () => {
    let sortedData = [...leaderboardData];
    
    switch (filter) {
      case "streak":
        sortedData.sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0));
        break;
      case "level":
        sortedData.sort((a, b) => (b.level || 1) - (a.level || 1));
        break;
      default: // points
        sortedData.sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
    }

    return sortedData.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-slate-600 font-bold">#{rank}</span>;
    }
  };

  const getDisplayValue = (item) => {
    switch (filter) {
      case "streak":
        return `${item.current_streak || 0} days`;
      case "level":
        return `Level ${item.level || 1}`;
      default:
        return `${item.total_points || 0} XP`;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sortedData = getSortedData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Leaderboard</h1>
          <p className="text-xl text-slate-600 mb-8">
            See how you rank against other clean sport athletes
          </p>
        </motion.div>

        {/* User's Current Position */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-bold text-lg">
                        {currentUser.full_name?.[0]?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Your Current Rank</h3>
                      <p className="text-blue-100">
                        {currentUser.full_name || 'Athlete'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">#{getCurrentUserRank()}</div>
                    <div className="text-blue-100 text-sm">out of {leaderboardData.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <div className="flex gap-2">
            <Button
              variant={filter === "points" ? "default" : "outline"}
              onClick={() => setFilter("points")}
              className="rounded-full"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Total XP
            </Button>
            <Button
              variant={filter === "streak" ? "default" : "outline"}
              onClick={() => setFilter("streak")}
              className="rounded-full"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Streak
            </Button>
            <Button
              variant={filter === "level" ? "default" : "outline"}
              onClick={() => setFilter("level")}
              className="rounded-full"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Level
            </Button>
          </div>
        </motion.div>

        {/* Leaderboard List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {sortedData.slice(0, 50).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`transition-all duration-200 hover:shadow-lg ${
                item.user_email === currentUser?.email
                  ? "bg-blue-50/50 border-blue-200 shadow-md"
                  : "bg-white/80 backdrop-blur-sm border-slate-200/50"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(item.rank)}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          item.rank <= 3 ? "bg-gradient-to-br from-blue-400 to-purple-500" : "bg-gradient-to-br from-slate-400 to-slate-500"
                        }`}>
                          {item.user?.full_name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {item.user?.full_name || 'Unknown User'}
                            {item.user_email === currentUser?.email && (
                              <Badge variant="secondary" className="ml-2">You</Badge>
                            )}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span>Level {item.level || 1}</span>
                            <span>•</span>
                            <span>{item.earned_badges?.length || 0} badges</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-900">
                        {getDisplayValue(item)}
                      </div>
                      {filter === "points" && (
                        <div className="text-sm text-slate-500">
                          {item.current_streak || 0} day streak
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {leaderboardData.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No data yet</h3>
            <p className="text-slate-600">Be the first to start learning and earn points!</p>
          </div>
        )}
      </div>
    </div>
  );
}