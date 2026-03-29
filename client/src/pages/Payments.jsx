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

import { useNotifications } from "@/context/NotificationContext";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

const Payments = () => {
    const { user } = useContext(AuthContext);
    const [allRecords, setAllRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [isStatementOpen, setIsStatementOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [payingId, setPayingId] = useState(null);
    const [processLoading, setProcessLoading] = useState(false);

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
                unifiedType: p.type?.replace('_', ' ') || 'FEES',
                isAction: false
            }));

            const actions = (actionsRes.data || []).map(a => ({
                ...a,
                unifiedType: a.actionType || 'DUE',
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
            const isPaid = curr.status?.toLowerCase() === 'paid';
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

    const accountStatusValue = pendingDues === 0 ? "All Clear" : "Pending Dues";
    const accountStatusSubtitle = pendingDues === 0 ? "Paid" : "Pending Dues";

    const generateReceipt = (record) => {
        try {
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(22);
            doc.setTextColor(59, 130, 246); // Primary Color
            doc.text("HOSTELHUB", 105, 30, { align: "center" });
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Official Payment Receipt", 105, 38, { align: "center" });
            
            // Decorative line
            doc.setDrawColor(230);
            doc.line(20, 45, 190, 45);
            
            // Content
            doc.setFontSize(12);
            doc.setTextColor(33);
            doc.setFont(undefined, 'bold');
            doc.text(`Receipt ID: #${record._id.toUpperCase()}`, 20, 60);
            
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            doc.text(`Transaction Date: ${new Date(record.createdAt).toLocaleDateString()}`, 20, 68);
            doc.text(`Student Name: ${user.name}`, 20, 76);
            doc.text(`Institutional ID: ${user.studentId || 'N/A'}`, 20, 84);
            
            // Details Box
            doc.setDrawColor(240);
            doc.setFillColor(249, 250, 251);
            doc.rect(20, 95, 170, 40, "FD");
            
            doc.setFont(undefined, 'bold');
            doc.text("Transaction Summary", 25, 105);
            doc.setFont(undefined, 'normal');
            
            doc.text(`Payment Type: ${record.unifiedType}`, 25, 115);
            doc.text(`Payment Method: Online Transfer`, 25, 123);
            doc.text(`Payment Status: ${record.status?.toLowerCase() === 'resolved' ? 'PAID' : record.status.toUpperCase()}`, 25, 130);
            
            // Final Amount
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(`Amount Paid: Rs. ${record.amount.toLocaleString()}`, 100, 155);
            
            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("Note: This is an electronically generated document. No signature required.", 105, 200, { align: "center" });
            doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 205, { align: "center" });
            
            // Save PDF
            doc.save(`receipt_${record._id.slice(-6)}.pdf`);
            toast.success("Receipt Generated", { description: "Your payment record has been saved to your device." });
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Generation Failed", { description: "Unable to create digital receipt." });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handlePay = async (record) => {
        if (!user?.token) return;
        setPayingId(record._id);
        setProcessLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const endpoint = record.isAction 
                ? `/api/non-disciplinary/${record._id}/pay` 
                : `/api/payments/${record._id}/pay`;
            
            await axios.put(endpoint, {}, config);
            
            toast.success("Transaction Securely Processed", {
                description: `₹${record.amount} payment confirmed for ${record.unifiedType}.`
            });
            
            // Refresh data
            fetchAllData();
            if (isPayModalOpen && payingId === record._id) {
                setPayingId(null);
            }
        } catch (error) {
            console.error("Payment failed", error);
            toast.error("Payment Interrupted", {
                description: error.response?.data?.message || "Verify your connection and try again."
            });
        } finally {
            setProcessLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/50 pb-4">
                <div>
                    <h1 className="section-title text-2xl sm:text-3xl">Payments & Fees</h1>
                    <p className="section-subtitle mb-0">Track your hostel fees, payments, and dues easily.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsStatementOpen(true)}
                        className="h-10 px-4 sm:px-5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border-border/60 bg-white hover:bg-secondary/50 rounded-xl flex items-center gap-2 flex-1 sm:flex-none justify-center"
                    >
                        <Printer className="h-3.5 w-3.5" /> Statement
                    </Button>
                    <Button 
                        className="btn-primary h-10 px-6 sm:px-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest active:scale-95 shadow-lg shadow-primary/10 flex-1 sm:flex-none justify-center"
                        onClick={() => setIsPayModalOpen(true)}
                        disabled={pendingDues === 0}
                    >
                        Pay Now
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <PaymentSummaryCard 
                    title="Total Paid" 
                    value={`₹${totalPaid.toLocaleString()}`} 
                    subtitle="All time"
                    icon={IndianRupee}
                />
                <PaymentSummaryCard 
                    title="Pending Dues" 
                    value={`₹${pendingDues.toLocaleString()}`} 
                    subtitle={pendingDues === 0 ? "Great job! All clear." : "Pending Dues"}
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
                <CardHeader className="p-5 sm:p-7 border-b border-border bg-secondary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:space-y-0">
                    <div>
                        <CardTitle className="text-[17px] font-bold text-foreground">Transaction History</CardTitle>
                        <CardDescription className="text-[12px] font-medium">Track your recent payments.</CardDescription>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] pr-1">Filter Status</p>
                        <div className="flex bg-secondary/10 p-1 rounded-xl gap-1 border border-border/40 w-full sm:w-auto overflow-x-auto no-scrollbar">
                            {["all", "paid", "pending"].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`flex-1 sm:flex-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all min-w-max ${
                                        activeFilter === filter
                                            ? "bg-white text-primary shadow-sm border border-border/40"
                                            : "text-foreground/50 hover:text-foreground hover:bg-white/50"
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto w-full custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-secondary/10 border-b border-border/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Transaction ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-6"><div className="h-8 bg-secondary/30 rounded-lg w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredRecords.length > 0 ? (
                                filteredRecords.map((record) => (
                                    <tr key={record._id} className="hover:bg-secondary/10 transition-colors group cursor-default border-b border-border/20 last:border-none">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-lg bg-secondary/50 text-primary border border-border/50 shadow-sm">
                                                    <CreditCard className="h-3.5 w-3.5" />
                                                </div>
                                                <p className="text-[12px] font-mono text-foreground font-bold">#{record._id.slice(-10).toUpperCase()}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[13px] text-foreground/70 font-semibold leading-tight">{new Date(record.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge className="bg-secondary/60 text-muted-foreground border-border/50 text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md">
                                                {record.unifiedType}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[15px] font-bold text-foreground">
                                                ₹{record.amount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border-none shadow-sm ${
                                                    record.status?.toLowerCase() === 'paid' || record.status?.toLowerCase() === 'resolved'
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'bg-amber-400 text-white'
                                                }`}>
                                                    {record.status?.toLowerCase() === 'resolved' ? 'Paid' : record.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => {
                                                    setSelectedReceipt(record);
                                                    setIsReceiptOpen(true);
                                                }}
                                                className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all rounded-lg inline-flex items-center justify-center gap-2 bg-secondary/20 hover:bg-secondary/40"
                                            >
                                                <Printer className="h-3 w-3" /> Receipt
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="border-none">
                                    <td colSpan="6" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4 opacity-60 grayscale">
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
                                    <DialogTitle className="text-2xl font-bold text-foreground">Statement</DialogTitle>
                                    <DialogDescription className="text-sm font-medium mt-1">
                                        As of {new Date().toLocaleDateString()} for {user?.name || "Student"}
                                    </DialogDescription>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-xl font-black tracking-tighter text-primary">HOSTEL<span className="text-foreground">HUB</span></h2>
                                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">Official Statement</p>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-12 bg-secondary/10 p-8 rounded-2xl border border-border/60">
                            <div>
                                <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-[0.2em] mb-3">Summary</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-border/40">
                                        <span className="text-sm font-medium text-foreground/70">Paid</span>
                                        <span className="text-lg font-bold text-emerald-600">₹{totalPaid.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-border/40">
                                        <span className="text-sm font-medium text-foreground/70">Pending</span>
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
                                    <p className="text-xs font-medium text-foreground/60">Room: {user?.roomNumber || "No Room"}</p>
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
                                                        {record.status?.toLowerCase() === 'resolved' ? 'Paid' : record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-border flex justify-between items-center opacity-40">
                            <p className="text-[9px] font-bold uppercase tracking-widest italic text-center">Generated automatically.</p>
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

            <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
                <DialogContent className="max-w-xl p-0 border-none bg-white shadow-2xl rounded-3xl overflow-hidden">
                    {selectedReceipt && (
                        <>
                            <div className="p-10 space-y-8 bg-white">
                                <div className="flex justify-between items-start text-foreground">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Digital Receipt</p>
                                        </div>
                                        <h2 className="text-2xl font-black tracking-tight uppercase">TRANSACTION SUCCESS</h2>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-xl font-black tracking-tighter text-primary">HOSTEL<span className="text-foreground">HUB</span></h2>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Institutional Record</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-dashed border-border/60">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">Issued To</p>
                                            <p className="text-sm font-bold text-foreground">{user?.name}</p>
                                            <p className="text-xs font-medium text-muted-foreground">{user?.studentId || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">Transaction Date</p>
                                            <p className="text-sm font-bold text-foreground">{new Date(selectedReceipt.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-right">
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">Reference ID</p>
                                            <p className="text-sm font-mono font-bold text-foreground truncate">#{selectedReceipt._id.toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">Fee Type</p>
                                            <p className="text-sm font-bold text-foreground capitalize">{selectedReceipt.unifiedType}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-6 bg-secondary/10 rounded-2xl border border-border/40">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Total Amount</p>
                                        <p className="text-3xl font-black text-foreground tracking-tighter">₹{selectedReceipt.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <Badge className="bg-emerald-500 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                            {selectedReceipt.status?.toLowerCase() === 'resolved' ? 'Paid' : selectedReceipt.status}
                                        </Badge>
                                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Transaction Verified</p>
                                    </div>
                                </div>

                                <div className="text-center opacity-40">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-foreground">Institutional Digital Document — HostelHub</p>
                                </div>
                            </div>
                            <div className="p-6 bg-secondary/5 border-t border-border flex justify-end gap-3 no-print">
                                <Button variant="outline" onClick={() => setIsReceiptOpen(false)} className="rounded-xl px-6 h-12 text-[10px] font-bold uppercase tracking-widest border-border/80">
                                    Close
                                </Button>
                                <Button onClick={() => generateReceipt(selectedReceipt)} className="btn-primary rounded-xl px-8 h-12 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20">
                                    <Download className="h-4 w-4" /> Save Receipt
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
                <DialogContent className="max-w-md p-0 border-none bg-white shadow-2xl rounded-3xl overflow-hidden">
                    <div className="p-10 space-y-8">
                        <div className="text-center space-y-2">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                                <IndianRupee className="w-7 h-7" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight mt-6">Secure Payment Portal</h2>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">Complete your outstanding dues</p>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto space-y-3 custom-scrollbar pr-2">
                            {allRecords.filter(r => ['pending', 'overdue'].includes(r.status?.toLowerCase())).map(record => (
                                <div key={`pay-${record._id}`} className="flex items-center justify-between p-4 bg-secondary/10 rounded-2xl border border-border/40 group hover:border-primary/30 transition-all">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-foreground leading-tight">{record.unifiedType}</p>
                                        <p className="text-[9px] text-muted-foreground font-medium">{new Date(record.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm font-bold text-foreground">₹{record.amount}</p>
                                        <Button 
                                            size="sm" 
                                            onClick={() => handlePay(record)}
                                            disabled={processLoading}
                                            className="h-9 px-6 text-[10px] font-bold uppercase tracking-widest bg-primary text-white hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/10"
                                        >
                                            {processLoading && payingId === record._id ? "Processing..." : "Pay Now"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {pendingDues === 0 && (
                                <div className="text-center py-10 opacity-40">
                                    <CheckCircle2 className="h-10 w-10 mx-auto mb-3" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Everything is clear!</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-dashed border-border flex justify-between items-center bg-secondary/5 -mx-10 px-10 pb-10">
                            <div>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none mb-1">Total Outstanding</p>
                                <p className="text-3xl font-black text-foreground tracking-tighter">₹{pendingDues.toLocaleString()}</p>
                            </div>
                            <Button variant="outline" onClick={() => setIsPayModalOpen(false)} className="rounded-xl px-6 h-12 text-[10px] font-bold uppercase tracking-widest border-border/80">
                                Dismiss
                            </Button>
                        </div>
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
