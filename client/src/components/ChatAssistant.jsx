import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Sparkles, Minus, Loader2 } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatAssistant = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("hostel_hub_chat_history");
        return saved ? JSON.parse(saved) : [
            { id: 1, text: "Hello! I'm your HostelHub Assistant. How can I help you today?", sender: "bot", timestamp: new Date().toISOString() }
        ];
    });
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("hostel_hub_chat_history", JSON.stringify(messages));
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const getRuleResponse = (msg) => {
        const lowMsg = msg.toLowerCase();
        const role = user?.role;

        if (lowMsg.includes("room") || lowMsg.includes("allot")) {
            if (role === 'student') return "You can view and book rooms in the 'Room Allotment' section. If you already have a room, you can request a change there.";
            return "Administrators can manage room inventories and allocations via the 'Room Management' module.";
        }
        if (lowMsg.includes("payment") || lowMsg.includes("fee") || lowMsg.includes("dues")) {
            return "Check the 'Payments' tab to view your billing history and pending dues. We support digital authorization for all fees.";
        }
        if (lowMsg.includes("complaint") || lowMsg.includes("support")) {
            return "Submit any issues via the 'Support' section. You can track the real-time status of your petitions there.";
        }
        if (lowMsg.includes("gate") || lowMsg.includes("pass")) {
            return "Digital gatepasses can be generated in the 'Gatepass' section. Ensure you have approval before your exit time.";
        }
        if (lowMsg.includes("maintenance") || lowMsg.includes("repair")) {
            return "For technical issues like electricity or plumbing, please use the 'Maintenance Registry' page.";
        }
        
        return "I'm still learning, but I can guide you through Rooms, Payments, Complaints, and Gatepasses. What would you like to know?";
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: input,
            sender: "user",
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput("");
        setIsTyping(true);

        try {
            // Priority: Try to use backend AI API
            const { data } = await axios.post("/api/ai/chat", {
                message: currentInput,
                role: user?.role
            }).catch(() => ({ data: null })); // Fallback if API doesn't exist yet

            const botMsg = {
                id: Date.now() + 1,
                text: data?.response || getRuleResponse(currentInput),
                sender: "bot",
                timestamp: new Date().toISOString()
            };

            // Simulate typing delay
            setTimeout(() => {
                setMessages(prev => [...prev, botMsg]);
                setIsTyping(false);
            }, 800);

        } catch (error) {
            const fallbackMsg = {
                id: Date.now() + 1,
                text: getRuleResponse(currentInput),
                sender: "bot",
                timestamp: new Date().toISOString()
            };
            setTimeout(() => {
                setMessages(prev => [...prev, fallbackMsg]);
                setIsTyping(false);
            }, 800);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[380px] h-[550px] bg-white border border-border/50 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-primary text-white flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 animate-pulse">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-[17px] font-black tracking-tight leading-none mb-1">HostelHub AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400/50" />
                                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">Chat Support</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 relative z-10">
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                    <Minus className="h-4 w-4" />
                                </button>
                                <button onClick={() => setMessages([{ id: 1, text: "Conversation cleared. How else can I assist you?", sender: "bot", timestamp: new Date().toISOString() }])} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                    <Loader2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Message Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth"
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`h-8 w-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm border ${
                                            msg.sender === 'user' 
                                            ? 'bg-primary border-primary text-white' 
                                            : 'bg-white border-border/50 text-indigo-600'
                                        }`}>
                                            {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </div>
                                        <div className={`p-4 rounded-3xl text-[13px] font-medium leading-relaxed shadow-sm ${
                                            msg.sender === 'user'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-white text-slate-700 border border-border/40 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                            <p className={`text-[9px] mt-2 font-black uppercase tracking-widest ${msg.sender === 'user' ? 'text-white/40' : 'text-slate-300'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex gap-3 items-center">
                                        <div className="h-8 w-8 rounded-xl bg-white border border-border/50 flex items-center justify-center text-indigo-600 shadow-sm animate-bounce">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl border border-border/40 flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75" />
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150" />
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-300" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 bg-white border-t border-border/40">
                            <div className="relative group">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about rooms, payments..."
                                    className="h-14 rounded-2xl pl-5 pr-14 bg-slate-100/50 border-border/40 focus:bg-white focus:ring-primary/20 transition-all font-medium text-[13px]"
                                />
                                <button 
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-2 h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`h-16 w-16 rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all duration-500 relative border ${
                    isOpen 
                    ? 'bg-white border-border text-primary rotate-180' 
                    : 'bg-primary border-primary text-white'
                }`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-7 w-7" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-white animate-pulse" />
                )}
            </motion.button>
        </div>
    );
};

export default ChatAssistant;
