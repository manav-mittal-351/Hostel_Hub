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
    DialogClose,
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
                "/api/auth/profile",
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
                <Button variant="outline" className="h-11 px-6 text-[11px] font-bold uppercase tracking-widest border-border/60 bg-white hover:bg-secondary/50 rounded-xl flex items-center gap-2.5 transition-all active:scale-[0.98]">
                    <Settings2 className="h-3.5 w-3.5 text-primary/70" /> Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-white border-none rounded-2xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-8 bg-secondary/10 border-b border-border/50">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary/70 shadow-sm border border-border/40">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-[18px] font-bold tracking-tight text-foreground">Profile Parameters</DialogTitle>
                                <DialogDescription className="text-[12px] font-medium text-muted-foreground">Adjust your institutional identity and contact records.</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-white">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-70">Resident Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="h-11 font-medium bg-secondary/10 border-border/40 focus:bg-white focus:ring-1 focus:ring-primary/10 rounded-xl"
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="studentId" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-70">Institutional ID</Label>
                            <Input
                                id="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                disabled={user?.role !== 'admin'}
                                className="h-11 font-medium bg-secondary/10 border-border/40 focus:bg-white focus:ring-1 focus:ring-primary/10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="STU-XXX-XXX"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="department" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-70">Sector / Branch</Label>
                            <Input
                                id="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="h-11 font-medium bg-secondary/10 border-border/40 focus:bg-white focus:ring-1 focus:ring-primary/10 rounded-xl"
                                placeholder="Primary Department"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hostelName" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-70">Primary Unit</Label>
                            <Input
                                id="hostelName"
                                value={formData.hostelName}
                                onChange={handleChange}
                                className="h-11 font-medium bg-secondary/10 border-border/40 focus:bg-white focus:ring-1 focus:ring-primary/10 rounded-xl"
                                placeholder="Unit Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hostelBlock" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-70">Block Specification</Label>
                            <Input
                                id="hostelBlock"
                                value={formData.hostelBlock}
                                onChange={handleChange}
                                className="h-11 font-medium bg-secondary/10 border-border/40 focus:bg-white focus:ring-1 focus:ring-primary/10 rounded-xl"
                                placeholder="Block ID"
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-8 border-t border-border bg-secondary/5 flex items-center justify-between gap-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors h-11 px-6 rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="btn-primary h-11 px-10 text-[11px] font-bold uppercase tracking-widest active:scale-95">
                            {loading ? "Synchronizing..." : <><Save className="h-3.5 w-3.5 mr-2" /> Commit Changes</>}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
