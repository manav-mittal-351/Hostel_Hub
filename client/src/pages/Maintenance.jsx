import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, Droplets, Monitor, Hammer, Clock, CheckCircle, Send, Plus, Filter, MessageSquare, Info, Search, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Maintenance = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "Electrical",
        description: "",
        urgency: "Normal"
    });
    const [submitting, setSubmitting] = useState(false);

    const categories = [
        { name: "Electrical", icon: Zap, color: "text-amber-500 bg-amber-50" },
        { name: "Plumbing", icon: Droplets, color: "text-blue-500 bg-blue-50" },
        { name: "Furniture", icon: Hammer, color: "text-orange-500 bg-orange-50" },
        { name: "WiFi / IT", icon: Monitor, color: "text-indigo-500 bg-indigo-50" },
        { name: "Other", icon: Wrench, color: "text-slate-500 bg-slate-50" }
    ];

    const fetchRequests = async () => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // For now, we reuse the complaints API but filter by a 'maintenance' flag if exists, 
            // or just treat them as a separate type if the backend supports it.
            // Since I can't easily change backend now, I will store them as complaints but with a specific category prefix/flag.
            const { data } = await axios.get("/api/complaints/my-complaints", config);
            setRequests(data.filter(r => categories.some(c => c.name === r.category) || r.isMaintenance));
        } catch (error) {
            console.error("Error fetching maintenance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post("/api/complaints", { 
                ...formData, 
                isMaintenance: true 
            }, config);
            toast.success("Maintenance request logged in the registry.");
            setFormData({ title: "", category: "Electrical", description: "", urgency: "Normal" });
            fetchRequests();
            // In a real app we'd close the modal here if we used a Dialog
        } catch (error) {
            toast.error("Failed to log maintenance request.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-2">
                <div>
                    <h1 className="section-title">Repairs</h1>
                <p className="section-subtitle">Request a fix for your room or common areas.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="premium-card bg-white p-7 border-border/60 shadow-sm">
                    <CardHeader className="px-0 pt-0 pb-6 border-b border-border/40">
                        <CardTitle className="text-[17px] font-bold tracking-tight">Fix it</CardTitle>
                        <CardDescription className="text-[12px] font-medium">Tell us what's broken.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Title / Unit</Label>
                            <Input 
                                placeholder="e.g. Fan noisy in Room 204"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                required
                                className="h-11 rounded-xl text-[13px] font-medium bg-secondary/10 border-border/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Technical Category</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        onClick={() => setFormData({...formData, category: cat.name})}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                            formData.category === cat.name 
                                            ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/10" 
                                            : "border-border/40 bg-white hover:border-primary/30"
                                        }`}
                                    >
                                        <cat.icon className={`h-4 w-4 ${formData.category === cat.name ? "text-primary" : "text-muted-foreground/40"}`} />
                                        <span className={`text-[9px] font-black uppercase tracking-wider ${formData.category === cat.name ? "text-primary" : "text-muted-foreground/60"}`}>
                                            {cat.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Fault Description</Label>
                            <textarea 
                                rows="3"
                                className="w-full rounded-xl p-4 text-[13px] bg-secondary/10 border border-border/40 focus:bg-white transition-all outline-none resize-none font-medium min-h-[100px]"
                                placeholder="Describe the technical failure in detail..."
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>
                        <Button className="w-full h-12 btn-primary font-bold uppercase tracking-widest text-[11px] gap-2 rounded-xl active:scale-95 shadow-lg shadow-primary/10" disabled={submitting}>
                            {submitting ? "Logging Dispatch..." : <><Send className="h-3.5 w-3.5" /> Initialize Request</>}
                        </Button>
                    </form>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-[17px] font-bold text-foreground flex items-center gap-2">
                            <History className="h-4 w-4 text-primary" /> Active Service Tickets
                        </h2>
                        <Badge className="bg-secondary/40 text-[9px] font-black uppercase tracking-widest border-none px-2 py-1 italic opacity-60">
                            Verified Residents Only
                        </Badge>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-32 bg-secondary/20 rounded-2xl animate-pulse border border-border/40" />
                            ))
                        ) : requests.length > 0 ? (
                            requests.map(req => (
                                <Card key={req._id} className="premium-card bg-white p-6 hover:border-primary/30 group transition-all">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-5">
                                            <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border/50 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                                {categories.find(c => c.name === req.category)?.icon ? 
                                                    (() => {
                                                        const Icon = categories.find(c => c.name === req.category).icon;
                                                        return <Icon className="h-5 w-5" />;
                                                    })() : <Wrench className="h-5 w-5" />
                                                }
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
                                                        req.status?.toLowerCase() === 'resolved' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'
                                                    }`}>
                                                        {req.status || 'Pending'}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                                                        {new Date(req.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-[15px] font-black text-foreground">{req.title}</h3>
                                                <p className="text-[12px] text-muted-foreground font-medium italic opacity-80 leading-relaxed max-w-lg">
                                                    "{req.description}"
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border-none">
                                            {req.category}
                                        </Badge>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="py-24 text-center rounded-3xl border border-dashed border-border/60 bg-secondary/5 grayscale opacity-50 flex flex-col items-center gap-3">
                                <Hammer className="h-10 w-10 text-muted-foreground opacity-30" />
                                <p className="text-[13px] font-bold text-muted-foreground tracking-tight italic uppercase">No maintenance activity logged.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const History = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="m12 7 0 5 3 3" />
    </svg>
);

export default Maintenance;
