import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, Globe, Smartphone, Monitor, AlertCircle, History } from "lucide-react";

export function LoginHistoryDialog() {
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchHistory();
        }
    }, [open]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const { data } = await axios.get("/api/auth/login-history", config);
            setHistory(data);
        } catch (error) {
            console.error("Fetch history error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getBrowserIcon = (ua) => {
        if (!ua) return <Monitor className="h-4 w-4" />;
        const lowUA = ua.toLowerCase();
        if (lowUA.includes("chrome")) return <Globe className="h-4 w-4 text-emerald-500" />;
        if (lowUA.includes("firefox")) return <Globe className="h-4 w-4 text-orange-500" />;
        if (lowUA.includes("safari")) return <Globe className="h-4 w-4 text-blue-500" />;
        if (lowUA.includes("mobile")) return <Smartphone className="h-4 w-4 text-muted-foreground" />;
        return <Monitor className="h-4 w-4 text-muted-foreground" />;
    };

    const formatUA = (ua) => {
        if (!ua) return "Unknown Browser";
        if (ua.includes("Chrome")) return "Google Chrome";
        if (ua.includes("Firefox")) return "Mozilla Firefox";
        if (ua.includes("Safari") && !ua.includes("Chrome")) return "Apple Safari";
        if (ua.includes("Mobile")) return "Mobile Browser";
        return "Desktop Browser";
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-11 text-[12px] font-bold tracking-tight px-4 border-border/50 hover:bg-secondary/50 transition-colors rounded-xl shadow-none active:scale-[0.98]">
                    <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary opacity-70" /> Login History
                    </div>
                    <Shield className="h-3 w-3 text-muted-foreground/30" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-white border-none rounded-3xl p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <DialogHeader className="p-8 bg-secondary/10 border-b border-border/50">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-border/40">
                            <History className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-[18px] font-bold tracking-tight text-foreground">Access History</DialogTitle>
                            <DialogDescription className="text-[12px] font-medium text-muted-foreground">Monitor recent account activity and sessions</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                
                <div className="max-h-[400px] overflow-y-auto bg-white p-6 custom-scrollbar">
                    {loading ? (
                        <div className="space-y-4 py-10 flex flex-col items-center">
                            <Clock className="h-8 w-8 animate-spin text-primary/30" />
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Synchronizing Registry...</p>
                        </div>
                    ) : history.length > 0 ? (
                        <div className="space-y-3">
                            {history.map((session, idx) => (
                                <div key={session._id} className="p-5 rounded-2xl bg-secondary/10 border border-border/30 flex items-center justify-between group hover:border-primary/20 hover:bg-white transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-border/50 text-muted-foreground group-hover:text-primary transition-colors">
                                            {getBrowserIcon(session.browser)}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[14px] font-bold text-foreground leading-none">{formatUA(session.browser)}</p>
                                            <p className="text-[11px] font-medium text-muted-foreground leading-none flex items-center gap-2 italic">
                                                {session.ip || "Direct Access"} • {new Date(session.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    {idx === 0 && (
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                                            Current
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-4 grayscale opacity-40">
                            <div className="w-16 h-16 rounded-full bg-secondary border border-dashed border-border mx-auto flex items-center justify-center">
                                <AlertCircle className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[14px] font-bold text-foreground">Registry Empty</p>
                                <p className="text-[11px] font-medium text-muted-foreground">No recent institutional access events found for this identity.</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
