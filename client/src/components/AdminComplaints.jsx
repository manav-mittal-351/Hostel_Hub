import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminComplaints = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/complaints', config);
            setComplaints(data);
        } catch (error) {
            console.error("Error fetching complaints", error);
        }
    };

    const resolveComplaint = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`http://localhost:5000/api/complaints/${id}/resolve`, {}, config);
            fetchComplaints();
        } catch (error) {
            console.error("Error resolving complaint", error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">All Complaints</h2>
            {complaints.length === 0 ? <p className="text-muted-foreground">No complaints found.</p> : (
                <div className="grid gap-4">
                    {complaints.map((complaint) => (
                        <Card key={complaint._id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                                    <span className={`px-2 py-1 rounded text-xs ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {complaint.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-sm text-primary">By: {complaint.student?.name} (Room: {complaint.student?.roomNumber || 'N/A'})</div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">{complaint.description}</p>
                                {complaint.status === 'pending' && (
                                    <Button size="sm" onClick={() => resolveComplaint(complaint._id)}>Mark as Resolved</Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminComplaints;
