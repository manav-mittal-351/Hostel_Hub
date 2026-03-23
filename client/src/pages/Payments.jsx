import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useEffect, useState, useMemo } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { CreditCard, IndianRupee, Clock, CheckCircle2, Printer, ArrowUpRight, Download, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const Payments = () => {
    const { user } = useContext(AuthContext);
    const [allRecords, setAllRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [isStatementOpen, setIsStatementOpen] = useState(false);

    const fetchAllData = async () => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            // Fetch both regular payments and non-disciplinary actions
            const [paymentsRes, actionsRes] = await Promise.all([
                axios.get("/api/payments/my-payments", config).catch(err => {
                    console.error("Payments API error:", err);
                    return { data: [] };
                }),
                axios.get("/api/non-disciplinary/my", config).catch(err => {
                    console.error("Non-disciplinary API error:", err);
                    return { data: [] };
                })
            ]);

            // Transform both to a unified format for the history table
            const payments = (paymentsRes.data || []).map(p => ({
                ...p,
                unifiedType: p.type?.replace('_', ' ') || 'GENERAL',
                isAction: false
            }));

            const actions = (actionsRes.data || []).map(a => ({
                ...a,
                unifiedType: a.actionType || 'EXTRA DUES',
                isAction: true,
            }));

            // Combine and sort by date (newest first)
            const combined = [...payments, ...actions].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            setAllRecords(combined);
        } catch (error) {
            console.error("Error fetching payment data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [user]);

    // Calculation Logic
    const totalPaid = useMemo(() => {
        return allRecords.reduce((acc, curr) => {
            const isPaid = curr.status?.toLowerCase() === 'paid' || curr.status?.toLowerCase() === 'resolved';
            return isPaid ? acc + (curr.amount || 0) : acc;
        }, 0);
    }, [allRecords]);

    const pendingDues = useMemo(() => {
        return allRecords.reduce((acc, curr) => {
            const isPending = ['pending', 'overdue'].includes(curr.status?.toLowerCase());
            return isPending ? acc + (curr.amount || 0) : acc;
        }, 0);
    }, [allRecords]);

    const filteredRecords = useMemo(() => {
        if (activeFilter === 'all') return allRecords;
        if (activeFilter === 'paid') {
            return allRecords.filter(r => r.status?.toLowerCase() === 'paid' || r.status?.toLowerCase() === 'resolved');
        }
        if (activeFilter === 'pending') {
            return allRecords.filter(r => ['pending', 'overdue'].includes(r.status?.toLowerCase()));
        }
        return allRecords;
    }, [allRecords, activeFilter]);

    const accountStatusValue = pendingDues === 0 ? "No Pending Dues" : "Dues Pending";
    const accountStatusSubtitle = pendingDues === 0 ? "Account Verified" : "Action Required";

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-2">
                <div>
                    <h1 className="section-title">Payments & Fees</h1>
                    <p className="section-subtitle">Track your hostel fees, payments, and dues easily.</p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsStatementOpen(true)}
                        className="h-10 px-5 text-[11px] font-bold uppercase tracking-widest border-border/60 bg-white hover:bg-secondary/50 rounded-xl flex items-center gap-2"
                    >
                        <Printer className="h-3.5 w-3.5" /> View Statement
                    </Button>
                    <Button className="btn-primary h-10 px-8 text-[11px] font-bold uppercase tracking-widest active:scale-95 shadow-lg shadow-primary/10">
                        Pay Now
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PaymentSummaryCard 
                    title="Total Paid" 
                    value={`₹${totalPaid.toLocaleString()}`} 
                    subtitle="Total amount paid so far"
                    icon={IndianRupee}
                />
                <PaymentSummaryCard 
                    title="Pending Dues" 
                    value={`₹${pendingDues.toLocaleString()}`} 
                    subtitle={pendingDues === 0 ? "Great job! All clear." : "Action required"}
                    icon={Clock}
                />
                <PaymentSummaryCard 
                    title="Account Status" 
                    value={accountStatusValue} 
                    subtitle={accountStatusSubtitle}
                    icon={CheckCircle2}
                />
            </div>

            <Card className="premium-card bg-white p-0 overflow-hidden border-border/60 shadow-sm">
                <CardHeader className="p-7 border-b border-border bg-secondary/5 flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-[17px] font-bold text-foreground">Payment History</CardTitle>
                        <CardDescription className="text-[12px] font-medium">View and filter your past transactions.</CardDescription>
                    </div>
                    <div className="flex bg-secondary/10 p-1 rounded-xl gap-1 border border-border/40">
                        {["all", "paid", "pending"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                                    activeFilter === filter
                                        ? "bg-white text-primary shadow-sm border border-border/40"
                                        : "text-foreground/50 hover:text-foreground hover:bg-white/50"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-secondary/10 border-b border-border/50">
                                <th className="px-7 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Transaction ID</th>
                                <th className="px-7 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-7 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Type</th>
                                <th className="px-7 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-7 py-4 text-right text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-7 py-6"><div className="h-8 bg-secondary/30 rounded-lg w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredRecords.length > 0 ? (
                                filteredRecords.map((record) => (
                                    <tr key={record._id} className="hover:bg-secondary/10 transition-colors group cursor-default">
                                        <td className="px-7 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-lg bg-secondary/50 text-primary border border-border/50">
                                                    <CreditCard className="h-3.5 w-3.5" />
                                                </div>
                                                <p className="text-[12px] font-mono text-foreground font-bold">#{record._id.slice(-10).toUpperCase()}</p>
                                            </div>
                                        </td>
                                        <td className="px-7 py-5">
                                            <p className="text-[13px] text-foreground/70 font-semibold leading-tight">{new Date(record.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </td>
                                        <td className="px-7 py-5">
                                            <Badge className="bg-secondary/40 text-muted-foreground border-border/50 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                                                {record.unifiedType}
                                            </Badge>
                                        </td>
                                        <td className="px-7 py-5">
                                            <p className="text-[15px] font-bold text-foreground">
                                                ₹{record.amount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-7 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border-none shadow-sm ${
                                                    record.status?.toLowerCase() === 'paid' || record.status?.toLowerCase() === 'resolved'
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'bg-amber-400 text-white'
                                                }`}>
                                                    {record.status}
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
                                        <div className="flex flex-col items-center justify-center space-y-4 opacity-60 grayscale items-center">
                                            <div className="p-5 rounded-full bg-secondary/40">
                                                <CreditCard className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[14px] font-bold text-foreground tracking-tight">No records found</p>
                                                <p className="text-[12px] text-foreground/60 font-medium">Try changing your filters or check back later.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={isStatementOpen} onOpenChange={setIsStatementOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none bg-background shadow-2xl">
                    <div id="statement-print-area" className="p-10 space-y-8 bg-white">
                        <DialogHeader className="border-b border-border pb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-foreground">Payment Statement</DialogTitle>
                                    <DialogDescription className="text-sm font-medium mt-1">
                                        Generated on {new Date().toLocaleDateString()} for {user?.name || "Student"}
                                    </DialogDescription>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-xl font-black tracking-tighter text-primary">HOSTEL<span className="text-foreground">HUB</span></h2>
                                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">Official Account Record</p>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-12 bg-secondary/10 p-8 rounded-2xl border border-border/60">
                            <div>
                                <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-[0.2em] mb-3">Total Account Summary</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-border/40">
                                        <span className="text-sm font-medium text-foreground/70">Total Fees Paid</span>
                                        <span className="text-lg font-bold text-emerald-600">₹{totalPaid.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-border/40">
                                        <span className="text-sm font-medium text-foreground/70">Outstanding Dues</span>
                                        <span className="text-lg font-bold text-amber-600">₹{pendingDues.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-[0.2em] mb-3">Student Details</p>
                                <div className="space-y-1.5">
                                    <p className="text-sm font-bold text-foreground">{user?.name}</p>
                                    <p className="text-xs font-medium text-foreground/60">{user?.email}</p>
                                    <p className="text-xs font-medium text-foreground/60">Student ID: {user?.studentId || "N/A"}</p>
                                    <p className="text-xs font-medium text-foreground/60">Room: {user?.roomNumber || "Not Assigned"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Transaction History</h3>
                            <div className="border border-border/60 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="bg-secondary/10 border-b border-border/60">
                                            <th className="px-5 py-3 font-bold text-foreground/60 uppercase tracking-wider">Date</th>
                                            <th className="px-5 py-3 font-bold text-foreground/60 uppercase tracking-wider">Type</th>
                                            <th className="px-5 py-3 font-bold text-foreground/60 uppercase tracking-wider">Description</th>
                                            <th className="px-5 py-3 font-bold text-foreground/60 uppercase tracking-wider">Amount</th>
                                            <th className="px-5 py-3 text-right font-bold text-foreground/60 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {allRecords.map((record) => (
                                            <tr key={record._id} className="hover:bg-secondary/5">
                                                <td className="px-5 py-3 font-medium">{new Date(record.createdAt).toLocaleDateString()}</td>
                                                <td className="px-5 py-3 font-bold uppercase tracking-tighter text-[10px]">{record.unifiedType}</td>
                                                <td className="px-5 py-3 text-foreground/70">{record.description || "No description provided"}</td>
                                                <td className="px-5 py-3 font-bold">₹{record.amount.toLocaleString()}</td>
                                                <td className="px-5 py-3 text-right">
                                                    <span className={`font-bold uppercase tracking-tighter text-[9px] ${
                                                        record.status?.toLowerCase() === 'paid' || record.status?.toLowerCase() === 'resolved'
                                                        ? 'text-emerald-600' : 'text-amber-600'
                                                    }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-border flex justify-between items-center opacity-40">
                            <p className="text-[9px] font-bold uppercase tracking-widest italic text-center">** This is a computer-generated document and needs no signature **</p>
                            <div className="h-10 w-10 border-2 border-primary/20 rounded-full flex items-center justify-center">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-secondary/5 border-t border-border flex justify-end gap-3 no-print">
                        <Button variant="outline" onClick={() => setIsStatementOpen(false)} className="text-[10px] font-bold uppercase tracking-widest px-6 rounded-xl border-border/60">
                            Close
                        </Button>
                        <Button onClick={handlePrint} className="btn-primary text-[10px] font-bold uppercase tracking-widest px-8 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2">
                            <Download className="h-3.5 w-3.5" /> Download / Print
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * { visibility: hidden; }
                    #statement-print-area, #statement-print-area * { visibility: visible; }
                    #statement-print-area { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .no-print { display: none !important; }
                }
            `}} />
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
                <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">{title}</p>
                <div className="flex items-baseline gap-2.5">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{value}</h3>
                    <p className="text-[11px] text-foreground/60 font-bold uppercase tracking-tighter">{subtitle}</p>
                </div>
            </div>
        </Card>
    );
};

export default Payments;
