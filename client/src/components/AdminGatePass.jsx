import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, Clock, User, LogOut, LogIn, Filter, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminGatePass = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get("/api/gate-pass", config);
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = user?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`/api/gate-pass/${id}/status`, { status }, config);
            fetchRequests();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2 border-b border-border/50">
                <div>
                    <h2 className="text-[17px] font-semibold text-foreground tracking-tight">Gatepass Applications</h2>
                    <p className="text-[12px] text-muted-foreground font-medium">There are {requests.filter(r => r.status === 'Pending').length} pending gatepass requests.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 px-4 text-[11px] font-bold uppercase tracking-widest border-border/50 bg-white hover:bg-secondary/50 rounded-lg flex items-center gap-2">
                        <Filter className="h-3 w-3" /> Filter Passes
                    </Button>
                </div>
            </div>

            <div className="grid gap-5">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-44 rounded-2xl bg-muted/30 animate-pulse border border-border/50" />
                    ))
                ) : requests.length === 0 ? (
                    <div className="py-24 text-center rounded-3xl border border-dashed border-border/60 bg-secondary/10 flex flex-col items-center justify-center space-y-3 grayscale opacity-60">
                        <FileText className="h-10 w-10 mb-2 text-muted-foreground" />
                        <h3 className="text-[17px] font-semibold text-foreground tracking-tight">No pending passes</h3>
                        <p className="text-[13px] text-muted-foreground font-medium">All gatepass applications have been processed.</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <Card key={req._id} className="premium-card bg-white p-0 group hover:border-primary/30 transition-all overflow-hidden border-border/60 shadow-sm">
                            <div className="flex flex-col lg:flex-row">
                                <div className="p-7 flex-1 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-secondary/30 flex items-center justify-center border border-border/50">
                                                <User className="h-5 w-5 text-primary/70" />
                                            </div>
                                            <div>
                                                <h3 className="text-[15px] font-bold text-foreground">{req.student?.name || 'Unknown Subject'}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Room {req.student?.roomNumber || 'N/A'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-border" />
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">ID: {req.student?._id.slice(-6)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className={`rounded-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border-none ${
                                            req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                            req.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            {req.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                                        <div className="space-y-1.5 px-1">
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-1.5 opacity-70">
                                                <LogOut className="h-3 w-3 text-red-400" /> Out Date
                                            </p>
                                            <p className="text-[13px] font-bold text-foreground">
                                                {new Date(req.outDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5 px-1">
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-1.5 opacity-70">
                                                <LogIn className="h-3 w-3 text-emerald-400" /> Return Date
                                            </p>
                                            <p className="text-[13px] font-bold text-foreground">
                                                {new Date(req.inDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-xl bg-secondary/20 border border-border/30">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">Reason</p>
                                        <p className="text-[12px] text-foreground leading-relaxed italic font-medium">"{req.reason || 'No specific reason provided.'}"</p>
                                    </div>
                                </div>

                                <div className={`lg:w-56 p-7 flex flex-col justify-center gap-3 border-l border-border/50 ${
                                    req.status === 'Pending' ? 'bg-secondary/10' : 'bg-muted/5'
                                }`}>
                                    {req.status === 'Pending' ? (
                                        <>
                                            <Button 
                                                onClick={() => updateStatus(req._id, 'Approved')}
                                                className="w-full btn-primary h-10 text-[11px] font-bold uppercase tracking-widest active:scale-95"
                                            >
                                                Approve
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                onClick={() => updateStatus(req._id, 'Rejected')}
                                                className="w-full h-10 text-[11px] font-bold uppercase tracking-widest border-red-100 text-red-600 hover:bg-red-50 rounded-xl"
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-muted-foreground/40 animate-in zoom-in duration-500">
                                            {req.status === 'Approved' ? <CheckCircle2 className="h-8 w-8 text-emerald-500/50" /> : <XCircle className="h-8 w-8 text-red-500/50" />}
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Processed</span>
                                        </div>
                                    )}
                                    <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors h-auto p-0 mt-2">
                                        View Details
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

export default AdminGatePass;
