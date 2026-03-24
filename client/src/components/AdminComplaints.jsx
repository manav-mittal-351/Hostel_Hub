import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, Clock, User, Hash, Filter, Search, ArrowRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const AdminComplaints = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedComplaint, setSelectedComplaint] = useState(null);

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
            if (selectedComplaint?._id === id) {
                setSelectedComplaint(null);
            }
        } catch (error) {
            console.error("Error resolving complaint", error);
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             c.student?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || c.status?.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-6">
                <div>
                    <h1 className="section-title">Complaint Resolution</h1>
                    <p className="text-sm text-muted-foreground mt-1">There are {complaints.filter(c => c.status === 'pending').length} active complaints that need your attention.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search by name, title..."
                            className="w-full h-11 pl-11 pr-4 text-[13px] bg-white border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full sm:w-48 group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        <select 
                            className="w-full h-11 pl-11 pr-10 text-[12px] font-bold uppercase tracking-wider bg-white border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/5 appearance-none cursor-pointer hover:bg-muted/50 transition-all"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All" className="text-foreground">All Statuses</option>
                            <option value="pending" className="text-foreground">Pending</option>
                            <option value="resolved" className="text-foreground">Resolved</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="grid gap-5">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-44 rounded-2xl bg-muted/30 animate-pulse border border-border/50" />
                    ))
                ) : filteredComplaints.length === 0 ? (
                    <div className="py-24 text-center rounded-3xl border border-dashed border-border/60 bg-secondary/10 flex flex-col items-center justify-center space-y-3 grayscale opacity-60">
                        <MessageSquare className="h-10 w-10 mb-2 text-muted-foreground" />
                        <h3 className="text-[17px] font-semibold text-foreground tracking-tight">No matching complaints</h3>
                        <p className="text-[13px] text-muted-foreground font-medium">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    filteredComplaints.map((complaint) => (
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
                                            className="w-full btn-primary h-11 text-[11px] font-bold uppercase tracking-wider active:scale-95 shadow-md shadow-primary/10"
                                        >
                                            Mark Resolved
                                        </Button>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-emerald-600 animate-in zoom-in duration-500">
                                            <div className="p-2 bg-emerald-100 rounded-full">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Fixed & Resolved</span>
                                        </div>
                                    )}
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setSelectedComplaint(complaint)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors h-auto p-0 hover:bg-transparent"
                                    >
                                        View Full Record
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Complaint Detail Modal */}
            <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
                <DialogContent className="sm:max-w-2xl bg-white p-0 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <DialogHeader className="p-8 pb-4 bg-secondary/30 border-b border-border/50 relative">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border-none ${
                                selectedComplaint?.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                {selectedComplaint?.status}
                            </Badge>
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> Filed on {selectedComplaint ? new Date(selectedComplaint.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                            </span>
                        </div>
                        <DialogTitle className="text-2xl font-black text-foreground leading-tight tracking-tight pr-10">
                            {selectedComplaint?.title}
                        </DialogTitle>
                        <DialogDescription className="text-[14px] font-medium text-muted-foreground mt-2">
                            Assigned Module: {selectedComplaint?.category || 'General Administration'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Comprehensive Description</h4>
                            <div className="p-6 bg-secondary/5 rounded-3xl border border-border/40">
                                <p className="text-[15px] text-foreground leading-relaxed italic font-medium whitespace-pre-wrap">
                                    "{selectedComplaint?.description}"
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-white border border-border/60 shadow-sm flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Complainant</p>
                                    <p className="text-[13px] font-bold text-foreground">{selectedComplaint?.student?.name}</p>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white border border-border/60 shadow-sm flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                                    <Hash className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Registry ID</p>
                                    <p className="text-[13px] font-bold text-foreground">{selectedComplaint?.student?.studentId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between gap-4">
                            <Button variant="outline" className="h-12 px-8 uppercase text-[11px] font-black tracking-widest rounded-2xl border-border/60 hover:bg-secondary/50" onClick={() => setSelectedComplaint(null)}>
                                Close Record
                            </Button>
                            {selectedComplaint?.status === 'pending' && (
                                <Button 
                                    className="h-12 px-10 btn-primary uppercase text-[11px] font-black tracking-widest rounded-2xl shadow-xl shadow-primary/20"
                                    onClick={() => resolveComplaint(selectedComplaint._id)}
                                >
                                    Complete Resolution
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminComplaints;
