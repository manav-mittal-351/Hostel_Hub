import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { BedDouble, CreditCard, AlertCircle, ArrowRight, FileText, CheckCircle2, ShieldCheck, MessageSquare, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [complaintStats, setComplaintStats] = useState({ active: 0, pending: 0, resolved: 0 });
    const [pendingDues, setPendingDues] = useState(0);

    const fetchDashboardData = async () => {
        try {
            if (!user?.token) return;
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            // Fetch everything in parallel
            const [complaintsRes, paymentsRes, actionsRes] = await Promise.all([
                axios.get("/api/complaints/my", config).catch(() => ({ data: [] })),
                axios.get("/api/payments/my-payments", config).catch(() => ({ data: [] })),
                axios.get("/api/non-disciplinary/my", config).catch(() => ({ data: [] }))
            ]);

            // Process complaints
            const stats = complaintsRes.data.reduce((acc, curr) => {
                if (curr.status === 'pending') acc.pending++;
                if (curr.status === 'resolved') acc.resolved++;
                return acc;
            }, { pending: 0, resolved: 0 });

            setComplaintStats({
                active: stats.pending,
                pending: stats.pending,
                resolved: stats.resolved
            });

            // Process dues
            const combined = [...(paymentsRes.data || []), ...(actionsRes.data || [])];
            const dues = combined.reduce((acc, curr) => {
                const isPending = ['pending', 'overdue'].includes(curr.status?.toLowerCase());
                return isPending ? acc + (curr.amount || 0) : acc;
            }, 0);
            setPendingDues(dues);

        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/50 pb-4">
                <div>
                    <h1 className="section-title text-2xl sm:text-3xl">
                        Welcome back, <span className="text-primary">{user?.name}</span>
                    </h1>
                    <p className="section-subtitle mb-0">A quick look at your room, payments, and recent updates.</p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-border/60 px-4 py-2 rounded-xl shadow-sm self-start sm:self-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Connected</span>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatsCard 
                    title="Your Room" 
                    value={user?.roomNumber || "No Room"} 
                    subtitle={user?.roomNumber ? "Booked" : "Not assigned"}
                    icon={BedDouble}
                    link="/room-allotment"
                    linkText={user?.roomNumber ? "View" : "Book"}
                />
                <StatsCard 
                    title="Payments" 
                    value={pendingDues > 0 ? `₹${pendingDues.toLocaleString()}` : (user?.roomNumber ? "No Dues" : "N/A")} 
                    subtitle={pendingDues > 0 ? "Pending Dues" : (user?.roomNumber ? "Fees paid" : "No active dues")}
                    icon={CreditCard}
                    link="/payments"
                    linkText="View"
                />
                <StatsCard 
                    title="Complaints" 
                    value={complaintStats.active} 
                    subtitle={`${complaintStats.resolved} Closed`}
                    icon={AlertCircle}
                    link="/complaints"
                    linkText="View All"
                />
                <StatsCard 
                    title="Gatepass Status" 
                    value="Approved" 
                    subtitle="Ready to exit"
                    icon={FileText}
                    link="/gate-pass"
                    linkText="Check"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Reminder System */}
                    {user?.roomNumber && (
                        <div className="bg-primary shadow-2xl shadow-primary/20 rounded-[2rem] p-6 sm:p-8 relative overflow-hidden group animate-in slide-in-from-top-6 duration-1000">
                            {/* Decorative Elements */}
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/15 transition-all duration-700" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                            
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0">
                                        <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-white animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                                            {pendingDues > 0 ? "Outstanding Dues" : "Payment Reminder"}
                                        </h3>
                                        <p className="text-white/70 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] leading-none mb-2 italic">
                                            {pendingDues > 0 ? `Total Pending: ₹${pendingDues.toLocaleString()}` : `Next Due: ${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`}
                                        </p>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit border border-white/10 mx-auto sm:mx-0">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                                            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Resident</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <Link to="/payments" className="w-full">
                                        <Button className="w-full bg-white text-primary hover:bg-slate-50 transition-all font-black uppercase tracking-widest rounded-xl h-11 sm:h-12 px-6 sm:px-8 text-[10px] sm:text-[11px] shadow-xl active:scale-[0.98]">
                                            See History
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <Card className="premium-card overflow-hidden border-border bg-white p-0 shadow-sm">
                    <CardHeader className="p-7 border-b border-border bg-secondary/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-[17px] font-bold text-foreground">Recent Activity</CardTitle>
                                <CardDescription className="text-[12px] font-medium">A quick look at your latest updates.</CardDescription>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-primary/50" />
                        </div>
                    </CardHeader>
                    <div className="divide-y divide-border/40 max-h-[300px] overflow-y-auto">
                        {complaintStats.active + complaintStats.resolved > 0 ? (
                            // Showing recent complaints as activity
                            <div className="space-y-0">
                                {complaintStats.active > 0 && (
                                <ActivityRow 
                                        title={`${complaintStats.active} Pending Complaints`}
                                        date="Support active"
                                        type="complaint"
                                    />
                                )}
                                {complaintStats.resolved > 0 && (
                                    <ActivityRow 
                                        title={`${complaintStats.resolved} Solved`}
                                        date="Completed"
                                        type="complaint"
                                    />
                                )}
                                <ActivityRow 
                                    title="System Synced"
                                    date="All up to date"
                                    type="gatepass"
                                />
                            </div>
                        ) : (
                            <div className="p-10 text-center space-y-3">
                                <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center mx-auto">
                                    <Clock className="w-5 h-5 text-muted-foreground/50" />
                                </div>
                                <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Nothing here yet</p>
                            </div>
                        )}
                    </div>
                </Card>
                </div>
                <div className="space-y-6">
                    <Card className="premium-card bg-white p-7 border border-border/60 shadow-sm group hover:border-emerald-200 transition-all duration-300">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm">
                                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-[16px] font-bold text-foreground tracking-tight">Support</h3>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-none mt-1">Need a repair?</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-[13px] font-medium leading-relaxed text-left border-l-2 border-emerald-100 pl-4 py-1">
                                Need a fix or have a question? Our team is here to help you.
                            </p>
                            <Link to="/maintenance">
                                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-bold uppercase tracking-widest rounded-xl h-11 text-[11px] shadow-md shadow-emerald-600/10 active:scale-[0.98] gap-2">
                                    <MessageSquare className="h-3.5 w-3.5" /> Report Issue
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="premium-card p-7 bg-white border border-border/60 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
                        <div className="flex items-center gap-3 mb-6 relative">
                            <div className="w-1.5 h-6 bg-primary/30 rounded-full" />
                            <h3 className="text-[15px] font-bold text-foreground">Updates</h3>
                        </div>
                        <div className="space-y-5 relative">
                            <BulletinItem iconColor="bg-primary" title="Maintenance" description="Sunday repair schedule starting at 02:00 AM." />
                            <BulletinItem iconColor="bg-emerald-500" title="Summer Stay" description="Applications for vacation stay are now open." />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const BulletinItem = ({ iconColor, title, description }) => (
    <div className="p-4 rounded-xl bg-secondary/15 border border-border/40 hover:bg-secondary/20 transition-all group cursor-default">
        <div className="flex gap-4">
            <div className={`mt-1 w-2 h-2 rounded-full ${iconColor}/60 flex-shrink-0 animate-pulse`} />
            <div className="space-y-1">
                <p className="text-[13px] font-bold text-foreground leading-tight tracking-tight">{title}</p>
                <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

const StatsCard = ({ title, value, subtitle, icon: Icon, link, linkText }) => {
    return (
        <Card className="premium-card p-7 flex flex-col justify-between h-[210px] group bg-white hover:border-primary/30 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div className="p-3 rounded-2xl bg-secondary/40 text-primary border border-border/50 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <Icon className="h-5 w-5" />
                </div>
                <Link to={link}>
                    <Button variant="outline" size="sm" className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg border-border/60 transition-all active:scale-95 shadow-none">
                        {linkText}
                    </Button>
                </Link>
            </div>
            <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100 transition-opacity">{title}</p>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{value}</h3>
                    <p className="text-[11px] font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">{subtitle}</p>
                </div>
            </div>
        </Card>
    );
};

const ActivityRow = ({ title, date, type }) => (
    <div className="px-8 py-5 flex items-center justify-between hover:bg-secondary/20 transition-all cursor-default group">
        <div className="flex gap-5 items-center">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center border border-border/50 text-muted-foreground group-hover:text-primary transition-colors shadow-sm">
                {type === 'payment' && <CreditCard className="h-4.5 w-4.5" />}
                {type === 'complaint' && <AlertCircle className="h-4.5 w-4.5" />}
                {type === 'gatepass' && <FileText className="h-4.5 w-4.5" />}
            </div>
            <div className="space-y-0.5">
                <p className="text-[14px] font-bold text-foreground tracking-tight">{title}</p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{date}</p>
            </div>
        </div>
        <div className="p-2 rounded-lg bg-secondary/50 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
        </div>
    </div>
);

export default StudentDashboard;
