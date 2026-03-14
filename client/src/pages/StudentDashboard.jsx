import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { BedDouble, CreditCard, AlertCircle, ArrowRight, FileText, CheckCircle2 } from "lucide-react";
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
        <div className="space-y-10 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Welcome back, <span className="text-primary">{user?.name}</span>
                </h1>
                <p className="text-muted-foreground mt-1">Here's a quick overview of your hostel account.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Room Status" 
                    value={user?.roomNumber || "Not Allotted"} 
                    subtitle={user?.roomNumber ? "Allotment Active" : "Pending Allocation"}
                    icon={BedDouble}
                    color="primary"
                    link="/room-allotment"
                    linkText={user?.roomNumber ? "View Details" : "Book Room"}
                />
                <StatsCard 
                    title="Fee Status" 
                    value={user?.roomNumber ? "Paid" : "N/A"} 
                    subtitle={user?.roomNumber ? "Monthly cycle active" : "No booking history"}
                    icon={CreditCard}
                    color="green"
                    link="/payments"
                    linkText="Payment History"
                />
                <StatsCard 
                    title="Complaints" 
                    value={complaintStats.active} 
                    subtitle={`${complaintStats.resolved} Issues Resolved`}
                    icon={AlertCircle}
                    color="orange"
                    link="/complaints"
                    linkText="View Support"
                />
                <StatsCard 
                    title="Gate Pass" 
                    value="Active" 
                    subtitle="Last used: yesterday"
                    icon={FileText}
                    color="blue"
                    link="/gate-pass"
                    linkText="Apply New"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="apple-card lg:col-span-2 overflow-hidden border-none shadow-sm bg-white">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border">
                            {[
                                { title: "Room Payment Successful", date: "2 hours ago", type: "payment" },
                                { title: "Complaint #124 Resolved", date: "Yesterday", type: "complaint" },
                                { title: "Gate Pass Approved", date: "Oct 12, 2023", type: "gatepass" }
                            ].map((activity, i) => (
                                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                            {activity.type === 'payment' && <CreditCard className="h-4 w-4 text-blue-500" />}
                                            {activity.type === 'complaint' && <AlertCircle className="h-4 w-4 text-orange-500" />}
                                            {activity.type === 'gatepass' && <FileText className="h-4 w-4 text-green-500" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground/30" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="apple-card border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <BedDouble className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg">Need help with something?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                        <p className="text-primary-foreground/80 text-sm">
                            Our support team is available 24/7 for any hostel related queries or emergencies.
                        </p>
                        <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-12">
                            Contact Warden
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, subtitle, icon: Icon, color, link, linkText }) => {
    const colors = {
        primary: "text-blue-500 bg-blue-50",
        green: "text-green-500 bg-green-50",
        orange: "text-orange-500 bg-orange-50",
        blue: "text-indigo-500 bg-indigo-50",
    };

    return (
        <Card className="apple-card p-6 flex flex-col justify-between h-48 border-none shadow-sm bg-white">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${colors[color] || colors.primary}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <Link to={link}>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-tight text-muted-foreground hover:text-primary">
                        {linkText}
                    </Button>
                </Link>
            </div>
            <div>
                <h3 className="text-sm font-medium text-muted-foreground mt-4">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{subtitle}</p>
                </div>
            </div>
        </Card>
    );
};

export default StudentDashboard;
