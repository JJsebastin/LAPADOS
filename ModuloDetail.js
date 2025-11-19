
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Modulo } from '@/entities/Modulo';
import { User } from '@/entities/User';
import { UserProgress } from '@/entities/UserProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ArrowLeft, Lightbulb, Trophy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModuloDetail() {
    const [modulo, setModulo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);
    const [score, setScore] = useState(0);
    
    const location = useLocation();
    const navigate = useNavigate();
    const moduloId = new URLSearchParams(location.search).get('id');

    const loadData = useCallback(async () => {
        if (!moduloId) return;
        setIsLoading(true);
        try {
            const moduloData = await Modulo.get(moduloId);
            setModulo(moduloData);
        } catch (error) {
            console.error("Error loading modulo:", error);
        }
        setIsLoading(false);
    }, [moduloId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAnswerSubmit = () => {
        if (selectedAnswer === null) return;
        const question = modulo.quiz_questions[currentQuestion];
        if (selectedAnswer === question.correct_answer) {
            setScore(score + 1);
        }
        setShowExplanation(true);
    };

    const handleNextQuestion = async () => {
        if (currentQuestion < modulo.quiz_questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setQuizComplete(true);
            try {
                const user = await User.me();
                const progressData = await UserProgress.filter({ user_email: user.email });
                if (progressData.length > 0) {
                    const progress = progressData[0];
                    const points = modulo.xp_reward;
                    await UserProgress.update(progress.id, {
                        total_points: progress.total_points + points,
                        completed_moduloz: [...(progress.completed_moduloz || []), moduloId],
                        quiz_history: [...(progress.quiz_history || []), { modulo_id: moduloId, score: score + (selectedAnswer === modulo.quiz_questions[currentQuestion].correct_answer ? 1 : 0), completed_at: new Date().toISOString() }]
                    });
                }
            } catch(error) {
                console.error("Failed to update user progress", error);
            }
        }
    };
    
    if (isLoading) return <div className="p-6 text-center">Loading Module...</div>;
    if (!modulo) return <div className="p-6 text-center">Module not found.</div>;

    const quizProgress = ((currentQuestion + 1) / modulo.quiz_questions.length) * 100;
    const finalScore = score / modulo.quiz_questions.length * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link to={createPageUrl("Moduloz")} className="flex items-center gap-2 text-slate-600 hover:text-slate-900"><ArrowLeft className="w-4 h-4" />Back to Moduloz</Link>
                
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                    <CardHeader><CardTitle className="text-3xl font-bold">{modulo.title}</CardTitle></CardHeader>
                    {!quizStarted ? (
                        <CardContent>
                            <div className="prose max-w-none">
                                <ReactMarkdown>{modulo.content}</ReactMarkdown>
                            </div>
                            <Button onClick={() => setQuizStarted(true)} className="mt-8 w-full">Start Quiz</Button>
                        </CardContent>
                    ) : (
                        <CardContent>
                            {!quizComplete ? (
                                <>
                                    <div className="mb-4">
                                        <p className="text-sm text-slate-600 mb-2">Question {currentQuestion + 1} of {modulo.quiz_questions.length}</p>
                                        <Progress value={quizProgress} />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4">{modulo.quiz_questions[currentQuestion].question}</h3>
                                    <div className="space-y-3">
                                        {modulo.quiz_questions[currentQuestion].options.map((option, index) => (
                                            <button key={index} onClick={() => setSelectedAnswer(index)} disabled={showExplanation}
                                                className={`w-full p-4 text-left border rounded-xl transition-all ${
                                                    selectedAnswer === index
                                                        ? showExplanation ? (index === modulo.quiz_questions[currentQuestion].correct_answer ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : "border-blue-500 bg-blue-50"
                                                        : showExplanation && index === modulo.quiz_questions[currentQuestion].correct_answer ? "border-green-500 bg-green-50" : "border-slate-200 bg-white hover:bg-slate-50"
                                                }`}>
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    {showExplanation && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                            <div className="flex items-start gap-2">
                                                <Lightbulb className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <h4 className="font-semibold text-blue-900">Explanation</h4>
                                                    <p>{modulo.quiz_questions[currentQuestion].explanation}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    <div className="mt-6 flex justify-end">
                                        {!showExplanation ? (
                                            <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null}>Submit</Button>
                                        ) : (
                                            <Button onClick={handleNextQuestion}>
                                                {currentQuestion < modulo.quiz_questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                            </Button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                                    <h2 className="text-2xl font-bold">Quiz Complete!</h2>
                                    <p className="text-lg mt-2">You scored {finalScore.toFixed(0)}%</p>
                                    <p className="mt-4 text-slate-600">You earned {modulo.xp_reward} XP for completing this module.</p>
                                    <Button onClick={() => navigate(createPageUrl("Moduloz"))} className="mt-6">Back to Moduloz</Button>
                                </div>
                            )}
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
