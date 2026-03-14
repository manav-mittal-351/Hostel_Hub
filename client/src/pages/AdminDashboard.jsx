import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, BedDouble, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalStudents: 0,
        occupancy: { occupied: 0, capacity: 0, rate: 0 },
        pendingComplaints: 0,
        monthlyRevenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (!user?.token) return;
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get("http://localhost:5000/api/admin/stats", config);
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        if (user?.role === 'admin' && user?.token) {
            fetchStats();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="h-28" />
            <div className="container mx-auto p-6 space-y-8 pt-4 max-w-7xl">
                <div className="flex justify-between items-center glass-panel p-6 rounded-2xl">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground text-glow">Admin Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Overview of hostel operations.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-glow">{stats.totalStudents}</div>
                            <p className="text-xs text-muted-foreground">Registered students</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
                            <BedDouble className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-glow">{stats.occupancy.rate}%</div>
                            <p className="text-xs text-muted-foreground">{stats.occupancy.occupied}/{stats.occupancy.capacity} Beds</p>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
                            <AlertCircle className="h-4 w-4 text-orange-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-400 text-glow">{stats.pendingComplaints}</div>
                            <Link to="/complaints" className="text-xs text-primary hover:underline mt-1 block">View All</Link>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenue (Month)</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-400 text-glow">₹{stats.monthlyRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">This month</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common management tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <Link to="/room-allotment">
                                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                                    <BedDouble className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-semibold">Manage Rooms</div>
                                        <div className="text-xs text-muted-foreground">Allocate or create</div>
                                    </div>
                                </Button>
                            </Link>
                            <Link to="/complaints">
                                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                                    <AlertCircle className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-semibold">Complaints</div>
                                        <div className="text-xs text-muted-foreground">Resolve issues</div>
                                    </div>
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li className="flex items-center justify-between text-sm">
                                    <span>New student registered</span>
                                    <span className="text-muted-foreground">2 hrs ago</span>
                                </li>
                                <li className="flex items-center justify-between text-sm">
                                    <span>Complaint #123 resolved</span>
                                    <span className="text-muted-foreground">5 hrs ago</span>
                                </li>
                                <li className="flex items-center justify-between text-sm">
                                    <span>Room 101 allocated</span>
                                    <span className="text-muted-foreground">1 day ago</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export default AdminDashboard;
