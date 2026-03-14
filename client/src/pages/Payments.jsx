import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { CreditCard, IndianRupee, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const Payments = () => {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                if (!user?.token) return;
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get("http://localhost:5000/api/payments/my-payments", config);
                setPayments(data);
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchPayments();
        }
    }, [user]);

    const hostelFees = payments.filter(p => p.type === 'hostel_fee');
    const messFees = payments.filter(p => p.type === 'mess_fee');
    const fines = payments.filter(p => p.type === 'fine');

    const totalDues = payments.filter(p => p.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
    const lastPayment = payments.filter(p => p.status === 'paid').sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="h-28" />
            <div className="container mx-auto p-6 space-y-8 pt-4 max-w-7xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary/20 rounded-xl">
                        <IndianRupee className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground text-glow">Payments & Billing</h1>
                        <p className="text-muted-foreground">Manage your fees, dues, and transaction history.</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <StatsCard
                        title="Total Pending Dues"
                        value={`₹${totalDues}`}
                        icon={AlertCircle}
                        color={totalDues > 0 ? "text-red-500" : "text-green-500"}
                        bgColor={totalDues > 0 ? "bg-red-500/10" : "bg-green-500/10"}
                        borderColor={totalDues > 0 ? "border-red-500/20" : "border-green-500/20"}
                    />
                    <StatsCard
                        title="Last Payment"
                        value={`₹${lastPayment ? lastPayment.amount : 0}`}
                        subtext={lastPayment ? `${new Date(lastPayment.paymentDate).toLocaleDateString()}` : 'No history'}
                        icon={Clock}
                        color="text-primary"
                        bgColor="bg-primary/10"
                        borderColor="border-primary/20"
                    />
                    <StatsCard
                        title="Account Status"
                        value={totalDues > 0 ? 'Action Required' : 'Good Standing'}
                        icon={CheckCircle2}
                        color={totalDues > 0 ? "text-orange-500" : "text-green-500"}
                        bgColor={totalDues > 0 ? "bg-orange-500/10" : "bg-green-500/10"}
                        borderColor={totalDues > 0 ? "border-orange-500/20" : "border-green-500/20"}
                    />
                </div>

                {/* Transitions Tabs */}
                <Card className="glass-card border-white/5 mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="hostel-fee" className="w-full">
                            <TabsList className="bg-black/20 border border-white/5 mb-6">
                                <TabsTrigger value="hostel-fee" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Hostel Fee</TabsTrigger>
                                <TabsTrigger value="mess-fee" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Mess Fee</TabsTrigger>
                                <TabsTrigger value="fines" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">Fines</TabsTrigger>
                            </TabsList>

                            <PaymentList value="hostel-fee" data={hostelFees} emptyMsg="No hostel fee records found." />
                            <PaymentList value="mess-fee" data={messFees} emptyMsg="No mess fee records found." />
                            <PaymentList value="fines" data={fines} emptyMsg="No fines history found." type="fine" />
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, subtext, icon: Icon, color, bgColor, borderColor }) => (
    <Card className={`glass-card border ${borderColor} hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className={`text-2xl font-bold mt-2 ${color}`}>{value}</h3>
                    {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl ${bgColor} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const PaymentList = ({ value, data, emptyMsg, type }) => (
    <TabsContent value={value} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
        {data.length > 0 ? (
            <div className="space-y-3">
                {data.map(item => (
                    <div key={item._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${item.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                {item.status === 'paid' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{item.description || (type === 'fine' ? 'Disciplinary Fine' : 'Semester Fee')}</p>
                                <p className="text-sm text-muted-foreground">
                                    {type !== 'fine' ? `Due: ${new Date(item.dueDate).toLocaleDateString()}` : `Issued: ${new Date(item.createdAt).toLocaleDateString()}`}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">₹{item.amount}</p>
                            <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${item.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                                    item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-xl border border-white/5 border-dashed">
                <p>{emptyMsg}</p>
            </div>
        )}
    </TabsContent>
);

export default Payments;
