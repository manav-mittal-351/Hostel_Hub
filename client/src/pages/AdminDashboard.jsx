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
        <div className="space-y-10 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-2">
                <div>
                    <h1 className="section-title">Institutional Oversight</h1>
                    <p className="section-subtitle">Real-time performance indicators and strategic administrative telemetry.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-10 px-5 text-[11px] font-bold uppercase tracking-widest border-border/60 bg-white hover:bg-secondary/50 rounded-xl flex items-center gap-2 transition-all">
                        <Settings className="h-3.5 w-3.5" /> Registry Config
                    </Button>
                    <Link to="/register">
                        <Button className="btn-primary h-10 px-8 text-[11px] font-bold uppercase tracking-widest active:scale-95 shadow-lg shadow-primary/10 flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Enroll Resident
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminStatsCard 
                    title="Active Cohort" 
                    value={stats.totalStudents} 
                    icon={Users} 
                    trend="+12% Sector Growth"
                />
                <AdminStatsCard 
                    title="Synthetic Occupancy" 
                    value={`${stats.occupancy.rate}%`} 
                    icon={BedDouble} 
                    trend={`${stats.occupancy.occupied} Units Active`}
                />
                <AdminStatsCard 
                    title="Unresolved Petitions" 
                    value={stats.pendingComplaints} 
                    icon={AlertCircle} 
                    trend="Requires Protocol Action"
                />
                <AdminStatsCard 
                    title="Monthly Revenue" 
                    value={`₹${(stats.monthlyRevenue / 1000).toFixed(1)}K`} 
                    icon={TrendingUp} 
                    trend="Target Performance"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3">
                    <Card className="premium-card bg-white p-0 overflow-hidden border-border/60 shadow-sm">
                        <CardHeader className="p-7 border-b border-border bg-secondary/10">
                            <div>
                                <CardTitle className="text-[17px] font-bold text-foreground">Operational Protocols</CardTitle>
                                <CardDescription className="text-[12px] font-medium">Global shortcuts for high-frequency administrative tasks.</CardDescription>
                            </div>
                        </CardHeader>
                        <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                            <ManagementGridLink 
                                to="/room-allotment" 
                                icon={BedDouble} 
                                title="Unit Allocation" 
                                description="Coordinate residential inventory"
                            />
                            <ManagementGridLink 
                                to="/complaints" 
                                icon={AlertCircle} 
                                title="Petition Resolution" 
                                description="Audit student support tickets"
                            />
                            <ManagementGridLink 
                                to="/gate-pass" 
                                icon={FileText} 
                                title="Logbook Control" 
                                description="Synchronize entry & exit data"
                            />
                            <ManagementGridLink 
                                to="/register" 
                                icon={UserPlus} 
                                title="Resident Onboarding" 
                                description="Index new academic members"
                            />
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="premium-card bg-white p-0 overflow-hidden border-border/60 shadow-sm h-[400px]">
                        <CardHeader className="p-7 border-b border-border bg-secondary/10 flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-[17px] font-bold text-foreground">Registry Stream</CardTitle>
                                <CardDescription className="text-[12px] font-medium">Real-time system synchronization.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Active</span>
                            </div>
                        </CardHeader>
                        <div className="p-7 space-y-7 relative h-[calc(400px-110px)] overflow-y-auto">
                            <ActivityItem text="New resident synchronized in Block A, Unit 102" time="2 mins ago" />
                            <ActivityItem text="Maintenance ticket ref #402 finalized" time="15 mins ago" />
                            <ActivityItem text="Night verification sequence complete" time="1 hour ago" />
                            <ActivityItem text="Access request identified from Resident #284" time="3 hours ago" />
                            
                            <Button variant="ghost" className="w-full mt-2 text-muted-foreground hover:text-primary font-bold text-[10px] uppercase tracking-widest gap-2 rounded-xl transition-all border border-transparent hover:border-border/60 bg-secondary/5">
                                Audit Ledger <ArrowRight className="h-3.5 w-3.5" />
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
    <div className="flex items-start gap-4 border-l-2 border-secondary pl-4 py-0.5 group">
        <div className="space-y-0.5">
            <p className="text-[13px] font-medium text-foreground leading-relaxed group-hover:text-primary transition-colors">{text}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{time}</p>
        </div>
    </div>
);

export default AdminDashboard;
