import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, User, LogOut, LogIn, Filter, Calendar, MapPin, Search, Clock, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const AdminGatePass = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedRequest, setSelectedRequest] = useState(null);

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
            if (selectedRequest?._id === id) {
                const refreshed = { ...selectedRequest, status };
                setSelectedRequest(refreshed);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredRequests = requests.filter(req => {
        return filterStatus === 'All' || req.status?.toLowerCase() === filterStatus.toLowerCase();
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-2 border-b border-border/50">
                <div>
                    <h2 className="text-[17px] font-semibold text-foreground tracking-tight">Gatepass Applications</h2>
                    <p className="text-[12px] text-muted-foreground font-medium">There are {requests.filter(r => r.status === 'Pending').length} pending requests.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative group w-full sm:w-auto">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="h-10 pl-11 pr-10 text-[11px] font-bold uppercase tracking-widest bg-white border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/5 appearance-none cursor-pointer hover:bg-muted/50 transition-all w-full sm:w-44"
                        >
                            <option value="All">All Passes</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-5">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-44 rounded-2xl bg-muted/30 animate-pulse border border-border/50" />
                    ))
                ) : filteredRequests.length === 0 ? (
                    <div className="py-24 text-center rounded-3xl border border-dashed border-border/60 bg-secondary/10 flex flex-col items-center justify-center space-y-3 grayscale opacity-60">
                        <FileText className="h-10 w-10 mb-2 text-muted-foreground" />
                        <h3 className="text-[17px] font-semibold text-foreground tracking-tight">No matching passes</h3>
                        <p className="text-[13px] text-muted-foreground font-medium">The filtered applications are empty.</p>
                    </div>
                ) : (
                    filteredRequests.map((req) => (
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
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">ID: {req.student?._id.slice(-6).toUpperCase()}</span>
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

                                <div className={`lg:w-56 p-6 sm:p-7 flex flex-row lg:flex-col justify-between lg:justify-center items-center gap-3 border-t lg:border-t-0 lg:border-l border-border/50 ${
                                    req.status === 'Pending' ? 'bg-secondary/10' : 'bg-muted/5'
                                }`}>
                                    {req.status === 'Pending' ? (
                                        <div className="flex flex-row lg:flex-col gap-2 w-full">
                                            <Button 
                                                onClick={() => updateStatus(req._id, 'Approved')}
                                                className="flex-1 lg:w-full btn-primary h-10 text-[11px] font-bold uppercase tracking-widest active:scale-95 shadow-md shadow-primary/10"
                                            >
                                                Approve
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                onClick={() => updateStatus(req._id, 'Rejected')}
                                                className="flex-1 lg:w-full h-10 text-[11px] font-bold uppercase tracking-widest border-red-100 text-red-600 hover:bg-red-50 rounded-xl sm:px-4"
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center lg:flex-col gap-3 text-muted-foreground/40 animate-in zoom-in duration-500">
                                            {req.status === 'Approved' ? <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500/50" /> : <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500/50" />}
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Processed</span>
                                        </div>
                                    )}
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setSelectedRequest(req)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors h-auto p-0 lg:mt-2"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Gatepass Detail Modal */}
            <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                <DialogContent className="sm:max-w-2xl bg-white p-0 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <DialogHeader className="p-8 pb-4 bg-secondary/30 border-b border-border/50 relative">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border-none ${
                                selectedRequest?.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                selectedRequest?.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                'bg-amber-50 text-amber-600'
                            }`}>
                                {selectedRequest?.status}
                            </Badge>
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> Applied on {selectedRequest ? new Date(selectedRequest.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                            </span>
                        </div>
                        <DialogTitle className="text-2xl font-black text-foreground leading-tight tracking-tight">
                            Gatepass Verification
                        </DialogTitle>
                        <DialogDescription className="text-[14px] font-medium text-muted-foreground mt-2">
                            Type: {selectedRequest?.type || 'Outing'} — Identity Validated
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-white border border-border/60 shadow-sm flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Applicant</p>
                                    <p className="text-[13px] font-bold text-foreground">{selectedRequest?.student?.name}</p>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white border border-border/60 shadow-sm flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                                    <Hash className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Room & ID</p>
                                    <p className="text-[13px] font-bold text-foreground">{selectedRequest?.student?.roomNumber || 'N/A'} • {selectedRequest?.student?._id.slice(-6).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 bg-secondary/5 p-6 rounded-3xl border border-border/40">
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-1.5 opacity-70">
                                    <Calendar className="h-3.5 w-3.5 text-red-400" /> Planned Exit
                                </p>
                                <p className="text-[14px] font-black text-foreground">
                                    {selectedRequest ? new Date(selectedRequest.outDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                                </p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-1.5 opacity-70">
                                    <Calendar className="h-3.5 w-3.5 text-emerald-400" /> Expected Back
                                </p>
                                <p className="text-[14px] font-black text-foreground">
                                    {selectedRequest ? new Date(selectedRequest.inDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Official Reason</h4>
                            <div className="p-6 bg-white rounded-3xl border border-border/40 min-h-[100px] shadow-sm italic text-muted-foreground font-medium">
                                "{selectedRequest?.reason || 'No specific reason provided.'}"
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 gap-4">
                            <Button variant="outline" className="h-12 px-8 uppercase text-[11px] font-black tracking-widest rounded-2xl border-border/60 hover:bg-secondary/50" onClick={() => setSelectedRequest(null)}>
                                Close Record
                            </Button>
                            {selectedRequest?.status === 'Pending' && (
                                <div className="flex gap-3">
                                    <Button 
                                        variant="outline"
                                        onClick={() => updateStatus(selectedRequest._id, 'Rejected')}
                                        className="h-12 px-6 uppercase text-[11px] font-black tracking-widest rounded-2xl border-red-100 text-red-600 hover:bg-red-50"
                                    >
                                        Reject
                                    </Button>
                                    <Button 
                                        onClick={() => updateStatus(selectedRequest._id, 'Approved')}
                                        className="h-12 px-10 btn-primary uppercase text-[11px] font-black tracking-widest rounded-2xl shadow-xl shadow-primary/20"
                                    >
                                        Authorize
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminGatePass;
