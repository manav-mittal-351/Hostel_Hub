import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import AdminGatePass from "@/components/AdminGatePass"; // Import Admin Component

const GatePass = () => {
    const { user } = useContext(AuthContext); 
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        type: 'Outing',
        outDate: '',
        inDate: '',
        reason: ''
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
            const authToken = user?.token || token;
            const config = { headers: { Authorization: `Bearer ${authToken}` } };
            await axios.post("http://localhost:5000/api/gate-pass", formData, config);
            fetchRequests();
            setFormData({ type: 'Outing', outDate: '', inDate: '', reason: '' });
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
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="h-28" />
                <div className="container mx-auto p-6 space-y-8 pt-4 max-w-7xl">
                    <h1 className="text-3xl font-bold text-foreground">Gate Pass Management</h1>
                    <AdminGatePass />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="h-28" />
            <div className="container mx-auto p-6 space-y-8 pt-4 max-w-7xl">
                <h1 className="text-3xl font-bold text-foreground">Gate Pass Request</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Request</CardTitle>
                            <CardDescription>Apply for a leave or outing pass.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        id="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                    >
                                        <option value="Outing">Outing (Day Pass)</option>
                                        <option value="Leave">Leave (Overnight)</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="outDate">Out Date & Time</Label>
                                        <Input type="datetime-local" id="outDate" value={formData.outDate} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="inDate">In Date & Time</Label>
                                        <Input type="datetime-local" id="inDate" value={formData.inDate} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reason">Reason</Label>
                                    <Textarea id="reason" placeholder="Why do you need a pass?" value={formData.reason} onChange={handleChange} required />
                                </div>
                                <Button className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {requests.length > 0 ? (
                                <div className="space-y-4">
                                    {requests.map(req => (
                                        <div key={req._id} className="border-b pb-4 last:border-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">{req.type}</p>
                                                    <p className="text-sm text-muted-foreground">{new Date(req.outDate).toLocaleString()} - {new Date(req.inDate).toLocaleString()}</p>
                                                    <p className="text-sm mt-1">{req.reason}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded font-medium ${req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No recent pass requests.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default GatePass;
