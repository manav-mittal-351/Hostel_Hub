import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, BedDouble, AlertCircle, TrendingUp, ArrowRight, Settings, Plus, UserPlus, FileText } from "lucide-react";
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
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin <span className="text-primary">Control</span></h1>
                    <p className="text-muted-foreground mt-1">Real-time overview of your hostel operations.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold border-muted shadow-none gap-2">
                        <Settings className="h-4 w-4" /> System Settings
                    </Button>
                    <Button className="rounded-xl font-bold shadow-none gap-2">
                        <Plus className="h-4 w-4" /> New Faculty
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminStatsCard 
                    title="Active Residents" 
                    value={stats.totalStudents} 
                    icon={Users} 
                    trend="+12% from last month"
                    color="blue"
                />
                <AdminStatsCard 
                    title="Room Occupancy" 
                    value={`${stats.occupancy.rate}%`} 
                    icon={BedDouble} 
                    trend={`${stats.occupancy.occupied} beds filled`}
                    color="indigo"
                />
                <AdminStatsCard 
                    title="Pending Issues" 
                    value={stats.pendingComplaints} 
                    icon={AlertCircle} 
                    trend="Needs attention"
                    color="orange"
                />
                <AdminStatsCard 
                    title="Revenue" 
                    value={`₹${(stats.monthlyRevenue / 1000).toFixed(1)}K`} 
                    icon={TrendingUp} 
                    trend="Target: ₹10L"
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Management Section */}
                <div className="lg:col-span-3 space-y-8">
                    <Card className="apple-card border-none bg-white shadow-sm">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold">Smart Management</CardTitle>
                            <CardDescription>Quick shortcuts for daily administrative tasks.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ManagementGridLink 
                                to="/room-allotment" 
                                icon={BedDouble} 
                                title="Room Allocation" 
                                description="Manage beds and blocks"
                                color="bg-blue-50 text-blue-500"
                            />
                            <ManagementGridLink 
                                to="/complaints" 
                                icon={AlertCircle} 
                                title="Resolve Tickets" 
                                description="Handle student complaints"
                                color="bg-orange-50 text-orange-500"
                            />
                            <ManagementGridLink 
                                to="/gate-pass" 
                                icon={FileText} 
                                title="Gate Logbook" 
                                description="Monitor entry & exit"
                                color="bg-purple-50 text-purple-500"
                            />
                            <ManagementGridLink 
                                to="/register" 
                                icon={UserPlus} 
                                title="Onboard Student" 
                                description="Add new residents"
                                color="bg-green-50 text-green-500"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* System Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="apple-card border-none bg-[#1D1D1F] text-white p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold italic">Global Feed</h3>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Live</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <ActivityItem text="New resident joined Block A" time="2 mins ago" />
                            <ActivityItem text="Maintenance ticket #402 resolved" time="15 mins ago" />
                            <ActivityItem text="Night roll-call completed" time="1 hour ago" />
                            <ActivityItem text="Mess menu updated for lunch" time="3 hours ago" />
                        </div>
                        <Button variant="ghost" className="w-full mt-10 hover:bg-white/5 text-white/50 hover:text-white font-bold gap-2">
                            View Full History <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const AdminStatsCard = ({ title, value, icon: Icon, trend, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-500",
        indigo: "bg-indigo-50 text-indigo-500",
        orange: "bg-orange-50 text-orange-500",
        green: "bg-green-50 text-green-500",
    };

    return (
        <Card className="apple-card border-none bg-white p-6 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
                <h3 className="text-3xl font-black text-[#1D1D1F] tracking-tight">{value}</h3>
                <p className="text-[10px] text-muted-foreground font-medium italic">{trend}</p>
            </div>
        </Card>
    );
};

const ManagementGridLink = ({ to, icon: Icon, title, description, color }) => (
    <Link to={to} className="group p-6 rounded-3xl bg-muted/20 hover:bg-white border border-transparent hover:border-muted hover:shadow-sm transition-all flex items-start gap-4">
        <div className={`p-3 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <h4 className="font-bold text-[#1D1D1F]">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    </Link>
);

const ActivityItem = ({ text, time }) => (
    <div className="flex items-start gap-4 border-l border-white/10 pl-4 py-1">
        <div className="space-y-0.5">
            <p className="text-[13px] font-medium text-white/90 leading-snug">{text}</p>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{time}</p>
        </div>
    </div>
);

export default AdminDashboard;
