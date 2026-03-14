import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, Building, Shield, Calendar, Edit2, LogOut, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header / Hero Section */}
            <div className="relative">
                <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                </div>
                <div className="container px-8">
                    <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-10">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-[2rem] bg-white p-1.5 shadow-xl">
                                <div className="h-full w-full rounded-[1.75rem] bg-muted flex items-center justify-center overflow-hidden relative">
                                    <User className="h-16 w-16 text-muted-foreground/40" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold text-foreground tracking-tight">{user.name}</h1>
                                <Badge className="bg-primary/10 text-primary border-none font-bold uppercase tracking-widest text-[10px] px-3 py-1">
                                    {user.role}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4" /> {user.email}
                            </p>
                        </div>
                        <div className="pb-2 flex gap-3">
                            <Button variant="outline" className="rounded-xl font-bold h-11 px-6 border-muted shadow-none gap-2">
                                <Edit2 className="h-4 w-4" /> Edit Profile
                            </Button>
                            <Button onClick={logout} variant="destructive" className="rounded-xl font-bold h-11 px-6 shadow-none gap-2">
                                <LogOut className="h-4 w-4" /> Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Personal Information */}
                <Card className="apple-card lg:col-span-2 border-none bg-white shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-muted/50 p-8">
                        <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                        <CardDescription>View and manage your personal details and contact info.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                            <InfoItem icon={User} label="Full Name" value={user.name} />
                            <InfoItem icon={Mail} label="Email Address" value={user.email} />
                            <InfoItem icon={Phone} label="Phone Number" value="+91 98765 43210" />
                            <InfoItem icon={Shield} label="Account Role" value={user.role} isBadge />
                            <InfoItem icon={Building} label="Hostel Block" value="Block A" />
                            <InfoItem icon={MapPin} label="Room Number" value="302" />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Settings / Sidebar */}
                <div className="space-y-8">
                    <Card className="apple-card border-none bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Account Security</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full justify-start rounded-xl h-12 px-4 border-muted hover:bg-muted/50 shadow-none font-bold gap-3">
                                <Shield className="h-4 w-4 text-primary" /> Change Password
                            </Button>
                            <Button variant="outline" className="w-full justify-start rounded-xl h-12 px-4 border-muted hover:bg-muted/50 shadow-none font-bold gap-3">
                                <Calendar className="h-4 w-4 text-primary" /> Login Sessions
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="apple-card border-none bg-primary p-8 text-primary-foreground text-center space-y-4">
                        <div className="p-4 bg-white/10 rounded-3xl w-fit mx-auto">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold">Verified User</h3>
                        <p className="text-sm text-primary-foreground/70 leading-relaxed">
                            Your account is fully verified. You have all administrative privileges within your assigned sector.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value, isBadge }) => (
    <div className="flex items-start gap-4">
        <div className="p-3 bg-muted/50 rounded-2xl">
            <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
            {isBadge ? (
                <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[10px] px-3 py-1 mt-1">
                    {value}
                </Badge>
            ) : (
                <p className="text-sm font-bold text-foreground">{value || "Not provided"}</p>
            )}
        </div>
    </div>
);

export default Profile;
