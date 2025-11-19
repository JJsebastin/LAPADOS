import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Newspaper, LayoutGrid, Bot, Trophy, User as UserIcon, Menu, X, Zap, Award, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserProgress } from "@/entities/UserProgress";
import { User as UserEntity } from "@/entities/User";
import { base44 } from "@/api/base44Client";

const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: Home },
  { title: "Blogs", url: createPageUrl("Blogs"), icon: Newspaper },
  { title: "Moduloz", url: createPageUrl("Moduloz"), icon: LayoutGrid },
  { title: "AI Chatbot", url: createPageUrl("Chatbot"), icon: Bot },
  { title: "Leaderboard", url: createPageUrl("Leaderboard"), icon: Trophy },
  { title: "Profile", url: createPageUrl("Profile"), icon: UserIcon },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [userProgress, setUserProgress] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await UserEntity.me();
      setUser(currentUser);
      
      const progress = await UserProgress.filter({user_email: currentUser.email});
      if (progress.length > 0) {
        setUserProgress(progress[0]);
      } else {
        // Create initial progress record
        const newProgress = await UserProgress.create({
          user_email: currentUser.email,
          total_points: 0,
          level: 1,
          current_streak: 0,
          last_activity: new Date().toISOString()
        });
        setUserProgress(newProgress);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">L.A.P.A.D.O.S</h2>
                <p className="text-xs text-slate-500">Learn. Play. Stay Clean.</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            {userProgress && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl border border-blue-200/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Level {userProgress.level}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {userProgress.total_points} XP
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-slate-600">{userProgress.current_streak} day streak</span>
                </div>
              </div>
            )}

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/50 p-6 space-y-4">
            {user && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.full_name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{user.full_name || 'Athlete'}</p>
                    <p className="text-xs text-slate-500 truncate">Keep up the great work!</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                  onClick={() => base44.auth.logout()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">Lados</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}