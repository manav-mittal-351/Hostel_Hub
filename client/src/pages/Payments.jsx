import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { CreditCard, DollarSign, Clock, CheckCircle2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const Payments = () => {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get("http://localhost:5000/api/rooms/payments/my", config);
                setPayments(data);
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [user]);

    const totalPaid = payments.filter(p => p.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Transactions & <span className="text-primary">Billing</span></h1>
                    <p className="text-muted-foreground mt-1">Monitor your payment history and current dues.</p>
                </div>
                <Button className="rounded-xl h-11 px-6 font-bold shadow-none">
                    Make New Payment
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PaymentSummaryCard 
                    title="Total Paid" 
                    value={`₹${totalPaid.toLocaleString()}`} 
                    subtitle="Cumulative amount"
                    icon={DollarSign}
                    color="primary"
                />
                <PaymentSummaryCard 
                    title="Pending Dues" 
                    value="₹0.00" 
                    subtitle="Up to date"
                    icon={Clock}
                    color="orange"
                />
                <PaymentSummaryCard 
                    title="Account Status" 
                    value="Active" 
                    subtitle="Monthly cycle active"
                    icon={CheckCircle2}
                    color="green"
                />
            </div>

            <Card className="apple-card border-none bg-white shadow-sm overflow-hidden">
                <CardHeader className="border-b border-muted/50 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Recent Transactions</CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs font-bold text-primary gap-2">
                            <Printer className="h-4 w-4" /> Download Statement
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/30 text-left">
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Transaction ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="5" className="px-6 py-8"><div className="h-4 bg-muted rounded w-full"></div></td>
                                        </tr>
                                    ))
                                ) : payments.length > 0 ? (
                                    payments.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-mono text-foreground">#{payment._id.slice(-8).toUpperCase()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-foreground">{new Date(payment.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-foreground uppercase">{payment.paymentType.replace('_', ' ')}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-black text-foreground italic flex items-center gap-1">
                                                    ₹{payment.amount.toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    payment.status === 'completed' 
                                                    ? 'bg-green-50 text-green-600' 
                                                    : 'bg-orange-50 text-orange-600'
                                                }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-muted-foreground opacity-50">
                                            <CreditCard className="h-10 w-10 mx-auto mb-2" />
                                            <p className="text-sm font-bold">No payment history found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const PaymentSummaryCard = ({ title, value, subtitle, icon: Icon, color }) => {
    const colors = {
        primary: "bg-blue-50 text-blue-500",
        orange: "bg-orange-50 text-orange-500",
        green: "bg-green-50 text-green-500",
    };

    return (
        <Card className="apple-card border-none bg-white p-6 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${colors[color] || colors.primary}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-foreground">{value}</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">{subtitle}</p>
                </div>
            </div>
        </Card>
    );
};

export default Payments;
