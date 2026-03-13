'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import Link from 'next/link';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2, 
  MessageSquare, 
  History,
  Trash2,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const { userInfo } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (userInfo?.token) {
      fetchChatHistory();
    }
  }, [userInfo]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const { data } = await api.get(`/chat`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post(`/chat`, { message: userMsg });
      setMessages(prev => [...prev, data.userMessage, data.aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-2xl font-bold mb-4">Please login to consult our AI Doctor</h1>
      <Link href="/login" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold">Login Now</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 mt-16 max-w-5xl h-[calc(100vh-150px)]">
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col md:flex-row">
        
        {/* Sidebar Info */}
        <div className="w-full md:w-80 bg-secondary/20 border-r border-border p-8 hidden md:flex flex-col space-y-8">
            <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-2xl inline-block">
                    <Bot className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-2xl font-black">AI Health Assistant</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Chat with our intelligent AI to get preliminary symptom analysis and health advice.
                </p>
            </div>
            
            <div className="space-y-4 pt-8 border-t border-border">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Quick Suggestions</h3>
                <div className="space-y-2">
                    {['Fever & Headache', 'Common Cold', 'Bacterial Infection', 'Allergy symptoms'].map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => setInput(s)}
                            className="w-full text-left p-3 rounded-xl bg-background border border-border text-xs font-medium hover:border-primary/50 transition-all"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                <p className="text-[10px] text-yellow-500/80 font-medium">
                    Disclaimer: This is an AI assistant, not a replacement for professional medical advice.
                </p>
            </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col relative bg-background/50 backdrop-blur-sm">
          <div className="p-6 border-b border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
                </div>
                <div>
                    <h2 className="font-bold">MediBot</h2>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online & Active</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground">
                    <History className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-muted-foreground">
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
          >
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 py-20">
                    <MessageSquare className="h-16 w-16 text-primary mb-2" />
                    <h3 className="text-xl font-bold">Start a Conversation</h3>
                    <p className="text-sm max-w-xs">Ask anything about your health or symptoms to get instant AI guidance.</p>
                </div>
            )}
            
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div 
                  key={m._id || i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground border border-border'}`}>
                        {m.sender === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card border border-border rounded-tl-none'}`}>
                        {m.message}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                >
                    <div className="flex gap-3 max-w-[80%] items-center">
                        <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="p-4 rounded-2xl bg-card border border-border rounded-tl-none flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-xs font-medium text-muted-foreground italic">MediBot is typing...</span>
                        </div>
                    </div>
                </motion.div>
            )}
          </div>

          <div className="p-6 bg-card border-t border-border">
            <form onSubmit={handleSendMessage} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-red-500/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
                <div className="relative flex items-center bg-background border border-border rounded-2xl p-2 pr-4 shadow-xl">
                    <input 
                        type="text" 
                        placeholder="Describe your symptoms (e.g. 'I have a fever and headache')..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <button 
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </form>
            <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <HeartPulse className="h-3 w-3 text-red-500" /> Real-time analysis
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <ShieldCheck className="h-3 w-3 text-green-500" /> Private & Secure
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
