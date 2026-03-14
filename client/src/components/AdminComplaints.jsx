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
            const { data } = await axios.get('http://localhost:5000/api/complaints', config);
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
            await axios.put(`http://localhost:5000/api/complaints/${id}/resolve`, {}, config);
            fetchComplaints();
        } catch (error) {
            console.error("Error resolving complaint", error);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Resolution Center</h2>
                    <p className="text-sm text-[#86868B] font-medium">Monitoring {complaints.filter(c => c.status === 'pending').length} active support tickets.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold border-muted shadow-none gap-2">
                        <Filter className="h-4 w-4" /> Filter All
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-40 rounded-[2rem] bg-muted/30 animate-pulse" />
                    ))
                ) : complaints.length === 0 ? (
                    <div className="py-20 text-center apple-card border-dashed border-2 bg-muted/10 opacity-50 flex flex-col items-center">
                        <MessageSquare className="h-10 w-10 mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-bold text-foreground">Zero Inbox</h3>
                        <p className="text-sm text-muted-foreground">All student complaints have been addressed.</p>
                    </div>
                ) : (
                    complaints.map((complaint) => (
                        <Card key={complaint._id} className="apple-card border-none bg-white shadow-sm group hover:shadow-md transition-all overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="p-8 flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Badge className={`rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-none ${
                                                complaint.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                                {complaint.status}
                                            </Badge>
                                            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {new Date(complaint.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#1D1D1F] mb-1">{complaint.subject || 'Maintenance Request'}</h3>
                                            <p className="text-sm text-[#86868B] leading-relaxed italic">"{complaint.description}"</p>
                                        </div>
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F5F5F7] text-[11px] font-bold text-[#1D1D1F]">
                                                <User className="h-3.5 w-3.5 text-primary" /> {complaint.student?.name}
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F5F5F7] text-[11px] font-bold text-[#1D1D1F]">
                                                <Hash className="h-3.5 w-3.5 text-primary" /> Room {complaint.student?.roomNumber || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-48 bg-[#FBFBFD] border-l border-[#F5F5F7] p-8 flex flex-col justify-center items-center gap-4">
                                        {complaint.status === 'pending' ? (
                                            <Button 
                                                onClick={() => resolveComplaint(complaint._id)}
                                                className="w-full bg-primary hover:bg-black text-white font-bold rounded-xl h-12 shadow-lg shadow-primary/20"
                                            >
                                                Resolve
                                            </Button>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-green-500">
                                                <CheckCircle2 className="h-8 w-8" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Closed</span>
                                            </div>
                                        )}
                                        <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary h-auto p-0">
                                            View Logs
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminComplaints;
