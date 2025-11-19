import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvokeLLM } from '@/integrations/Core';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hello! I am your AI assistant for clean sport. How can I help you today? You can ask me about rules, supplements, or specific scenarios.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { from: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const prompt = `You are an expert AI assistant for Lados, an anti-doping education platform. Your role is to provide clear, accurate, and safe advice to athletes, coaches, and fitness professionals about anti-doping rules, substances, and best practices. You must never give medical advice. Always refer users to a doctor or a registered dietitian for medical or nutritional guidance. Your knowledge is based on the World Anti-Doping Agency (WADA) code.

            User question: "${input}"
            
            Provide a helpful and safe answer.`;

            const response = await InvokeLLM({
                prompt: prompt,
                add_context_from_internet: true
            });
            
            const botMessage = { from: 'bot', text: response };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Error invoking LLM:", error);
            const errorMessage = { from: 'bot', text: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-3xl flex flex-col h-[calc(100vh-3rem)]">
                <Card className="flex-grow flex flex-col bg-white/80 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-3">
                            <Bot className="w-6 h-6 text-blue-600" />
                            <span className="text-2xl font-bold">AI Anti-Doping Assistant</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-y-auto p-6 space-y-6">
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}
                                >
                                    {msg.from === 'bot' && <Avatar><AvatarFallback><Bot /></AvatarFallback></Avatar>}
                                    <div className={`max-w-md p-3 rounded-xl ${msg.from === 'bot' ? 'bg-slate-100' : 'bg-blue-600 text-white'}`}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                    {msg.from === 'user' && <Avatar><AvatarFallback><User /></AvatarFallback></Avatar>}
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                                    <Avatar><AvatarFallback><Bot /></AvatarFallback></Avatar>
                                    <div className="max-w-md p-3 rounded-xl bg-slate-100 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 animate-pulse" />
                                        <span>Thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Ask about a supplement or scenario..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isLoading}
                            />
                            <Button onClick={handleSend} disabled={isLoading}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}