import { Bell, Search, LogOut, Menu, X, Check, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useNotifications } from "@/context/NotificationContext";

const Header = ({ onMenuClick }) => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const { notifications, markAllAsRead, unreadCount, markAsRead } = useNotifications();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="h-20 border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6 flex-1">
                <Button variant="ghost" size="icon" className="lg:hidden rounded-lg hover:bg-secondary/50" onClick={onMenuClick}>
                    <Menu className="h-5 w-5 text-muted-foreground" />
                </Button>
                
                <div className="relative max-w-xl w-full hidden md:block group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                        <Search className="h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-all duration-300" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search student records, room numbers, or transactions..." 
                        className="w-full bg-secondary/5 backdrop-blur-sm border border-border/20 hover:bg-secondary/10 focus:bg-white/60 focus:border-primary/20 rounded-2xl py-3.5 pl-16 pr-6 text-[14px] font-medium transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-secondary/50 rounded-lg border border-border/50 text-[10px] font-bold text-muted-foreground/60 tracking-tighter hidden group-focus-within:block">
                        ESC
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative" ref={notificationRef}>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative rounded-xl transition-all duration-300 ${showNotifications ? 'bg-primary/10 text-primary shadow-inner' : 'hover:bg-secondary/50'}`}
                    >
                        <Bell className={`h-5 w-5 ${showNotifications ? 'text-primary' : 'text-muted-foreground'}`} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                                {unreadCount}
                            </span>
                        )}
                    </Button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-4 w-96 bg-white border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
                            <div className="p-5 border-b border-border bg-secondary/10 flex items-center justify-between">
                                <h3 className="font-bold text-foreground flex items-center gap-2">
                                    Notifications
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full">{unreadCount} New</span>
                                </h3>
                                <button onClick={markAllAsRead} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">
                                    Mark all as read
                                </button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div key={n.id} className={`p-5 flex items-start gap-4 hover:bg-secondary/10 transition-colors border-b border-border/50 last:border-none relative ${!n.read ? 'bg-primary/[0.02]' : ''}`}>
                                            {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />}
                                            <div className={`p-2.5 rounded-xl shrink-0 ${
                                                n.type === 'info' ? 'bg-blue-50 text-blue-600' :
                                                n.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                                {n.type === 'info' ? <Info className="h-4 w-4" /> :
                                                 n.type === 'success' ? <Check className="h-4 w-4" /> :
                                                 <AlertTriangle className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[13px] font-bold text-foreground">{n.title}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">{n.time}</p>
                                                </div>
                                                <p className="text-[12px] text-muted-foreground leading-relaxed">{n.message}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 text-center space-y-3">
                                        <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                                            <Bell className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-semibold text-muted-foreground">All caught up!</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-secondary/5 text-center">
                                <button className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                                    View All Activity
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="h-6 w-px bg-border mx-2" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-[13px] font-bold text-foreground leading-none mb-1">{user?.name?.split(' ')[0]}</p>
                        <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{user?.role}</p>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleLogout}
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all rounded-xl h-10 w-10 border border-transparent hover:border-red-100"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
