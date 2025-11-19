import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Modulo } from "@/entities/Modulo";
import { UserProgress } from "@/entities/UserProgress";
import { User } from "@/entities/User";

export default function Moduloz() {
  const [moduloz, setModuloz] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [moduloData, currentUser] = await Promise.all([Modulo.list(), User.me()]);
      setModuloz(moduloData);
      const progress = await UserProgress.filter({ user_email: currentUser.email });
      if (progress.length > 0) setUserProgress(progress[0]);
    } catch (error) {
      console.error("Error loading moduloz:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isCompleted = (moduloId) => userProgress?.completed_moduloz?.includes(moduloId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Learning Moduloz</h1>
          <p className="text-xl text-slate-600">Structured modules to master anti-doping.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? Array(6).fill(0).map((_, i) => <Card key={i} className="animate-pulse h-48 bg-slate-200" />) :
            moduloz.map((modulo, index) => (
              <motion.div key={modulo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                       <Badge variant="secondary">{modulo.category}</Badge>
                       {isCompleted(modulo.id) && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <CardTitle className="text-lg font-bold">{modulo.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-slate-600 text-sm mb-4">{modulo.description}</p>
                  </CardContent>
                  <CardContent className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{modulo.estimated_minutes} min</span></div>
                    <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /><span>{modulo.xp_reward} XP</span></div>
                  </CardContent>
                   <CardContent>
                    <Link to={createPageUrl(`ModuloDetail?id=${modulo.id}`)}>
                      <Button className="w-full" disabled={isCompleted(modulo.id)}>
                        {isCompleted(modulo.id) ? "Completed" : "Start Module"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
