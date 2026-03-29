import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useEffect, useState, useMemo } from "react";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { Users, Search, Trash2, Shield, User, Filter, AlertTriangle, ArrowUpDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ConfirmationModal";

const StudentsList = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchStudents = async () => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get("/api/students", config);
            console.log("Successfully fetched students:", data.length);
            setStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchStudents();
        }
    }, [user?.token]);

    const filteredStudents = useMemo(() => {
        console.log("Filtering students with query:", searchQuery);
        return students.filter(s => 
            (s.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.studentId?.toString().includes(searchQuery))
        );
    }, [students, searchQuery]);

    const handleDelete = async () => {
        if (!studentToDelete || !user?.token) return;
        setDeleteLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/students/${studentToDelete._id}`, config);
            setStudents(students.filter(s => s._id !== studentToDelete._id));
            setIsDeleteDialogOpen(false);
            setStudentToDelete(null);
            toast.success("Student record deleted successfully");
        } catch (error) {
            console.error("Error deleting student:", error);
            toast.error(error.response?.data?.message || "Failed to delete student");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/50 pb-4">
                <div>
                    <h1 className="section-title text-2xl sm:text-3xl">All Students</h1>
                    <p className="section-subtitle mb-0">View and manage all student accounts.</p>
                </div>
                <div className="flex bg-secondary/10 p-1 rounded-xl border border-border/40 w-full sm:min-w-[320px] sm:w-auto items-center relative group">
                    <Search className="absolute left-4 h-4 w-4 text-muted-foreground opacity-50 group-focus-within:opacity-100 transition-opacity" />
                    <Input 
                        type="text" 
                        placeholder="Search students..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 pl-11 text-[12px] font-bold bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/30 shadow-none"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                 <StudentStatCard 
                    title="Total Students" 
                    value={students.length} 
                    subtitle="Global Institutional Database"
                    icon={Users}
                />
                <StudentStatCard 
                    title="Member Type" 
                    value="Student" 
                    subtitle="Verified"
                    icon={Shield}
                />
                <StudentStatCard 
                    title="My Role" 
                    value={user?.role.toUpperCase()} 
                    subtitle="Active"
                    icon={ArrowUpDown}
                />
            </div>

            <Card className="premium-card bg-white p-0 overflow-hidden border-border/60 shadow-sm">
                <CardHeader className="p-7 border-b border-border bg-secondary/5 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-[17px] font-bold text-foreground">Student List</CardTitle>
                        <CardDescription className="text-[12px] font-medium italic opacity-60">Official Records</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 bg-white border-border/60 text-primary">
                        {filteredStudents.length} Students Found
                    </Badge>
                </CardHeader>
                <div className="overflow-x-auto w-full custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-secondary/10 border-b border-border/50">
                                <th className="px-7 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">ID</th>
                                <th className="px-7 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Name & Email</th>
                                <th className="px-7 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Room</th>
                                <th className="px-7 py-4 text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Block</th>
                                <th className="px-7 py-4 text-right text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-7 py-6"><div className="h-10 bg-secondary/20 rounded-xl w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-secondary/5 transition-colors group">
                                        <td className="px-7 py-5">
                                            <p className="text-[13px] font-bold text-primary tracking-tighter">#{student.studentId || student._id.slice(-6).toUpperCase()}</p>
                                        </td>
                                        <td className="px-7 py-5">
                                            <div className="flex flex-col">
                                                <p className="text-[14px] font-bold text-foreground">{student.name}</p>
                                                <p className="text-[11px] font-medium text-muted-foreground">{student.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-7 py-5">
                                            <p className="text-[13px] font-bold text-foreground/80">{student.roomNumber || "No Room"}</p>
                                        </td>
                                        <td className="px-7 py-5">
                                            <Badge className="bg-secondary/50 text-foreground/60 border-none px-3 py-0.5 text-[9px] font-black uppercase tracking-widest">
                                                {student.hostelBlock || "Global"}
                                            </Badge>
                                        </td>
                                        <td className="px-7 py-5 text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => {
                                                    setStudentToDelete(student);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-7 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4 opacity-30 grayscale">
                                            <div className="p-6 rounded-full bg-secondary/40">
                                                <Users className="h-12 w-12" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[15px] font-bold uppercase tracking-[0.2em]">No students found</p>
                                                <p className="text-[12px] font-medium">Try searching for something else.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <ConfirmationModal 
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Confirm Deletion?"
                description={studentToDelete ? `This will permanently delete ${studentToDelete.name}'s account. You can't undo this action.` : ""}
                onConfirm={handleDelete}
                confirmText="Confirm Delete"
                cancelText="Cancel"
                loading={deleteLoading}
                variant="destructive"
            />
        </div>
    );
};

const StudentStatCard = ({ title, value, subtitle, icon: Icon }) => (
    <Card className="premium-card p-6 bg-white flex items-center gap-6 border-border/60 shadow-none hover:border-primary/20 transition-all duration-500 group">
        <div className="p-4 bg-secondary/40 rounded-2xl text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
            <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-muted-foreground uppercase opacity-70 tracking-widest">{title}</p>
            <div className="flex flex-col">
                <h3 className="text-2xl font-black text-foreground tracking-tighter">{value}</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-50">{subtitle}</p>
            </div>
        </div>
    </Card>
);

export default StudentsList;
