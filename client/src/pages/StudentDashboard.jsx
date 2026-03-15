import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { BedDouble, CreditCard, AlertCircle, ArrowRight, FileText, CheckCircle2, ShieldCheck, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
        <div className="space-y-10 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-2">
                <div>
                    <h1 className="section-title">
                        Academic Workspace, <span className="text-primary">{user?.name}</span>
                    </h1>
                    <p className="section-subtitle">A comprehensive overview of your institutional residency and administrative status.</p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-border/60 px-4 py-2 rounded-xl shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Registry Live</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Residential Unit" 
                    value={user?.roomNumber || "Unassigned"} 
                    subtitle={user?.roomNumber ? "Active Allocation" : "Allocation Pending"}
                    icon={BedDouble}
                    link="/room-allotment"
                    linkText={user?.roomNumber ? "Inspect" : "Register"}
                />
                <StatsCard 
                    title="Financial Record" 
                    value={user?.roomNumber ? "Settled" : "N/A"} 
                    subtitle={user?.roomNumber ? "Billing cycle active" : "No active dues"}
                    icon={CreditCard}
                    link="/payments"
                    linkText="Ledger"
                />
                <StatsCard 
                    title="Active Petitions" 
                    value={complaintStats.active} 
                    subtitle={`${complaintStats.resolved} Records Archived`}
                    icon={AlertCircle}
                    link="/complaints"
                    linkText="Archive"
                />
                <StatsCard 
                    title="Exit Protocols" 
                    value="Authorized" 
                    subtitle="Valid synchronization"
                    icon={FileText}
                    link="/gate-pass"
                    linkText="Monitor"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="premium-card lg:col-span-2 overflow-hidden border-border bg-white p-0 shadow-sm">
                    <CardHeader className="p-7 border-b border-border bg-secondary/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-[17px] font-bold text-foreground">Operational Timeline</CardTitle>
                                <CardDescription className="text-[12px] font-medium">Historical audit of your recent institutional actions.</CardDescription>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-primary/50" />
                        </div>
                    </CardHeader>
                    <div className="divide-y divide-border/40">
                        {[
                            { title: "Financial Settlement Logged", date: "2 hours ago", type: "payment" },
                            { title: "Support Petition Resolved (#124)", date: "Yesterday", type: "complaint" },
                            { title: "Exit Authorization Synchronized", date: "Oct 12, 2023", type: "gatepass" }
                        ].map((activity, i) => (
                            <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-secondary/20 transition-all cursor-default group">
                                <div className="flex gap-5 items-center">
                                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center border border-border/50 text-muted-foreground group-hover:text-primary transition-colors shadow-sm">
                                        {activity.type === 'payment' && <CreditCard className="h-4.5 w-4.5" />}
                                        {activity.type === 'complaint' && <AlertCircle className="h-4.5 w-4.5" />}
                                        {activity.type === 'gatepass' && <FileText className="h-4.5 w-4.5" />}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[14px] font-bold text-foreground tracking-tight">{activity.title}</p>
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{activity.date}</p>
                                    </div>
                                </div>
                                <div className="p-2 rounded-lg bg-secondary/50 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="premium-card bg-white p-7 border border-border/60 shadow-sm group hover:border-emerald-200 transition-all duration-300">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm">
                                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-[16px] font-bold text-foreground tracking-tight">Institutional Support</h3>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-none mt-1">Direct Administrative Terminal</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-[13px] font-medium leading-relaxed text-left border-l-2 border-emerald-100 pl-4 py-1">
                                Our administrative team is available for residential queries, emergency maintenance, or protocol clarifications.
                            </p>
                            <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-bold uppercase tracking-widest rounded-xl h-11 text-[11px] shadow-md shadow-emerald-600/10 active:scale-[0.98] gap-2">
                                <MessageSquare className="h-3.5 w-3.5" /> Dispatch Request
                            </Button>
                        </div>
                    </Card>

                    <Card className="premium-card p-7 bg-white border border-border/60 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
                        <div className="flex items-center gap-3 mb-6 relative">
                            <div className="w-1.5 h-6 bg-primary/30 rounded-full" />
                            <h3 className="text-[15px] font-bold text-foreground">Bulletins</h3>
                        </div>
                        <div className="space-y-5 relative">
                            <div className="p-4 rounded-xl bg-secondary/15 border border-border/40 hover:bg-secondary/20 transition-all group cursor-default">
                                <div className="flex gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-primary/60 flex-shrink-0 animate-pulse" />
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-bold text-foreground leading-tight tracking-tight">Maintenance Schedule</p>
                                        <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">Infrastructure maintenance scheduled for Sunday, 02:00 IST.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/15 border border-border/40 hover:bg-secondary/20 transition-all group cursor-default">
                                <div className="flex gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500/60 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-bold text-foreground leading-tight tracking-tight">Seasonal Residency</p>
                                        <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">Registrations for interim seasonal residency are now accepting applications.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

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

export default StudentDashboard;
