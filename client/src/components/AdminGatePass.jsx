import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminGatePass = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = user?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get("http://localhost:5000/api/gate-pass", config);
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
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
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">All Pass Requests</h2>
            {requests.length === 0 ? (
                <p className="text-muted-foreground">No pending requests.</p>
            ) : (
                <div className="grid gap-4">
                    {requests.map((req) => (
                        <Card key={req._id} className="border-l-4 border-l-primary">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{req.student?.name} ({req.type})</CardTitle>
                                        <p className="text-sm text-muted-foreground">Room: {req.student?.roomNumber || 'N/A'}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {req.status.toUpperCase()}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="font-semibold text-muted-foreground">Out Time</p>
                                        <p>{new Date(req.outDate).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-muted-foreground">In Time</p>
                                        <p>{new Date(req.inDate).toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className="text-sm italic mb-4">"{req.reason}"</p>

                                {req.status === 'Pending' && (
                                    <div className="flex gap-2">
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(req._id, 'Approved')}>
                                            Approve
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => updateStatus(req._id, 'Rejected')}>
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminGatePass;
