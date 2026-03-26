import { useNotifications } from "@/context/NotificationContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Check, Info, AlertTriangle, Trash2, CheckCircle2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Notifications = () => {
    const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotifications();

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-4">
                <div>
                    <h1 className="section-title">Notifications</h1>
                    <p className="section-subtitle">Stay updated with your institutional status and requests.</p>
                </div>
                <div className="flex items-center gap-3">
                    {notifications.length > 0 && (
                        <>
                            <Button 
                                variant="outline" 
                                onClick={markAllAsRead}
                                className="h-10 px-6 rounded-xl text-[11px] font-bold uppercase tracking-widest border-border/60 hover:bg-secondary/20 transition-all active:scale-95"
                            >
                                Mark all as read
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={clearAll}
                                className="h-10 px-6 rounded-xl text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Clear all
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <Card className="premium-card bg-white p-6 border-border/60 shadow-sm">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <h3 className="text-[14px] font-bold text-foreground">Overview</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-border/40">
                                    <span className="text-[13px] text-muted-foreground font-medium">Total</span>
                                    <span className="text-[13px] font-black">{notifications.length}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/40">
                                    <span className="text-[13px] text-muted-foreground font-medium">Unread</span>
                                    <Badge className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border-none">
                                        {unreadCount} New
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-3 space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <Card key={n._id} className={`premium-card bg-white p-6 hover:border-primary/30 group transition-all relative overflow-hidden ${!n.read ? 'border-l-4 border-l-primary' : ''}`}>
                                <div className="flex items-start gap-6">
                                    <div className={`p-4 rounded-2xl shrink-0 ${
                                        n.type === 'info' ? 'bg-blue-50 text-blue-600' :
                                        n.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' :
                                        'bg-amber-50 text-amber-600 border border-amber-100/50'
                                    }`}>
                                        {n.type === 'info' ? <Info className="h-6 w-6" /> :
                                         n.type === 'success' ? <CheckCircle2 className="h-6 w-6" /> :
                                         <AlertTriangle className="h-6 w-6" />}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[16px] font-black text-foreground">{n.title}</h3>
                                                {!n.read && (
                                                    <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-md">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                                {n.time}
                                            </span>
                                        </div>
                                        <p className="text-[14px] text-muted-foreground font-medium leading-relaxed max-w-2xl">
                                            {n.message}
                                        </p>
                                        <div className="pt-2 flex items-center gap-4">
                                            {!n.read && (
                                                <button 
                                                    onClick={() => markAsRead(n._id)}
                                                    className="text-[11px] font-bold text-primary hover:underline uppercase tracking-[0.2em] transition-all"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground/40 hover:text-primary">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="py-24 text-center rounded-3xl border-2 border-dashed border-border/60 bg-secondary/5 grayscale opacity-50 flex flex-col items-center gap-4">
                            <div className="p-6 bg-white rounded-full shadow-sm border border-border">
                                <Bell className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[15px] font-bold text-foreground">No updates yet</p>
                                <p className="text-[12px] font-medium text-muted-foreground">You will be notified as soon as something happens.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
