import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { CreditCard, IndianRupee, Clock, CheckCircle2, Printer, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Payments = () => {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            if (!user?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get("/api/payments/my-payments", config);
                setPayments(data);
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [user]);

    const totalPaid = payments.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-2">
                <div>
                    <h1 className="section-title">Institutional Billing</h1>
                    <p className="section-subtitle">Comprehensive tracking of your financial commitments and transaction status.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-10 px-5 text-[11px] font-bold uppercase tracking-widest border-border/60 bg-white hover:bg-secondary/50 rounded-xl flex items-center gap-2">
                        <Printer className="h-3.5 w-3.5" /> Statement
                    </Button>
                    <Button className="btn-primary h-10 px-8 text-[11px] font-bold uppercase tracking-widest active:scale-95 shadow-lg shadow-primary/10">
                        Initiate Payment
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PaymentSummaryCard 
                    title="Settled Capital" 
                    value={`₹${totalPaid.toLocaleString()}`} 
                    subtitle="Lifetime processed"
                    icon={IndianRupee}
                />
                <PaymentSummaryCard 
                    title="Interim Arrears" 
                    value="₹0.00" 
                    subtitle="Registry status: Clear"
                    icon={Clock}
                />
                <PaymentSummaryCard 
                    title="Account Identity" 
                    value="Authenticated" 
                    subtitle="Secure payment protocol"
                    icon={CheckCircle2}
                />
            </div>

            <Card className="premium-card bg-white p-0 overflow-hidden border-border/60 shadow-sm">
                <CardHeader className="p-7 border-b border-border bg-secondary/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-[17px] font-bold text-foreground">Transaction Registry</CardTitle>
                            <CardDescription className="text-[12px] font-medium">Historical data of all institutional financial exchanges.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-secondary/10 border-b border-border/50">
                                <th className="px-7 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Transaction Trace</th>
                                <th className="px-7 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Temporal Data</th>
                                <th className="px-7 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Classification</th>
                                <th className="px-7 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Valuation</th>
                                <th className="px-7 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Compliance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-7 py-6"><div className="h-8 bg-secondary/30 rounded-lg w-full"></div></td>
                                    </tr>
                                ))
                            ) : payments.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-secondary/10 transition-colors group cursor-default">
                                        <td className="px-7 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-lg bg-secondary/50 text-primary border border-border/50">
                                                    <CreditCard className="h-3.5 w-3.5" />
                                                </div>
                                                <p className="text-[12px] font-mono text-foreground font-bold opacity-80">#{payment._id.slice(-10).toUpperCase()}</p>
                                            </div>
                                        </td>
                                        <td className="px-7 py-5">
                                            <p className="text-[13px] text-muted-foreground font-semibold leading-tight">{new Date(payment.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </td>
                                        <td className="px-7 py-5">
                                            <Badge className="bg-secondary/40 text-muted-foreground border-border/50 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                                                {payment.type?.replace('_', ' ') || 'GENERAL'}
                                            </Badge>
                                        </td>
                                        <td className="px-7 py-5">
                                            <p className="text-[15px] font-bold text-foreground">
                                                ₹{payment.amount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-7 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border-none shadow-sm ${
                                                    payment.status === 'paid' 
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'bg-amber-400 text-white'
                                                }`}>
                                                    {payment.status}
                                                </span>
                                                <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-center gap-2">
                                                    <Printer className="h-3 w-3" /> Receipt
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-7 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4 opacity-30 grayscale items-center">
                                            <div className="p-5 rounded-full bg-secondary/40">
                                                <CreditCard className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[14px] font-bold text-foreground tracking-tight">Registry Trace Empty</p>
                                                <p className="text-[12px] text-muted-foreground font-medium">No recorded transactions were found in your sector.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const PaymentSummaryCard = ({ title, value, subtitle, icon: Icon }) => {
    return (
        <Card className="premium-card p-7 bg-white group hover:border-primary/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-5">
                <div className="p-3 rounded-2xl bg-secondary/40 text-primary border border-border/50 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-70">{title}</p>
                <div className="flex items-baseline gap-2.5">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{value}</h3>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-tighter opacity-50">{subtitle}</p>
                </div>
            </div>
        </Card>
    );
};

export default Payments;
