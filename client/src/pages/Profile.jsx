import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { User, Mail, Hash, Building2, BookOpen, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "@/components/EditProfileDialog";

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="h-28" />
            <div className="container mx-auto p-6 pt-4 pb-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Identity */}
                    <Card className="glass-card lg:col-span-1 border-primary/20 h-fit sticky top-28">
                        <CardHeader className="text-center pb-8 border-b border-white/5">
                            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-primary/20 shadow-xl shadow-primary/10">
                                <User className="w-16 h-16 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold text-glow">{user?.name}</CardTitle>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Shield className="w-4 h-4 text-primary" />
                                <p className="text-muted-foreground capitalize font-medium">{user?.role}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <span className="text-sm font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">Active</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <span className="text-sm text-muted-foreground">Member Since</span>
                                    <span className="text-sm font-medium">Jan 2024</span>
                                </div>
                            </div>
                            <div className="pt-4 animate-in slide-in-from-bottom-2">
                                <EditProfileDialog />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Detailed Info */}
                    <Card className="glass-card lg:col-span-2 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <span className="bg-primary/20 p-2 rounded-lg"><BookOpen className="w-5 h-5 text-primary" /></span>
                                Academic & Hostel Details
                            </CardTitle>
                            <CardDescription>Your personal and institutional information.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <InfoItem icon={Mail} label="Email Address" value={user?.email} delay="0" />
                                <InfoItem icon={Hash} label="Student ID" value={user?.studentId || 'Not set'} delay="100" />
                                <InfoItem icon={BookOpen} label="Department" value={user?.department || 'Not set'} delay="200" />
                                <InfoItem icon={Building2} label="Hostel Block" value={user?.hostelName || 'Not Assigned'} delay="300" />
                                <InfoItem icon={Hash} label="Room Number" value={user?.roomNumber || 'Not Allocated'} delay="400" />
                                <InfoItem icon={Calendar} label="Batch" value="2024 - 2028" delay="500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value, delay }) => (
    <div className={`p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-3 fill-mode-both`} style={{ animationDelay: `${delay}ms` }}>
        <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-lg font-semibold mt-1 text-foreground/90">{value}</p>
            </div>
        </div>
    </div>
);

export default Profile;
