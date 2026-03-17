import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, MapPin, Send, CheckCircle2, QrCode, AlertTriangle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
        destination: '' 
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
            const { data } = await axios.get("/api/gate-pass/my-passes", config);
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
            await axios.post("/api/gate-pass", formData, config);
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
                    <h1 className="section-title">Gate Authorization Center</h1>
                    <p className="section-subtitle">Monitor and approve student exit and entry permissions.</p>
                </header>
                <AdminGatePass />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="section-title">Digital GatePass System</h1>
                <p className="section-subtitle">Secure outing and leave authorization for residents.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="premium-card bg-white p-0 overflow-hidden">
                        <CardHeader className="px-7 py-6 border-b border-border bg-secondary/30">
                            <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" /> Authorization Request
                            </CardTitle>
                            <CardDescription className="text-[12px]">Please provide accurate timeline and destination details.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-7">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Permit Classification</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, type: 'Outing'})}
                                            className={`p-4 rounded-2xl border-2 transition-all text-left space-y-2 ${formData.type === 'Outing' ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-border/50 bg-secondary/10 hover:border-primary/30'}`}
                                        >
                                            <div className={`p-2 rounded-lg w-fit ${formData.type === 'Outing' ? 'bg-primary text-white' : 'bg-white text-muted-foreground'}`}>
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[13px] text-foreground">Day Pass</p>
                                                <p className="text-[10px] text-muted-foreground font-medium">Single day sector exit</p>
                                            </div>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, type: 'Leave'})}
                                            className={`p-4 rounded-2xl border-2 transition-all text-left space-y-2 ${formData.type === 'Leave' ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-border/50 bg-secondary/10 hover:border-primary/30'}`}
                                        >
                                            <div className={`p-2 rounded-lg w-fit ${formData.type === 'Leave' ? 'bg-primary text-white' : 'bg-white text-muted-foreground'}`}>
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[13px] text-foreground">Overnight Pass</p>
                                                <p className="text-[10px] text-muted-foreground font-medium">Multiple days duration</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Departure Schedule</Label>
                                        <Input 
                                            id="outDate"
                                            type="datetime-local" 
                                            className="h-11 font-medium"
                                            value={formData.outDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Expected Return</Label>
                                        <Input 
                                            id="inDate"
                                            type="datetime-local" 
                                            className="h-11 font-medium"
                                            value={formData.inDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Reason for Authorization</Label>
                                    <textarea 
                                        id="reason"
                                        rows="3"
                                        className="w-full rounded-xl p-4 text-[13px] bg-secondary/20 border border-border/50 focus:bg-white transition-all outline-none resize-none min-h-[80px] font-medium"
                                        placeholder="Briefly explain the purpose of your exit..."
                                        value={formData.reason}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <Button className="w-full h-11 btn-primary text-[13px] font-semibold gap-2 active:scale-95" disabled={loading}>
                                    <Send className="h-4 w-4" /> {loading ? 'Processing...' : 'Submit for Approval'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-[17px] font-semibold text-foreground tracking-tight">Personal Permit History</h2>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Total {requests.length} entries</p>
                        </div>
                        <div className="grid gap-4">
                            {requests.length > 0 ? (
                                requests.map(req => (
                                    <Card key={req._id} className="premium-card bg-white p-6 group hover:border-primary/30">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-5">
                                                <div className="p-3 bg-secondary/50 group-hover:bg-primary/5 transition-colors rounded-2xl h-fit border border-border/50 text-muted-foreground group-hover:text-primary">
                                                    <Clock className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <Badge className="rounded-lg bg-secondary/50 border-none text-[9px] uppercase font-bold text-muted-foreground px-2 py-0.5">
                                                            {req.type}
                                                        </Badge>
                                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                                            {new Date(req.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-[15px] font-bold text-foreground leading-tight">{req.reason}</h3>
                                                    <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5 italic">
                                                        <Calendar className="h-3 w-3" /> Scheduled Absence: {new Date(req.outDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} — {new Date(req.inDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg ${
                                                req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                                req.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="py-16 text-center rounded-3xl border border-dashed border-border/60 bg-secondary/5 grayscale opacity-50">
                                    <p className="text-[13px] font-semibold text-muted-foreground tracking-tight italic">No activity found in the registry.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="premium-card bg-white p-7 text-center space-y-7 sticky top-8">
                        <div className="inline-flex items-center justify-center p-5 bg-secondary/30 rounded-3xl border border-border/50 mx-auto relative group overflow-hidden">
                            <QrCode className="h-24 w-24 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-3">
                            <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest mx-auto block w-fit">
                                Authenticator Internal
                            </Badge>
                            <h3 className="text-[17px] font-bold text-foreground tracking-tight">Authorization Status</h3>
                            <p className="text-[12px] text-muted-foreground font-medium px-4 leading-relaxed">
                                Once approved, your dynamic QR identity will activate for gate authentication.
                            </p>
                        </div>
                        
                        <div className="pt-6 border-t border-border/50 text-left space-y-4">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Protocols & Guidelines</h4>
                            <ul className="space-y-4">
                                {[
                                    "Biometric or QR authentication at gate",
                                    "Mandatory reporting by 22:00 IST",
                                    "Professional leave requires verification"
                                ].map((guide, i) => (
                                    <li key={i} className="flex font-semibold items-start gap-3 text-[12px] text-foreground">
                                        <div className="mt-0.5 p-0.5 rounded-full bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </div>
                                        {guide}
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
