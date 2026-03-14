import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, Send, Plus, Filter, MessageSquare, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdminComplaints from "@/components/AdminComplaints";

const Complaints = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        category: "General"
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
            setFormData({ subject: "", description: "", category: "General" });
            fetchComplaints();
        } catch (error) {
            alert("Failed to submit complaint.");
        }
    };

    if (user?.role === 'admin') {
        return <AdminComplaints />;
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Support & <span className="text-primary">Complaints</span></h1>
                    <p className="text-muted-foreground mt-1">Report issues or request maintenance for your room.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Submit Form */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="apple-card border-none bg-white shadow-sm overflow-hidden">
                        <CardHeader className="bg-primary pb-8">
                            <CardTitle className="text-primary-foreground flex items-center gap-2">
                                <Plus className="h-5 w-5" /> New Request
                            </CardTitle>
                            <CardDescription className="text-primary-foreground/70">
                                Fill out the form below to file a new complaint.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 -mt-4 bg-white rounded-t-3xl relative z-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Category</label>
                                    <select 
                                        className="w-full bg-muted/30 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
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
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Subject</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-muted/30 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="Brief title of the issue"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Description</label>
                                    <textarea 
                                        rows="4"
                                        className="w-full bg-muted/30 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                        placeholder="Describe the problem in detail..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                                    <Send className="h-4 w-4" /> Submit Request
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="apple-card p-6 bg-blue-50/50 border-blue-100 flex gap-4">
                        <div className="p-3 bg-white rounded-2xl h-fit border border-blue-100">
                            <Info className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-blue-900 mb-1">Response Time</h4>
                            <p className="text-xs text-blue-700/70 leading-relaxed">
                                Maintenance requests are typically addressed within 24-48 hours. For emergencies, please call the warden's help desk.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Complaints List */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-foreground">My History</h2>
                        <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground gap-2">
                            <Filter className="h-4 w-4" /> Filter
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-32 rounded-3xl bg-muted animate-pulse" />
                            ))
                        ) : complaints.length > 0 ? (
                            complaints.map((complaint) => (
                                <Card key={complaint._id} className="apple-card border-none bg-white shadow-sm hover:shadow-md group transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-muted group-hover:bg-primary/10 transition-colors rounded-2xl h-fit">
                                                    <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                                            complaint.status === 'resolved' ? 'text-green-500' : 'text-orange-500'
                                                        }`}>
                                                            {complaint.status}
                                                        </span>
                                                        <div className="w-1 h-1 rounded-full bg-border" />
                                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-foreground mb-1">{complaint.subject}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="rounded-lg border-muted text-[10px] uppercase font-bold text-muted-foreground px-2 py-1">
                                                {complaint.category}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="py-20 text-center apple-card border-dashed border-2 bg-muted/10 opacity-50">
                                <AlertCircle className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm font-bold text-muted-foreground font-bold">No complaints filed yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Complaints;
