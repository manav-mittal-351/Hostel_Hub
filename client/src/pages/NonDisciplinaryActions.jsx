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
    ShieldAlert
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

const NonDisciplinaryActions = () => {
    const { user } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        studentId: "",
        actionType: "Damage",
        description: "",
        amount: "",
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
            const endpoint = user.role === 'admin' ? '/api/non-disciplinary' : '/api/non-disciplinary/my';
            const { data } = await axios.get(`http://localhost:5000${endpoint}`, config);
            setRecords(data);
        } catch (error) {
            console.error("Error fetching records:", error);
            toast.error("Failed to load records");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post("http://localhost:5000/api/non-disciplinary", formData, config);
            setRecords([data, ...records]);
            setIsAddModalOpen(false);
            setFormData({ studentId: "", actionType: "Damage", description: "", amount: "", status: "Pending" });
            toast.success("Record added successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add record");
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://localhost:5000/api/non-disciplinary/${id}`, { status: newStatus }, config);
            setRecords(records.map(r => r._id === id ? data : r));
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this record?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/non-disciplinary/${id}`, config);
            setRecords(records.filter(r => r._id !== id));
            toast.success("Record deleted");
        } catch (error) {
            toast.error("Failed to delete record");
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
        pendingAmount: records.reduce((acc, r) => r.status === 'Pending' ? acc + r.amount : acc, 0),
        resolved: records.filter(r => r.status === 'Resolved' || r.status === 'Paid').length
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
                        Financial <span className="text-primary">Dues</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage extra charges and administrative records.</p>
                </div>
                {user?.role === 'admin' && (
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-black text-white px-6 h-12 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all">
                                <Plus className="w-5 h-5" /> New Record
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-none rounded-[2rem] p-8 max-w-md shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold tracking-tight">Administrative Action</DialogTitle>
                                <DialogDescription>Register a new financial obligation for a resident.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-6 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Student MongoDB ID</Label>
                                    <Input 
                                        className="bg-[#F5F5F7] border-none rounded-xl h-12 focus:ring-2 focus:ring-primary/20"
                                        placeholder="Enter student's database ID"
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type</Label>
                                        <select 
                                            className="w-full h-12 rounded-xl bg-[#F5F5F7] border-none px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                                            value={formData.actionType}
                                            onChange={(e) => setFormData({...formData, actionType: e.target.value})}
                                        >
                                            <option value="Damage">Damage</option>
                                            <option value="Late Payment">Late Payment</option>
                                            <option value="Extra Service">Extra Service</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount (₹)</Label>
                                        <Input 
                                            type="number"
                                            className="bg-[#F5F5F7] border-none rounded-xl h-12 focus:ring-2 focus:ring-primary/20"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reason</Label>
                                    <textarea 
                                        className="w-full h-24 rounded-xl bg-[#F5F5F7] border-none p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        placeholder="Provide context for this charge..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full bg-[#1D1D1F] hover:bg-black h-12 rounded-xl font-bold shadow-xl shadow-black/10">
                                        Authorize Charge
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DuesStatsCard 
                    title="Active Logs" 
                    value={stats.total} 
                    icon={History} 
                    color="blue"
                />
                <DuesStatsCard 
                    title="Outstanding" 
                    value={`₹${stats.pendingAmount.toLocaleString()}`} 
                    icon={IndianRupee} 
                    color="orange"
                />
                <DuesStatsCard 
                    title="Settled" 
                    value={stats.resolved} 
                    icon={CheckCircle} 
                    color="green"
                />
            </div>

            {/* Main Content Area */}
            <Card className="apple-card border-none bg-white shadow-sm overflow-hidden">
                <CardHeader className="p-8 border-b border-[#F5F5F7]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <CardTitle className="text-xl font-bold text-[#1D1D1F]">Activity Registry</CardTitle>
                            <CardDescription>Comprehensive log of all administrative financial actions.</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search student..."
                                    className="pl-10 h-10 w-48 lg:w-64 bg-[#F5F5F7] border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select 
                                className="h-10 rounded-xl bg-[#F5F5F7] border-none px-4 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#FBFBFD] border-b border-[#F5F5F7]">
                                    <th className="p-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Resident Details</th>
                                    <th className="p-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Type & Reason</th>
                                    <th className="p-6 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fee (₹)</th>
                                    <th className="p-6 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                    {user?.role === 'admin' && <th className="p-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F5F5F7]">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="5" className="p-8">
                                                <div className="h-12 bg-muted/20 rounded-2xl w-full" />
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-30">
                                                <ShieldAlert className="w-12 h-12" />
                                                <p className="text-sm font-bold uppercase tracking-widest">No entries found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRecords.map((record) => (
                                        <tr key={record._id} className="hover:bg-[#FBFBFD] transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                        <UserIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#1D1D1F]">{record.student?.name || "Anonymous"}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Room {record.student?.roomNumber || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-tighter">{record.actionType}</p>
                                                    <p className="text-sm text-[#86868B] italic leading-tight line-clamp-1 group-hover:line-clamp-none transition-all">"{record.description}"</p>
                                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{new Date(record.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className="text-lg font-black italic text-[#1D1D1F]">₹{record.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <Badge className={`
                                                    px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-none
                                                    ${record.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 
                                                      record.status === 'Paid' ? 'bg-blue-50 text-blue-600' :
                                                      'bg-green-50 text-green-600'}
                                                `}>
                                                    {record.status}
                                                </Badge>
                                            </td>
                                            {user?.role === 'admin' && (
                                                <td className="p-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {record.status === 'Pending' && (
                                                            <Button 
                                                                size="sm" 
                                                                onClick={() => handleUpdateStatus(record._id, 'Paid')}
                                                                className="bg-primary/10 hover:bg-primary text-primary hover:text-white border-none h-8 px-4 rounded-lg font-bold text-[10px] uppercase transition-all"
                                                            >
                                                                Mark Paid
                                                            </Button>
                                                        )}
                                                        {record.status === 'Paid' && (
                                                            <Button 
                                                                size="sm" 
                                                                onClick={() => handleUpdateStatus(record._id, 'Resolved')}
                                                                className="bg-green-100 hover:bg-green-500 text-green-600 hover:text-white border-none h-8 px-4 rounded-lg font-bold text-[10px] uppercase transition-all"
                                                            >
                                                                Settle
                                                            </Button>
                                                        )}
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-lg"
                                                            onClick={() => handleDelete(record._id)}
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
                </CardContent>
            </Card>
        </div>
    );
};

const DuesStatsCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-500",
        orange: "bg-orange-50 text-orange-500",
        green: "bg-green-50 text-green-600",
    };
    
    return (
        <Card className="apple-card border-none bg-white p-6 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
                <h3 className="text-3xl font-black text-[#1D1D1F] tracking-tight">{value}</h3>
            </div>
        </Card>
    );
};

export default NonDisciplinaryActions;
