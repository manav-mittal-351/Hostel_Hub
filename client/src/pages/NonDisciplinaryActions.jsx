import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
    Plus, 
    Search, 
    Filter, 
    Trash2, 
    CheckCircle, 
    Clock, 
    AlertCircle, 
    IndianRupee, 
    FileText, 
    MoreHorizontal,
    User as UserIcon,
    History,
    TrendingUp,
    ShieldAlert,
    UserCheck,
    Contact,
    Building,
    Hash,
    ShieldCheck,
    FileWarning,
    AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from "@/components/ConfirmationModal";

const NonDisciplinaryActions = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        studentId: "",
        actionType: "Notice",
        description: "",
        amount: "0",
        status: "Pending"
    });

    useEffect(() => {
        fetchRecords();
    }, [user]);

    const fetchRecords = async () => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const endpoint = (user.role === 'admin' || user.role === 'warden') ? '/api/non-disciplinary' : '/api/non-disciplinary/my';
            const { data } = await axios.get(endpoint, config);
            setRecords(data);
        } catch (error) {
            console.error("Error fetching records:", error);
            toast.error("Failed to load records from registry.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post("/api/non-disciplinary", formData, config);
            setRecords([data, ...records]);
            setIsAddModalOpen(false);
            setFormData({ studentId: "", actionType: "Damage", description: "", amount: "", status: "Pending" });
            toast.success("Institutional record authorized successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to authorize record");
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`/api/non-disciplinary/${id}`, { status: newStatus }, config);
            setRecords(records.map(r => r._id === id ? data : r));
            toast.success(`Compliance status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update compliance status");
        }
    };

    const confirmDelete = (id) => {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!recordToDelete) return;
        setDeleteLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/non-disciplinary/${recordToDelete}`, config);
            setRecords(records.filter(r => r._id !== recordToDelete));
            toast.success("Record permanently removed from registry");
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Failed to delete record from database");
        } finally {
            setDeleteLoading(false);
            setRecordToDelete(null);
        }
    };

    const filteredRecords = records.filter(record => {
        const matchesSearch = 
            record.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === "All" || record.status === filterStatus;
        
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: records.length,
        activeNotices: records.filter(r => r.actionType === 'Notice' && r.status === 'Pending').length,
        damageReports: records.filter(r => r.actionType === 'Damage').length,
        administrativeNotes: records.filter(r => r.actionType === 'Remark').length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="section-title">Student Records</h1>
                    <p className="section-subtitle">Comprehensive administrative summary and institutional history log.</p>
                </div>
                <ConfirmationModal 
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                    title="Authorize Record Deletion?"
                    description="This will permanently nullify this administrative record from the student's institutional history. This action is audited."
                    onConfirm={handleDelete}
                    confirmText="Delete Record"
                    cancelText="Cancel"
                    loading={deleteLoading}
                    variant="destructive"
                />
                {(user?.role === 'admin' || user?.role === 'warden') && (
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-primary h-11 px-8 font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 active:scale-95 shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4" /> Log Administrative Action
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-none rounded-2xl p-0 overflow-hidden shadow-2xl max-w-md">
                            <DialogHeader className="p-7 bg-secondary/30 border-b border-border">
                                <DialogTitle className="text-lg font-bold tracking-tight text-foreground">Record Authorization</DialogTitle>
                                <DialogDescription className="text-[12px] font-medium text-muted-foreground">Document a permanent administrative event in the resident's registry.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="p-7 space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Student ID (M-ID)</Label>
                                    <Input 
                                        className="h-11 font-medium bg-secondary/10 border-border/40 focus:bg-white rounded-xl"
                                        placeholder="Enter student code..."
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Event Type</Label>
                                        <select 
                                            className="w-full h-11 rounded-xl px-4 text-[13px] font-bold bg-secondary/10 border border-border/40 outline-none transition-all focus:bg-white appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%20xmlns%3D%220%200%2010%206%22%3E%3Cpath%20d%3D%22M1%201L5%205L9%201%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:10px] bg-[right_1rem_center] bg-no-repeat"
                                            value={formData.actionType}
                                            onChange={(e) => setFormData({...formData, actionType: e.target.value})}
                                        >
                                            <option value="Notice">Official Notice</option>
                                            <option value="Damage">Damage Report</option>
                                            <option value="Penalty">Penalty Citation</option>
                                            <option value="Remark">Admin Remark</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Charge Ref (₹)</Label>
                                        <Input 
                                            type="number"
                                            className="h-11 font-medium bg-secondary/10 border-border/40 focus:bg-white rounded-xl"
                                            placeholder="0"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Record Narration</Label>
                                    <textarea 
                                        className="w-full h-24 rounded-xl p-4 text-[13px] bg-secondary/10 border border-border/40 outline-none transition-all focus:bg-white resize-none font-medium"
                                        placeholder="Describe the incident or record details..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full btn-primary h-12 font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/10 rounded-xl active:scale-95 transition-all">
                                    Log Record
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </header>

            {/* Resident Context Header - Minimal & Institutional */}
            {user?.role !== 'admin' && (
                <div className="flex items-center justify-between bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 mb-8 animate-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-border flex items-center justify-center">
                            <Hash className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-foreground">Registry Session: {user.name}</h2>
                            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">Hostel Unit: {user.roomNumber ? `Station #${user.roomNumber}` : 'Allocation Pending'}</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-0.5">Warden Assigned</p>
                            <p className="text-[12px] font-bold text-foreground">Dr. Robert Miller</p>
                        </div>
                        <div className="h-8 w-px bg-border/60" />
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-0.5">Security Status</p>
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-2 py-0 text-[9px] font-bold uppercase">Clearance Level 1</Badge>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DuesStatsCard 
                    title="Total Records" 
                    value={stats.total} 
                    icon={FileText} 
                    color="primary"
                    subtitle="Lifetime Logs"
                />
                <DuesStatsCard 
                    title="Active Notices" 
                    value={stats.activeNotices} 
                    icon={AlertTriangle} 
                    color="primary"
                    subtitle="Require Attention"
                />
                <DuesStatsCard 
                    title="Damage Reports" 
                    value={stats.damageReports} 
                    icon={FileWarning} 
                    color="primary"
                    subtitle="Incident History"
                />
                <DuesStatsCard 
                    title="Admin Remarks" 
                    value={stats.administrativeNotes} 
                    icon={ShieldAlert} 
                    color="primary"
                    subtitle="Institutional Notes"
                />
            </div>

            {/* Main Content Area */}
            <Card className="premium-card bg-white overflow-hidden p-0 border-border/60 shadow-xl shadow-primary/5">
                <CardHeader className="p-7 border-b border-border bg-secondary/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <History className="w-4 h-4 text-primary" />
                                <CardTitle className="text-[16px] font-bold text-foreground">Chronological Log</CardTitle>
                            </div>
                            <CardDescription className="text-[12px] font-medium text-muted-foreground">Historical sequence of all administrative interactions.</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                                <Input 
                                    placeholder="Filter records..."
                                    className="pl-9 h-10 w-64 text-[12px] bg-white border-border/40 focus:bg-white rounded-xl font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/40 bg-secondary/10">
                                <th className="px-7 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] w-1/5">Timeline Date</th>
                                <th className="px-7 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] w-1/5">Event Category</th>
                                <th className="px-7 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] w-1/3">Record Narrative</th>
                                <th className="px-7 py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Record Status</th>
                                {(user?.role === 'admin' || user?.role === 'warden') && <th className="px-7 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Compliance</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="p-7">
                                            <div className="h-10 bg-secondary/30 rounded-lg w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-24 text-center text-muted-foreground/30 grayscale opacity-40">
                                        <div className="flex flex-col items-center gap-5">
                                            <div className="p-6 rounded-full bg-secondary/20">
                                                <ShieldCheck className="w-14 h-14 stroke-[1.2]" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[12px] font-bold uppercase tracking-widest text-foreground/50">Registry Vacant</p>
                                                <p className="text-[10px] font-medium tracking-wide">No administrative records found for this resident.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record._id} className="hover:bg-secondary/5 transition-colors group border-b border-border/40 last:border-0 text-foreground">
                                        <td className="px-7 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                                <div className="space-y-0.5">
                                                    <p className="text-[13px] font-bold">{new Date(record.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                                        {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-7 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl border ${
                                                    record.actionType === 'Damage' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    record.actionType === 'Penalty' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    record.actionType === 'Notice' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    'bg-secondary/40 text-primary border-border/40'
                                                }`}>
                                                    {record.actionType === 'Damage' ? <FileWarning className="w-3.5 h-3.5" /> : 
                                                     record.actionType === 'Penalty' ? <AlertCircle className="w-3.5 h-3.5" /> : 
                                                     record.actionType === 'Notice' ? <ShieldAlert className="w-3.5 h-3.5" /> :
                                                     <FileText className="w-3.5 h-3.5" />}
                                                </div>
                                                <p className="text-[12px] font-extrabold uppercase tracking-tight text-foreground/80">{record.actionType}</p>
                                            </div>
                                        </td>
                                        <td className="px-7 py-6">
                                            <div className="space-y-2">
                                                <p className="text-[13px] text-muted-foreground font-medium italic leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">"{record.description}"</p>
                                                
                                                {record.createdBy && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="h-5 w-5 rounded-full bg-secondary/50 flex items-center justify-center border border-border/40">
                                                            <Contact className="w-2.5 h-2.5 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">
                                                            Logged by: <span className="text-foreground/80">{record.createdBy.name}</span> 
                                                            <span className="ml-1.5 px-1.5 py-0.5 bg-secondary/30 rounded text-[8px] border border-border/20">{record.createdBy.role}</span>
                                                        </p>
                                                    </div>
                                                )}

                                                {record.amount > 0 && (
                                                    <div className="flex flex-col gap-1.5">
                                                        <p className="text-[14px] font-bold text-foreground">
                                                            Institutional Charge: <span className="text-primary">₹{record.amount.toLocaleString()}</span>
                                                        </p>
                                                        {record.status === 'Pending' && (
                                                            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-[0.1em] flex items-center gap-1.5 bg-amber-50 w-fit px-2.5 py-1 rounded-lg border border-amber-100">
                                                               <IndianRupee className="w-2.5 h-2.5" /> Payment Pending — See Payments Page
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-7 py-6 text-center">
                                            <Badge className={`px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest border-none shadow-sm ${
                                                record.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                                                record.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                                                'bg-secondary text-muted-foreground'
                                            }`}>
                                                {record.status === 'Pending' ? 'Active Citation' : 
                                                 record.status === 'Paid' ? 'Audited' : 'Archived'}
                                            </Badge>
                                        </td>
                                        {(user?.role === 'admin' || user?.role === 'warden') && (
                                            <td className="px-7 py-5">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    {record.status === 'Pending' && (
                                                        <Button 
                                                            size="sm" 
                                                            onClick={() => handleUpdateStatus(record._id, 'Paid')}
                                                            className="bg-secondary/80 hover:bg-primary text-foreground hover:text-white h-8 px-3 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all"
                                                        >
                                                            Verify
                                                        </Button>
                                                    )}
                                                    {record.status === 'Paid' && (
                                                        <Button 
                                                            size="sm" 
                                                            onClick={() => handleUpdateStatus(record._id, 'Resolved')}
                                                            className="bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-100 h-8 px-3 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all"
                                                        >
                                                            Archive
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg"
                                                        onClick={() => confirmDelete(record._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const DuesStatsCard = ({ title, value, icon: Icon, subtitle }) => {
    return (
        <Card className="premium-card bg-white p-6 group shadow-lg shadow-primary/5 hover:bg-primary/[0.01] transition-all border-border/40">
            <div className="flex justify-between items-center mb-4">
                <div className="p-3 rounded-2xl bg-secondary/30 text-primary border border-primary/5 group-hover:scale-110 transition-transform shadow-sm">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-80">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-foreground tracking-tighter">{value}</h3>
                    <p className="text-[10px] font-medium text-muted-foreground/50 truncate">{subtitle}</p>
                </div>
            </div>
        </Card>
    );
};

export default NonDisciplinaryActions;
