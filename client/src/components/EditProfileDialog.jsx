import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthContext from "@/context/AuthContext";
import axios from "axios";
import { Settings2, User, Save, X } from "lucide-react";

export function EditProfileDialog() {
    const { user, updateUser } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        studentId: "",
        department: "",
        hostelName: "",
        hostelBlock: "",
        roomNumber: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                studentId: user.studentId || "",
                department: user.department || "",
                hostelName: user.hostelName || "",
                hostelBlock: user.hostelBlock || "",
                roomNumber: user.roomNumber || "",
            });
        }
    }, [user, open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const { data } = await axios.put(
                "http://localhost:5000/api/auth/profile",
                formData,
                config
            );
            updateUser(data);
            setOpen(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl border-muted hover:bg-[#F5F5F7] hover:text-[#1D1D1F] px-6 h-11 font-bold shadow-none flex items-center gap-2">
                    <Settings2 className="h-4 w-4" /> Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-white border-none rounded-[2rem] p-0 overflow-hidden shadow-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-8 bg-[#F5F5F7]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Manage Profile</DialogTitle>
                                <DialogDescription className="text-[#86868B]">Update your personal and residential details.</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-[#86868B] ml-1">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-[#F5F5F7] border-none rounded-xl h-11 px-4 focus:ring-2 focus:ring-primary/20"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="studentId" className="text-[10px] font-black uppercase tracking-widest text-[#86868B] ml-1">Identification ID</Label>
                            <Input
                                id="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                className="bg-[#F5F5F7] border-none rounded-xl h-11 px-4 focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. STU-2024-001"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="department" className="text-[10px] font-black uppercase tracking-widest text-[#86868B] ml-1">Academic Department</Label>
                            <Input
                                id="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="bg-[#F5F5F7] border-none rounded-xl h-11 px-4 focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. Computer Science Engineering"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hostelName" className="text-[10px] font-black uppercase tracking-widest text-[#86868B] ml-1">Residence Wing</Label>
                            <Input
                                id="hostelName"
                                value={formData.hostelName}
                                onChange={handleChange}
                                className="bg-[#F5F5F7] border-none rounded-xl h-11 px-4 focus:ring-2 focus:ring-primary/20"
                                placeholder="Hostel Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hostelBlock" className="text-[10px] font-black uppercase tracking-widest text-[#86868B] ml-1">Block / Floor</Label>
                            <Input
                                id="hostelBlock"
                                value={formData.hostelBlock}
                                onChange={handleChange}
                                className="bg-[#F5F5F7] border-none rounded-xl h-11 px-4 focus:ring-2 focus:ring-primary/20"
                                placeholder="e.g. Block A, 2nd Floor"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="roomNumber" className="text-[10px] font-black uppercase tracking-widest text-[#86868B] ml-1">Room Assignment</Label>
                            <Input
                                id="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                className="bg-[#F5F5F7] border-none rounded-xl h-11 px-4 focus:ring-2 focus:ring-primary/20"
                                placeholder="000"
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-8 border-t border-[#F5F5F7] bg-[#FBFBFD] flex items-center justify-between">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold px-6 h-11 text-[#86868B] hover:text-[#1D1D1F]">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="rounded-xl bg-primary hover:bg-black text-white px-8 h-11 font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                            {loading ? "Synchronizing..." : <><Save className="h-4 w-4" /> Save Changes</>}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
