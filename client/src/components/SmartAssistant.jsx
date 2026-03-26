import { Search, Sparkles, ArrowRight, BedDouble, CreditCard, FileText, AlertCircle, Wrench, Send, Loader2, Bot, User } from "lucide-react";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

const SmartAssistant = () => {
    const { user } = useContext(AuthContext);
    const [query, setQuery] = useState("");
    const [showAssistant, setShowAssistant] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const assistantRef = useRef(null);
    const navigate = useNavigate();

    const rules = [
        { keywords: ["room", "book", "allot", "change"], title: "Room Allotment", description: "Manage your hostel accommodation.", link: "/room-allotment", icon: BedDouble },
        { keywords: ["pay", "fee", "bill", "invoice", "money"], title: "Payments Portal", description: "Audit fees and billing history.", link: "/payments", icon: CreditCard },
        { keywords: ["gate", "pass", "exit", "entry", "out"], title: "Gatepass Manifest", description: "Generate digital exit authorizations.", link: "/gate-pass", icon: FileText },
        { keywords: ["comp", "complaint", "support", "help", "issue"], title: "Support Center", description: "Submit administrative petitions.", link: "/complaints", icon: AlertCircle },
        { keywords: ["main", "repair", "fix", "tech", "light", "water"], title: "Maintenance", description: "Log facility technical requests.", link: "/maintenance", icon: Wrench },
        { keywords: ["profile", "who", "me", "id"], title: "User Profile", description: "Manage personal registry details.", link: "/profile", icon: Sparkles }
    ];

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setAiResponse(null);
            return;
        }

        const filtered = rules.filter(rule => 
            rule.keywords.some(k => query.toLowerCase().includes(k)) ||
            rule.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (assistantRef.current && !assistantRef.current.contains(event.target)) {
                setShowAssistant(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAskAI = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim() || loading) return;

        setLoading(true);
        setAiResponse(null);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const { data } = await axios.post("/api/assistant/ask", { query }, config);
            setAiResponse(data.answer);
        } catch (error) {
            console.error("AI Assistant Error:", error);
            setAiResponse("I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAskAI();
        }
    };

    return (
        <div className="relative max-w-xl w-full hidden md:block group" ref={assistantRef}>
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10 transition-all group-focus-within:scale-110">
                <Sparkles className={`h-5 w-5 ${loading ? 'text-primary animate-spin' : 'text-primary animate-pulse'}`} />
            </div>
            <div className="relative w-full">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowAssistant(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask HostelHub AI anything about the project..." 
                    className="w-full bg-secondary/15 backdrop-blur-sm border border-border/20 hover:bg-white hover:border-primary/20 focus:bg-white focus:border-primary/40 rounded-2xl py-3.5 pl-16 pr-12 text-[14px] font-bold transition-all outline-none placeholder:text-muted-foreground/40 shadow-sm"
                />
                {query.trim() && (
                    <button 
                        onClick={handleAskAI}
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-primary/10 rounded-xl text-primary transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                )}
            </div>
            
            {showAssistant && (query.length > 0 || aiResponse) && (
                <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white/95 backdrop-blur-2xl border border-border rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                    <div className="max-h-[550px] overflow-y-auto custom-scrollbar">
                        <div className="p-5 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/40 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">HostelHub Intelligence</p>
                                <h4 className="text-[13px] font-bold text-foreground">Powered by Groq Llama-3</h4>
                            </div>
                            <div className="bg-white/50 p-2 rounded-xl border border-border/40">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                        </div>

                        {/* AI Conversation Section */}
                        {(loading || aiResponse) && (
                            <div className="p-6 space-y-4 bg-white/50">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-lg bg-secondary/30 flex items-center justify-center flex-shrink-0">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="bg-secondary/20 p-3 rounded-2xl rounded-tl-none border border-border/30 max-w-[85%]">
                                        <p className="text-[13px] font-medium text-foreground">{query}</p>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex gap-4 items-start animate-pulse">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/20">
                                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                        </div>
                                        <div className="space-y-2 flex-1 pt-2">
                                            <div className="h-2 bg-primary/10 rounded-full w-[90%]" />
                                            <div className="h-2 bg-primary/10 rounded-full w-[70%]" />
                                            <div className="h-2 bg-primary/5 rounded-full w-[50%]" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-4 items-start animate-in slide-in-from-left-2 duration-500">
                                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                                            <Sparkles className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="bg-primary/5 p-4 rounded-2xl rounded-tl-none border border-primary/10 shadow-sm text-[13px] font-medium leading-relaxed text-foreground whitespace-pre-wrap">
                                            <div className="markdown-assistant prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-primary">
                                                <ReactMarkdown>{aiResponse}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Heuristic Quick Links (Always show if relevant) */}
                        <div className="divide-y divide-border/30">
                            {results.length > 0 && (
                                <>
                                    <div className="px-6 py-3 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.25em] bg-secondary/5">Heuristic Shortcuts</div>
                                    {results.map((result, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => {
                                                navigate(result.link);
                                                setShowAssistant(false);
                                                setQuery("");
                                            }}
                                            className="flex items-center gap-4 p-5 hover:bg-secondary/40 rounded-2xl cursor-pointer transition-all group/item m-2"
                                        >
                                            <div className="h-11 w-11 rounded-xl bg-white border border-border/50 text-muted-foreground group-hover/item:bg-primary group-hover/item:text-white transition-all shadow-sm flex items-center justify-center">
                                                <result.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] font-black text-foreground">{result.title}</p>
                                                <p className="text-[12px] text-muted-foreground font-medium opacity-60 italic">{result.description}</p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground/20 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                                        </div>
                                    ))}
                                </>
                            )}
                            
                            {!loading && !aiResponse && results.length === 0 && (
                                <div className="p-16 text-center space-y-4 grayscale opacity-40">
                                    <Search className="h-10 w-10 text-muted-foreground mx-auto" />
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest leading-none">AI Ready</p>
                                        <p className="text-[11px] font-medium italic">Press Enter to consult the HostelHub Intelligence.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Bottom Indicator */}
                    <div className="p-3 bg-secondary/10 border-t border-border/30 flex items-center justify-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary/40 animate-ping" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em]">HostelHub LLM Active</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartAssistant;
