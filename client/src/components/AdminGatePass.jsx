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
            const { data } = await axios.get("http://localhost:5000/api/gate-pass", config);
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
            await axios.put(`http://localhost:5000/api/gate-pass/${id}/status`, { status }, config);
            fetchRequests();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Gate Authorization</h2>
                    <p className="text-sm text-[#86868B] font-medium">Monitoring {requests.filter(r => r.status === 'Pending').length} pending departure requests.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold border-muted shadow-none gap-2">
                        <Calendar className="h-4 w-4" /> View Calendar
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-44 rounded-[2rem] bg-muted/30 animate-pulse" />
                    ))
                ) : requests.length === 0 ? (
                    <div className="py-20 text-center apple-card border-dashed border-2 bg-muted/10 opacity-50 flex flex-col items-center">
                        <FileText className="h-10 w-10 mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-bold text-foreground">No Active Requests</h3>
                        <p className="text-sm text-muted-foreground">All gate pass applications have been processed.</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <Card key={req._id} className="apple-card border-none bg-white shadow-sm group hover:shadow-md transition-all overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    <div className="p-8 flex-1 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center">
                                                    <User className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#1D1D1F]">{req.student?.name}</h3>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Room {req.student?.roomNumber || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <Badge className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none ${
                                                req.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                                req.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                                'bg-orange-50 text-orange-600'
                                            }`}>
                                                {req.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                                    <LogOut className="h-3 w-3" /> Scheduled Departure
                                                </p>
                                                <p className="text-sm font-bold text-[#1D1D1F]">
                                                    {new Date(req.outDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                                    <LogIn className="h-3 w-3" /> Expected Return
                                                </p>
                                                <p className="text-sm font-bold text-[#1D1D1F]">
                                                    {new Date(req.inDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-4 p-4 rounded-2xl bg-[#F5F5F7]">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Reason for Leave</p>
                                            <p className="text-xs text-[#1D1D1F] leading-relaxed italic">"{req.reason}"</p>
                                        </div>
                                    </div>

                                    <div className={`lg:w-48 p-8 flex flex-col justify-center gap-3 ${
                                        req.status === 'Pending' ? 'bg-[#FBFBFD]' : 'bg-muted/10'
                                    }`}>
                                        {req.status === 'Pending' ? (
                                            <>
                                                <Button 
                                                    onClick={() => updateStatus(req._id, 'Approved')}
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl h-11"
                                                >
                                                    Authorize
                                                </Button>
                                                <Button 
                                                    variant="outline"
                                                    onClick={() => updateStatus(req._id, 'Rejected')}
                                                    className="w-full border-red-100 text-red-500 hover:bg-red-50 font-bold rounded-xl h-11"
                                                >
                                                    Decline
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                {req.status === 'Approved' ? <CheckCircle2 className="h-8 w-8 text-green-500" /> : <XCircle className="h-8 w-8 text-red-500" />}
                                                <span className="text-[10px] font-black uppercase tracking-widest">Archive</span>
                                            </div>
                                        )}
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

export default AdminGatePass;
