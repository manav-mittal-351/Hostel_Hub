import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BedDouble, CreditCard, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [complaintStats, setComplaintStats] = useState({ active: 0, pending: 0, resolved: 0 });

    useEffect(() => {
        const fetchComplaintStats = async () => {
            try {
                if (!user?.token) return;
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get("http://localhost:5000/api/complaints/my", config);
                
                const stats = data.reduce((acc, curr) => {
                    if (curr.status === 'pending') acc.pending++;
                    if (curr.status === 'resolved') acc.resolved++;
                    return acc;
                }, { pending: 0, resolved: 0 });

                setComplaintStats({
                    active: stats.pending,
                    pending: stats.pending,
                    resolved: stats.resolved
                });
            } catch (error) {
                console.error("Error fetching complaint stats:", error);
            }
        };

        fetchComplaintStats();
    }, [user]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="h-28" />
            <div className="container mx-auto p-6 space-y-8 pt-4 pb-12 max-w-7xl">
                <div className="flex justify-between items-center glass-panel p-6 rounded-2xl">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground text-glow">Welcome back, {user?.name}</h1>
                        <p className="text-muted-foreground mt-1">Here's what's happening in your hostel today.</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="font-semibold text-foreground/80">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-sm text-muted-foreground">Session 2024-2025</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <Card className="glass-card text-card-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Room Status</CardTitle>
                            <BedDouble className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-glow">{user?.roomNumber ? user.roomNumber : 'Not Assigned'}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {user?.roomNumber ? 'Occupied' : 'Pending Allocation'}
                            </p>
                            <Link to="/room-allotment" className="text-primary text-sm flex items-center gap-1 mt-4 hover:underline">
                                {user?.roomNumber ? 'View Details' : 'Book Now'} <ArrowRight className="w-3 h-3" />
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="glass-card text-card-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
                            <CreditCard className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${user?.roomNumber ? 'text-green-400' : 'text-muted-foreground'} text-glow`}>
                                {user?.roomNumber ? 'Paid' : 'No History'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {user?.roomNumber ? 'Next due: Feb 28, 2026' : 'Allocate room to view fees'}
                            </p>
                            <Link to="/payments" className="text-primary text-sm flex items-center gap-1 mt-4 hover:underline">
                                View History <ArrowRight className="w-3 h-3" />
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="glass-card text-card-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Complaints</CardTitle>
                            <AlertCircle className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-glow">{complaintStats.active}</div>
                            <p className="text-xs text-muted-foreground mt-1">{complaintStats.pending} Pending, {complaintStats.resolved} Resolved</p>
                            <Link to="/complaints" className="text-primary text-sm flex items-center gap-1 mt-4 hover:underline">
                                File Complaint <ArrowRight className="w-3 h-3" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export default StudentDashboard;
