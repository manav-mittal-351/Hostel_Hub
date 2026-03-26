import { useState, useContext } from "react";
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
import { toast } from "sonner";
import { Shield, Key, Loader2, CheckCircle2 } from "lucide-react";

export function ChangePasswordDialog() {
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        
        if (formData.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            await axios.post(
                "/api/auth/change-password",
                {
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                },
                config
            );
            toast.success("Password changed successfully");
            setOpen(false);
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error("Change password error:", error);
            toast.error(error.response?.data?.message || "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-11 text-[12px] font-bold tracking-tight px-4 border-border/50 hover:bg-secondary/50 transition-colors rounded-xl shadow-none active:scale-[0.98]">
                    <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-primary opacity-70" /> Change Password
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white border-none rounded-2xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-8 bg-secondary/10 border-b border-border/50">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-border/40">
                                <Key className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-[18px] font-bold tracking-tight text-foreground">Change Password</DialogTitle>
                                <DialogDescription className="text-[12px] font-medium text-muted-foreground italic">Reset your account security keys</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <div className="p-8 space-y-5 bg-white">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-70">Current Password</Label>
                            <Input
                                id="oldPassword"
                                type="password"
                                required
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className="h-11 font-medium bg-secondary/10 border-border/40 focus:bg-white focus:ring-1 focus:ring-primary/10 rounded-xl"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-70">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                required
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="h-11 font-medium bg-secondary/10 border-border/40 focus:bg-white focus:ring-1 focus:ring-primary/10 rounded-xl"
                                placeholder="Min. 6 characters"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-70">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="h-11 font-medium bg-secondary/10 border-border/40 focus:bg-white focus:ring-1 focus:ring-primary/10 rounded-xl"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-8 border-t border-border bg-secondary/5 flex items-center justify-between gap-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors h-11 px-6 rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="btn-primary h-11 px-10 text-[11px] font-bold uppercase tracking-widest active:scale-95">
                            {loading ? <><Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> Updating...</> : <><CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Confirm Update</>}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
