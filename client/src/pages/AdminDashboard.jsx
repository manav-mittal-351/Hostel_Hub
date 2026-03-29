import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, BedDouble, AlertCircle, TrendingUp, ArrowRight, Settings, Plus, UserPlus, FileText, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalStudents: 0,
        occupancy: { occupied: 0, capacity: 0, rate: 0 },
        pendingComplaints: 0,
        monthlyRevenue: 0
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("all");
    const [searchResults, setSearchResults] = useState({ students: [], rooms: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get("/api/admin/stats", config);
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        if ((user?.role === 'admin' || user?.role === 'warden') && user?.token) {
            fetchStats();
        }
    }, [user]);

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/50 pb-4">
                <div>
                    <h1 className="section-title text-2xl sm:text-3xl">Admin Dashboard</h1>
                    <p className="section-subtitle mb-0">Overview of hostel activity and key stats.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/profile')}
                        className="h-10 px-4 sm:px-5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border-border/60 bg-white hover:bg-secondary/50 rounded-xl flex items-center gap-2 transition-all flex-1 sm:flex-none justify-center"
                    >
                        <Settings className="h-3.5 w-3.5" /> Settings
                    </Button>
                    <Link to="/register" className="flex-1 sm:flex-none">
                        <Button className="btn-primary h-10 w-full px-6 sm:px-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest active:scale-95 shadow-lg shadow-primary/10 flex items-center gap-2 justify-center">
                            <Plus className="h-4 w-4" /> Add Student
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <AdminStatsCard 
                    title="All Students" 
                    value={stats.totalStudents} 
                    icon={Users} 
                    trend="+12% this month"
                />
                <AdminStatsCard 
                    title="Room Status" 
                    value={`${stats.occupancy.rate}%`} 
                    icon={BedDouble} 
                    trend={`${stats.occupancy.occupied} Filled`}
                />
                <AdminStatsCard 
                    title="Open Complaints" 
                    value={stats.pendingComplaints} 
                    icon={AlertCircle} 
                    trend="Check now"
                />
                <AdminStatsCard 
                    title="Fees Collected" 
                    value={`₹${(stats.monthlyRevenue / 1000).toFixed(1)}K`} 
                    icon={TrendingUp} 
                    trend="Revenue View"
                />
            </div>

            {/* Analytics Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="premium-card bg-white p-7 border-border/60 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[17px] font-bold text-foreground flex items-center gap-2">
                                <PieChartIcon className="h-4 w-4 text-primary" /> Room Usage
                            </h3>
                            <p className="text-[12px] text-muted-foreground font-medium">How rooms are being used.</p>
                        </div>
                    </div>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Occupied', value: stats.occupancy.occupied },
                                        { name: 'Available', value: stats.occupancy.capacity - stats.occupancy.occupied }
                                    ]}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    <Cell fill="#2F5D50" /> {/* Brand Primary */}
                                    <Cell fill="#D9E5E2" /> {/* Brand Secondary */}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-8 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#2F5D50]" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase opacity-80">Occupied</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#D9E5E2]" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase opacity-80">Empty</span>
                        </div>
                    </div>
                </Card>

                <Card className="premium-card bg-white p-7 border-border/60 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[17px] font-bold text-foreground flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-primary" /> Revenue Growth
                            </h3>
                            <p className="text-[12px] text-muted-foreground font-medium">Monthly collection trends.</p>
                        </div>
                    </div>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Jan', amount: stats.monthlyRevenue * 0.8 },
                                { name: 'Feb', amount: stats.monthlyRevenue * 0.9 },
                                { name: 'Mar', amount: stats.monthlyRevenue }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#64748B' }} dy={10} />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{ fill: '#F8FAFC' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                />
                                <Bar dataKey="amount" fill="#2F5D50" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-6 opacity-40 italic">Updates automatically</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3">
                    <Card className="premium-card bg-white p-0 overflow-hidden border-border/60 shadow-sm">
                        <CardHeader className="p-5 sm:p-7 border-b border-border bg-secondary/10">
                            <div>
                                <CardTitle className="text-[16px] sm:text-[17px] font-bold text-foreground">Admin Tasks</CardTitle>
                                <CardDescription className="text-[11px] sm:text-[12px] font-medium">Manage students, rooms, and payments.</CardDescription>
                            </div>
                        </CardHeader>
                        <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-white">
                            <ManagementGridLink 
                                to="/room-allotment" 
                                icon={BedDouble} 
                                title="Room Booking" 
                                description="Assign rooms to students"
                            />
                            <ManagementGridLink 
                                to="/complaints" 
                                icon={AlertCircle} 
                                title="Fix Complaints" 
                                description="Resolve student issues"
                            />
                            <ManagementGridLink 
                                to="/gate-pass" 
                                icon={FileText} 
                                title="Gatepasses" 
                                description="Track student entry/exit"
                            />
                            <ManagementGridLink 
                                to="/register" 
                                icon={UserPlus} 
                                title="Add New Student" 
                                description="Register a new student to the hostel"
                            />
                            <ManagementGridLink 
                                to="/students" 
                                icon={Users} 
                                title="All Students" 
                                description="View all student records"
                            />
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="premium-card bg-white p-0 overflow-hidden border-border/60 shadow-sm h-[400px]">
                        <CardHeader className="p-7 border-b border-border bg-secondary/10 flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-[17px] font-bold text-foreground">Recent Activity</CardTitle>
                                <CardDescription className="text-[12px] font-medium">What's happening now.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Live</span>
                            </div>
                        </CardHeader>
                        <div className="p-7 space-y-7 relative h-[calc(400px-110px)] overflow-y-auto custom-scrollbar">
                            <ActivityItem text={`${stats.totalStudents} students are registered.`} time="Connected" />
                            <ActivityItem text={`${stats.occupancy.occupied} / ${stats.occupancy.capacity} rooms are filled.`} time="Stats" />
                            {stats.pendingComplaints > 0 && (
                                <ActivityItem text={`${stats.pendingComplaints} complaints need attention.`} time="Urgent" />
                            )}
                            <ActivityItem text={`Collections: ₹${stats.monthlyRevenue.toLocaleString()} this month.`} time="Synced" />
                            
                            <Button 
                                variant="ghost" 
                                onClick={() => navigate('/notifications')}
                                className="w-full mt-2 text-muted-foreground hover:text-primary font-bold text-[10px] uppercase tracking-widest gap-2 rounded-xl transition-all border border-transparent hover:border-border/60 bg-secondary/5 h-12"
                            >
                                See All <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const AdminStatsCard = ({ title, value, icon: Icon, trend }) => {
    return (
        <Card className="premium-card p-5 bg-white border-border shadow-none">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/50">
                    <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{value}</h3>
                <p className="text-[11px] text-muted-foreground font-medium">{trend}</p>
            </div>
        </Card>
    );
};

const ManagementGridLink = ({ to, icon: Icon, title, description }) => (
    <Link to={to} className="group p-5 rounded-2xl bg-secondary/20 hover:bg-white border border-transparent hover:border-border hover:shadow-sm transition-all duration-300 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-white border border-border/50 text-primary group-hover:scale-105 transition-transform shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
            <h4 className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{description}</p>
        </div>
    </Link>
);

const ActivityItem = ({ text, time }) => (
    <div className="flex items-start gap-4 border-l-2 border-secondary pl-4 py-1 group hover:border-primary transition-all duration-300">
        <div className="space-y-1">
            <p className="text-[12px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{text}</p>
            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">{time}</p>
        </div>
    </div>
);

export default AdminDashboard;