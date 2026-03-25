import { Search, Sparkles, ArrowRight, BedDouble, CreditCard, FileText, AlertCircle, Wrench } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SmartAssistant = () => {
    const [query, setQuery] = useState("");
    const [showAssistant, setShowAssistant] = useState(false);
    const [results, setResults] = useState([]);
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

    return (
        <div className="relative max-w-xl w-full hidden md:block group" ref={assistantRef}>
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10 transition-all group-focus-within:scale-110">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowAssistant(true)}
                placeholder="Ask HostelHub: 'How to book a room?' or 'Pay fees'..." 
                className="w-full bg-secondary/15 backdrop-blur-sm border border-border/20 hover:bg-white hover:border-primary/20 focus:bg-white focus:border-primary/40 rounded-2xl py-3.5 pl-16 pr-6 text-[14px] font-bold transition-all outline-none placeholder:text-muted-foreground/40 shadow-sm"
            />
            
            {showAssistant && query.length > 0 && (
                <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white/95 backdrop-blur-2xl border border-border rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                    <div className="max-h-[500px] overflow-y-auto">
                        <div className="p-4 bg-primary/5 border-b border-border/40">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">Smart Hostel Assistant</p>
                            <h4 className="text-[13px] font-bold text-foreground italic opacity-70">Heuristic matching for "{query}"</h4>
                        </div>
                        <div className="divide-y divide-border/30">
                            {results.length > 0 ? (
                                results.map((result, idx) => (
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
                                ))
                            ) : (
                                <div className="p-16 text-center space-y-4 grayscale opacity-40">
                                    <Search className="h-10 w-10 text-muted-foreground mx-auto" />
                                    <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest leading-none">No active sync for this query</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartAssistant;
