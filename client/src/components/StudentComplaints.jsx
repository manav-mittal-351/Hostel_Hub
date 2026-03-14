import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const StudentComplaints = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

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
            const { data } = await axios.get('http://localhost:5000/api/complaints/my', config);
            setComplaints(data);
        } catch (error) {
            console.error("Error fetching complaints", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('http://localhost:5000/api/complaints', { title, description }, config);
            setTitle('');
            setDescription('');
            fetchComplaints();
        } catch (error) {
            console.error("Error submitting complaint", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>File a Complaint</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Complaint'}</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                <h2 className="text-xl font-bold text-primary">My Complaints</h2>
                {complaints.length === 0 ? <p className="text-muted-foreground">No complaints found.</p> : (
                    complaints.map((complaint) => (
                        <Card key={complaint._id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                                    <span className={`px-2 py-1 rounded text-xs ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {complaint.status.toUpperCase()}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{complaint.description}</p>
                                <p className="text-xs text-muted-foreground mt-2">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentComplaints;
