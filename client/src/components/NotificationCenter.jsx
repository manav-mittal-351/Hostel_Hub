import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, Info, CheckCircle2, AlertTriangle, Clock, RefreshCw, ArrowRight } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function NotificationCenter() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, loading, refresh } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getTypeStyles = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'error': return 'bg-red-50 text-red-600 border-red-100';
            case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'info': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'payment': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'complaint': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'gatepass': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'room': return 'bg-teal-50 text-teal-600 border-teal-100';
            default: return 'bg-secondary/50 text-muted-foreground border-border/50';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="h-3.5 w-3.5" />;
            case 'error': return <AlertTriangle className="h-3.5 w-3.5" />;
            case 'warning': return <AlertTriangle className="h-3.5 w-3.5" />;
            case 'info': return <Info className="h-3.5 w-3.5" />;
            case 'payment': return <RefreshCw className="h-3.5 w-3.5" />; // Representative for transactions
            default: return <Clock className="h-3.5 w-3.5" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-full hover:bg-secondary/30 transition-all border border-transparent hover:border-border/50"
            >
                <Bell className={`h-5 w-5 text-muted-foreground transition-all ${unreadCount > 0 ? "animate-swing" : ""}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in-0">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-border/60 rounded-3xl shadow-2xl z-[60] overflow-hidden origin-top-right backdrop-blur-3xl bg-white/95"
                    >
                        <div className="p-6 border-b border-border/40 flex items-center justify-between bg-secondary/5">
                            <div>
                                <h3 className="text-[15px] font-black text-foreground tracking-tight flex items-center gap-2">
                                    Notification Center
                                    {loading && <RefreshCw className="h-3 w-3 animate-spin text-primary" />}
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">System Synchronized</p>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={markAllAsRead} 
                                    className="h-8 w-8 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                    title="Mark all as read"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={clearAll} 
                                    className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Clear all history"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-border/20">
                                    {notifications.map((n) => (
                                        <div 
                                            key={n._id} 
                                            className={`p-5 group transition-all hover:bg-secondary/10 relative cursor-pointer ${!n.read ? "bg-primary/[0.02]" : ""}`}
                                            onClick={() => markAsRead(n._id)}
                                        >
                                            {!n.read && (
                                                <div className="absolute top-6 left-2 w-1.5 h-1.5 rounded-full bg-primary" />
                                            )}
                                            <div className="flex gap-4">
                                                <div className={`mt-0.5 h-9 w-9 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm ${getTypeStyles(n.type)}`}>
                                                    {getTypeIcon(n.type)}
                                                </div>
                                                <div className="space-y-1 pr-2">
                                                    <h4 className={`text-[13px] font-bold ${!n.read ? "text-foreground" : "text-muted-foreground/80"}`}>{n.title}</h4>
                                                    <p className={`text-[12px] leading-snug font-medium line-clamp-2 ${!n.read ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-widest pt-1 flex items-center gap-1">
                                                        <Clock className="h-2.5 w-2.5" /> {n.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-30 grayscale text-center px-10">
                                    <div className="p-5 rounded-full bg-secondary">
                                        <Bell className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[14px] font-bold uppercase tracking-widest">Inbox Transfusion Zero</p>
                                        <p className="text-[11px] font-medium leading-relaxed">System identity is fully synchronized for your account registry.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-4 bg-secondary/10 border-t border-border/40 grid grid-cols-2 gap-3">
                                <button 
                                    onClick={refresh}
                                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2 border border-border/40 py-2 rounded-xl bg-white hover:bg-secondary/5 shadow-sm"
                                >
                                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                                    Sync
                                </button>
                                <button 
                                    onClick={() => {
                                        navigate("/notifications");
                                        setIsOpen(false);
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-all flex items-center justify-center gap-2 border border-primary/20 bg-primary/5 py-2 rounded-xl shadow-sm"
                                >
                                    See All <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default NotificationCenter;
