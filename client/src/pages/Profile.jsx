import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, Building, Shield, Calendar, Edit2, LogOut, Camera, Users, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditProfileDialog } from "@/components/EditProfileDialog";

const Profile = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="section-title">My Profile</h1>
                <p className="section-subtitle">Manage your personal information and account settings.</p>
            </header>

            {/* Profile Hero Section */}
            <div className="relative">
                <Card className="premium-card bg-white border-none p-0 overflow-hidden shadow-md">
                    <div className="h-40 w-full bg-secondary/30 relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
                    </div>
                    <div className="px-8 pb-10">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 -mt-16 relative z-10">
                            <div className="relative">
                                <div className="h-44 w-44 rounded-[2rem] bg-white p-2 shadow-xl ring-4 ring-secondary/20">
                                    <div className="h-full w-full rounded-[1.8rem] bg-secondary/50 flex items-center justify-center overflow-hidden relative group border border-border/50">
                                        <User className="h-20 w-20 text-primary/20" />
                                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-3 pt-4">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <h1 className="text-3xl font-bold text-foreground tracking-tight">{user.name}</h1>
                                    <Badge className="bg-primary text-primary-foreground border-none font-bold uppercase tracking-[0.2em] text-[10px] px-4 py-1.5 rounded-lg shadow-sm">
                                        {user.role}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground font-semibold text-[13px]">
                                    <span className="flex items-center gap-2 bg-secondary/40 px-3 py-1.5 rounded-xl border border-border/30">
                                        <Mail className="h-3.5 w-3.5 text-primary opacity-70" /> {user.email}
                                    </span>
                                    {user.studentId && (
                                        <span className="flex items-center gap-2 bg-secondary/40 px-3 py-1.5 rounded-xl border border-border/30">
                                            <Shield className="h-3.5 w-3.5 text-primary opacity-70" /> {user.studentId}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 pb-2 pt-6 md:pt-0">
                                <EditProfileDialog />
                                <Button 
                                    onClick={logout} 
                                    variant="outline" 
                                    className="h-11 px-6 text-[11px] font-bold uppercase tracking-widest border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all rounded-xl active:scale-95"
                                >
                                    <LogOut className="h-3.5 w-3.5 mr-2" /> Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Personal Information */}
                <Card className="premium-card lg:col-span-8 bg-white overflow-hidden p-0 border-border/60">
                    <CardHeader className="px-8 py-7 border-b border-border bg-secondary/10">
                        <CardTitle className="text-[17px] font-bold tracking-tight">Personal Information</CardTitle>
                        <CardDescription className="text-[12px] font-medium">Your primary contact and hostel details.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem icon={User} label="Full Name" value={user.name} />
                            <InfoItem icon={Mail} label="Email Address" value={user.email} />
                            <InfoItem icon={Shield} label="Student ID" value={user.studentId || "NOT SET"} />
                            <InfoItem icon={Building} label="Department" value={user.department || "General"} />
                            <InfoItem icon={MapPin} label="Hostel & Block" value={user.hostelName ? `${user.hostelName} (Block ${user.hostelBlock || 'Global'})` : "Pending Allotment"} />
                            <InfoItem icon={Calendar} label="Room Number" value={user.roomNumber ? `Room #${user.roomNumber}` : "NOT ALLOTTED"} />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Settings / Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="premium-card bg-white border-border/60">
                        <CardHeader className="px-7 py-6 border-b border-border/50">
                            <CardTitle className="text-[15px] font-bold tracking-tight">Account Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-7 space-y-4">
                            <Button variant="outline" className="w-full justify-between h-11 text-[12px] font-bold tracking-tight px-4 border-border/50 hover:bg-secondary/50 transition-colors rounded-xl shadow-none">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-4 w-4 text-primary opacity-70" /> Reset Password
                                </div>
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between h-11 text-[12px] font-bold tracking-tight px-4 border-border/50 hover:bg-secondary/50 transition-colors rounded-xl shadow-none">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-primary opacity-70" /> Access Logs
                                </div>
                                <Shield className="h-3 w-3 text-muted-foreground/30" />
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 text-white space-y-5 border border-emerald-800/50 shadow-2xl shadow-emerald-900/20 overflow-hidden relative">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl" />
                        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl" />
                        
                        <div className="p-4 bg-white/10 rounded-[1.8rem] w-fit border border-white/20 backdrop-blur-md relative z-10">
                            <Shield className="h-7 w-7 text-emerald-400" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                Verified Account
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </h3>
                            <p className="text-[13px] text-emerald-50/80 leading-relaxed font-medium">
                                Your identity is fully verified within the HostelHub network. You have full access to your assigned modules.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-5 p-5 rounded-2xl bg-secondary/10 border border-border/30 hover:border-primary/20 hover:bg-white hover:shadow-md transition-all group cursor-default">
        <div className="p-3.5 bg-white rounded-xl shadow-sm border border-border/50 text-muted-foreground group-hover:text-primary transition-colors">
            <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{label}</p>
            <p className="text-[14px] font-bold text-foreground tracking-tight">{value || "Not provided"}</p>
        </div>
    </div>
);

export default Profile;
