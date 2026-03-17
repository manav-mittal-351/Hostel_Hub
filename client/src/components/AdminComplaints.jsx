import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, Clock, User, Hash, Filter, Search, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminComplaints = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/complaints', config);
            setComplaints(data);
        } catch (error) {
            console.error("Error fetching complaints", error);
        } finally {
            setLoading(false);
        }
    };

    const resolveComplaint = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/complaints/${id}/resolve`, {}, config);
            fetchComplaints();
        } catch (error) {
            console.error("Error resolving complaint", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="section-title">Global Ticket Registry</h1>
                    <p className="text-sm text-muted-foreground mt-1">Found {complaints.filter(c => c.status === 'pending').length} active tickets requiring administrative resolution.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-10 px-4 text-[12px] font-semibold border-border/50 bg-white hover:bg-secondary/50 rounded-xl flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5" /> Advance Filtering
                    </Button>
                </div>
            </header>

            <div className="grid gap-5">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-44 rounded-2xl bg-muted/30 animate-pulse border border-border/50" />
                    ))
                ) : complaints.length === 0 ? (
                    <div className="py-24 text-center rounded-3xl border border-dashed border-border/60 bg-secondary/10 flex flex-col items-center justify-center space-y-3 grayscale opacity-60">
                        <MessageSquare className="h-10 w-10 mb-2 text-muted-foreground" />
                        <h3 className="text-[17px] font-semibold text-foreground tracking-tight">Zero Inbox Status</h3>
                        <p className="text-[13px] text-muted-foreground font-medium">All student communications have been processed successfully.</p>
                    </div>
                ) : (
                    complaints.map((complaint) => (
                        <Card key={complaint._id} className="premium-card bg-white p-0 group hover:border-primary/30 transition-all overflow-hidden">
                            <div className="flex flex-col md:flex-row min-h-[160px]">
                                <div className="p-7 flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Badge className={`rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border-none ${
                                            complaint.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {complaint.status}
                                        </Badge>
                                        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 opacity-70">
                                            <Clock className="h-3 w-3" /> {new Date(complaint.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-[17px] font-bold text-foreground leading-tight mb-2">{complaint.title || 'Untitled Request'}</h3>
                                        <p className="text-[13px] text-muted-foreground leading-relaxed italic line-clamp-2 max-w-2xl font-medium">"{complaint.description}"</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 pt-1">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/40 text-[11px] font-semibold text-foreground border border-border/30">
                                            <User className="h-3.5 w-3.5 text-primary opacity-70" /> {complaint.student?.name}
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/40 text-[11px] font-semibold text-foreground border border-border/30">
                                            <Hash className="h-3.5 w-3.5 text-primary opacity-70" /> Room {complaint.student?.roomNumber || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-56 bg-secondary/20 border-l border-border/50 p-7 flex flex-col justify-center items-center gap-4">
                                    {complaint.status === 'pending' ? (
                                        <Button 
                                            onClick={() => resolveComplaint(complaint._id)}
                                            className="w-full btn-primary h-11 text-[11px] font-bold uppercase tracking-wider active:scale-95"
                                        >
                                            Mark Resolved
                                        </Button>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-emerald-600 animate-in zoom-in duration-500">
                                            <CheckCircle2 className="h-7 w-7" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Entry Closed</span>
                                        </div>
                                    )}
                                    <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors h-auto p-0">
                                        Audit History
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminComplaints;
