import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, MapPin, Send, CheckCircle2, QrCode, AlertTriangle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdminGatePass from "@/components/AdminGatePass";
import axios from "axios";

const GatePass = () => {
    const { user } = useContext(AuthContext); 
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        type: 'Outing',
        outDate: '',
        inDate: '',
        reason: '',
        destination: '' // Added destination if possible
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.role !== 'admin' && user.token) {
            fetchRequests();
        }
    }, [user]);

    const fetchRequests = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get("http://localhost:5000/api/gate-pass/my-passes", config);
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post("http://localhost:5000/api/gate-pass", formData, config);
            fetchRequests();
            setFormData({ type: 'Outing', outDate: '', inDate: '', reason: '', destination: '' });
            alert("Request submitted successfully!");
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === 'admin') {
        return (
            <div className="space-y-8 animate-in fade-in duration-700">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Gate Pass <span className="text-primary">Management</span></h1>
                    <p className="text-muted-foreground mt-1">Review and authorize student exit requests.</p>
                </header>
                <AdminGatePass />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Digital <span className="text-primary">Gatepass</span></h1>
                    <p className="text-muted-foreground mt-1">Apply for leave or temporary exit permits.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-3 space-y-8">
                    <Card className="apple-card border-none bg-white shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-6">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" /> Application Form
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Pass Type</label>
                                    <select 
                                        id="type"
                                        className="w-full bg-muted/30 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        value={formData.type}
                                        onChange={handleChange}
                                    >
                                        <option value="Outing">Outing (Day Pass)</option>
                                        <option value="Leave">Leave (Overnight)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Departure Time</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <input 
                                                id="outDate"
                                                type="datetime-local" 
                                                className="w-full bg-muted/30 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                value={formData.outDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Expected Return</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <input 
                                                id="inDate"
                                                type="datetime-local" 
                                                className="w-full bg-muted/30 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                value={formData.inDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Reason for Leave</label>
                                    <textarea 
                                        id="reason"
                                        rows="3"
                                        className="w-full bg-muted/30 border-none rounded-xl py-4 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                        placeholder="Explain why you need this gatepass..."
                                        value={formData.reason}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold gap-2 shadow-lg shadow-primary/20 transition-all" disabled={loading}>
                                    <Send className="h-4 w-4" /> {loading ? 'Submitting...' : 'Request Authorization'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground pl-1">Recent Requests</h2>
                        {requests.length > 0 ? (
                            requests.map(req => (
                                <Card key={req._id} className="apple-card border-none bg-white shadow-sm hover:shadow-md transition-all group">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="p-3 bg-muted group-hover:bg-primary/10 transition-colors rounded-2xl h-fit">
                                                    <Clock className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="rounded-lg border-muted text-[10px] uppercase font-bold text-primary px-2 py-0.5">
                                                            {req.type}
                                                        </Badge>
                                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                                            {new Date(req.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-foreground mb-1">{req.reason}</h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(req.outDate).toLocaleString()} → {new Date(req.inDate).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                                req.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                                req.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                                'bg-yellow-50 text-yellow-600'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground italic pl-1">No recent pass requests.</p>
                        )}
                    </div>
                </div>

                {/* Status Section */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="apple-card border-none bg-white shadow-sm overflow-hidden p-8 text-center space-y-6 sticky top-24">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/5 rounded-3xl border border-primary/10 mb-2">
                            <QrCode className="h-24 w-24 text-primary opacity-80" />
                        </div>
                        <div>
                            <Badge className="bg-green-50 text-green-600 border-none px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                Digital ID Ready
                            </Badge>
                            <h3 className="text-xl font-bold text-foreground">Pass Status</h3>
                            <p className="text-sm text-muted-foreground mt-2 px-4">
                                Once approved, your digital QR code will appear here for verification at the gate.
                            </p>
                        </div>
                        
                        <div className="pt-6 border-t border-muted/50 text-left space-y-4">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Guidelines</h4>
                            <ul className="space-y-3">
                                {[
                                    "QR scanning mandatory at main gate",
                                    "Entry after 10 PM is restricted",
                                    "Out-station leave requires parent SMS"
                                ].map((guide, i) => (
                                    <li key={i} className="flex font-medium items-center gap-3 text-xs text-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" /> {guide}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default GatePass;
