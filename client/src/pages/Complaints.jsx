import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, Send, Plus, Filter, MessageSquare, Info, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminComplaints from "@/components/AdminComplaints";

const Complaints = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "General"
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             c.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || c.status?.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    useEffect(() => {
        if (user?.role === 'student') {
            fetchComplaints();
        }
    }, [user]);

    const fetchComplaints = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get("http://localhost:5000/api/complaints/my", config);
            setComplaints(data);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post("http://localhost:5000/api/complaints", formData, config);
            alert("Complaint submitted successfully!");
            setFormData({ title: "", description: "", category: "General" });
            fetchComplaints();
        } catch (error) {
            alert("Failed to submit complaint.");
        }
    };

    if (user?.role === 'admin') {
        return <AdminComplaints />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="section-title">Support & Assistance</h1>
                <p className="text-sm text-muted-foreground mt-1">Submit maintenance requests or report issues to the hostel administration.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Submit Form */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="premium-card bg-white p-0 overflow-hidden sticky top-8">
                        <CardHeader className="px-7 py-6 border-b border-border bg-secondary/30">
                            <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                                <Plus className="h-4 w-4 text-primary" /> New Support Ticket
                            </CardTitle>
                            <CardDescription className="text-[12px]">Briefly describe the issue you're facing.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-7">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Classification</Label>
                                    <select 
                                        className="w-full h-11 px-4 text-[13px] bg-secondary/20 border border-border/50 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%20xmlns%3D%220%200%2010%206%22%3E%3Cpath%20d%3D%22M1%201L5%205L9%201%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:10px] bg-[right_1rem_center] bg-no-repeat"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Electrical</option>
                                        <option>Plumbing</option>
                                        <option>Internet</option>
                                        <option>Housekeeping</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Issue Title</Label>
                                    <Input 
                                        className="h-11 px-4 text-[13px] bg-secondary/20 border-border/50 focus:bg-white transition-all rounded-xl"
                                        placeholder="E.g. Room light not working"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Context & Details</Label>
                                    <textarea 
                                        rows="4"
                                        className="w-full rounded-xl p-4 text-[13px] bg-secondary/20 border border-border/50 focus:bg-white transition-all outline-none resize-none min-h-[100px]"
                                        placeholder="Please provide specific details..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <Button className="w-full h-11 btn-primary text-[13px] font-semibold gap-2">
                                    <Send className="h-3.5 w-3.5" /> Dispatch Request
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="premium-card p-5 bg-emerald-50/30 border-emerald-100/50 flex gap-4">
                        <div className="p-2.5 bg-white rounded-xl h-fit border border-emerald-100">
                            <Info className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-semibold text-emerald-900 mb-0.5">Response Protocol</h4>
                            <p className="text-[11px] text-emerald-800/70 leading-relaxed font-medium">
                                Maintenance units typically respond within 24-48 hours during business cycles.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Complaints List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-b border-border/50">
                        <div>
                            <h2 className="text-[17px] font-semibold text-foreground tracking-tight">Personal History</h2>
                            <p className="text-[12px] text-muted-foreground font-medium">You have {complaints.length} registered tickets.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                                <Input 
                                    placeholder="Filter by title or content..."
                                    className="pl-12 h-11 w-full sm:w-72 text-[13px] bg-white border-border/60 focus:bg-white rounded-xl shadow-sm transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select 
                                className="h-11 px-6 text-[11px] font-bold uppercase tracking-wider bg-white border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/5 appearance-none select-custom pr-12 transition-all cursor-pointer hover:bg-muted/50"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="All">All statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-32 rounded-2xl bg-muted/30 animate-pulse border border-border/50" />
                            ))
                        ) : filteredComplaints.length > 0 ? (
                            filteredComplaints.map((complaint) => (
                                <Card key={complaint._id} className="premium-card bg-white hover:border-primary/30 group transition-all p-6">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex gap-5">
                                            <div className="p-3 bg-secondary/50 group-hover:bg-primary/5 transition-colors rounded-2xl h-fit border border-border/50">
                                                <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg border-none shadow-sm ${
                                                        complaint.status?.toLowerCase() === 'resolved' 
                                                        ? 'bg-emerald-500 text-white' 
                                                        : complaint.status?.toLowerCase() === 'in progress'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-amber-400 text-white'
                                                    }`}>
                                                        {complaint.status || 'Submitted'}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                                        {new Date(complaint.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                                <h3 className="text-[15px] font-bold text-foreground">{complaint.title}</h3>
                                                <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 max-w-xl font-medium">{complaint.description}</p>
                                            </div>
                                        </div>
                                        <Badge className="rounded-lg bg-secondary/50 border-none text-[9px] uppercase font-bold text-muted-foreground px-2.5 py-1">
                                            {complaint.category}
                                        </Badge>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="py-24 text-center rounded-3xl border border-dashed border-border/60 bg-secondary/10 flex flex-col items-center justify-center space-y-3 grayscale opacity-60">
                                <AlertCircle className="h-10 w-10 text-muted-foreground" />
                                <p className="text-[13px] font-semibold text-muted-foreground tracking-tight">Historical Record Clear</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Complaints;
