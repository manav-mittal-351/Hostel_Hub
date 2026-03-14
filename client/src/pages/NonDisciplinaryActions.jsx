import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import Navbar from "@/components/Navbar";
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
    History
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
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="h-28" />
            
            <div className="container mx-auto p-6 space-y-8 pt-4 pb-12 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
                            Non-Disciplinary <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Actions</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">Manage financial dues and administrative records for students.</p>
                    </div>
                    {user?.role === 'admin' && (
                        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                    <Plus className="w-5 h-5" />
                                    Add New Action
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#0D0D0D] border-white/10 text-white rounded-[2rem] p-8 max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold italic">New Administrative Action</DialogTitle>
                                    <DialogDescription className="text-muted-foreground">Log extra dues or minor service charges for a student.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-6 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="studentId">Student ID / MongoDB ID</Label>
                                        <Input 
                                            id="studentId"
                                            placeholder="STU-2024-001"
                                            className="bg-white/5 border-white/10 rounded-xl focus:ring-primary"
                                            value={formData.studentId}
                                            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <select 
                                                className="w-full h-10 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                                            <Label>Amount (₹)</Label>
                                            <Input 
                                                type="number"
                                                placeholder="0.00"
                                                className="bg-white/5 border-white/10 rounded-xl focus:ring-primary"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reason / Description</Label>
                                        <textarea 
                                            className="w-full h-24 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Details of the charge..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                                            Submit Record
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-panel border-white/10 bg-white/5 overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-1">Total Records</p>
                                    <h3 className="text-4xl font-black text-white">{stats.total}</h3>
                                </div>
                                <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <History className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-white/10 bg-white/5 overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-1">Pending Dues</p>
                                    <h3 className="text-4xl font-black text-primary">₹{stats.pendingAmount.toLocaleString()}</h3>
                                </div>
                                <div className="p-4 bg-yellow-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <IndianRupee className="w-8 h-8 text-yellow-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-white/10 bg-white/5 overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-1">Resolved Tasks</p>
                                    <h3 className="text-4xl font-black text-green-500">{stats.resolved}</h3>
                                </div>
                                <div className="p-4 bg-green-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <Card className="glass-panel border-white/10 bg-white/5 overflow-hidden shadow-2xl">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-black italic tracking-tight">ACTION REGISTRY</CardTitle>
                                <CardDescription>View and manage administrative records for all residents.</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input 
                                        placeholder="Search student or ID..."
                                        className="pl-10 h-11 w-64 bg-white/5 border-white/10 rounded-xl focus:ring-primary focus:border-primary transition-all shadow-inner"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select 
                                    className="h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold cursor-pointer"
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
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="p-6 text-xs font-black text-muted-foreground uppercase tracking-widest">Student Info</th>
                                        <th className="p-6 text-xs font-black text-muted-foreground uppercase tracking-widest">Action Type</th>
                                        <th className="p-6 text-xs font-black text-muted-foreground uppercase tracking-widest">Description</th>
                                        <th className="p-6 text-xs font-black text-muted-foreground uppercase tracking-widest text-center">Amount</th>
                                        <th className="p-6 text-xs font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
                                        <th className="p-6 text-xs font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-muted-foreground italic animate-pulse">
                                                Synchronizing records with secure vault...
                                            </td>
                                        </tr>
                                    ) : filteredRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2 opacity-50">
                                                    <FileText className="w-12 h-12 mb-2" />
                                                    <p className="text-xl font-bold">No Records Found</p>
                                                    <p className="text-sm">Try adjusting your filters or search terms.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRecords.map((record) => (
                                            <tr key={record._id} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/20 to-blue-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                                            <UserIcon className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white uppercase tracking-tight">{record.student?.name || "Unknown User"}</p>
                                                            <p className="text-[10px] text-muted-foreground font-mono">{record.student?.studentId || record.student?._id?.slice(-8).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white px-3 py-1 rounded-lg">
                                                        {record.actionType}
                                                    </Badge>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-sm text-muted-foreground max-w-xs line-clamp-1 group-hover:line-clamp-none transition-all duration-500 italic">
                                                        "{record.description}"
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">
                                                        {new Date(record.createdAt).toLocaleDateString()}
                                                    </p>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className="text-lg font-black italic text-white">₹{record.amount.toLocaleString()}</span>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <Badge className={`
                                                        px-4 py-1.5 rounded-full font-bold uppercase tracking-tighter text-[10px]
                                                        ${record.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                                                          record.status === 'Paid' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                          'bg-green-500/10 text-green-500 border-green-500/20'}
                                                    `}>
                                                        {record.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {user?.role === 'admin' && (
                                                            <>
                                                                {record.status === 'Pending' && (
                                                                    <Button 
                                                                        size="sm" 
                                                                        onClick={() => handleUpdateStatus(record._id, 'Paid')}
                                                                        className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 h-8 rounded-lg"
                                                                    >
                                                                        Mark Paid
                                                                    </Button>
                                                                )}
                                                                {record.status === 'Paid' && (
                                                                    <Button 
                                                                        size="sm" 
                                                                        onClick={() => handleUpdateStatus(record._id, 'Resolved')}
                                                                        className="bg-green-500/20 hover:bg-green-500/40 text-green-500 border border-green-500/30 h-8 rounded-lg"
                                                                    >
                                                                        Resolve
                                                                    </Button>
                                                                )}
                                                                <Button 
                                                                    size="icon" 
                                                                    variant="ghost" 
                                                                    className="h-8 w-8 text-red-500 hover:bg-red-500/10 rounded-lg"
                                                                    onClick={() => handleDelete(record._id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NonDisciplinaryActions;
