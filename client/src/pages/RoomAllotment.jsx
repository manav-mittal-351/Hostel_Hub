import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import { BedDouble, Building, Users, CheckCircle2, LogOut, MapPin, User as UserIcon, ShieldCheck, CreditCard, Calendar } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Download, Printer, CheckCircle } from "lucide-react";

const RoomAllotment = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [error, setError] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const token = user?.token;

    useEffect(() => {
        if (!user?.roomNumber) {
            fetchRooms();
        }
    }, [user, token]);

    const fetchRooms = async () => {
        if (!token) return;
        setLoadingRooms(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get("http://localhost:5000/api/rooms", config);
            console.log("Fetched Rooms:", data);
            setRooms(data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setError(error.response?.data?.message || "Failed to load rooms");
        } finally {
            setLoadingRooms(false);
        }
    };

    const handleBookRoom = async (room) => {
        const price = room.type === 'AC' ? 8000 : 5000;
        if (!confirm(`Are you sure you want to book Room ${room.roomNumber} (${room.type})? Payment of ₹${price} will be deducted.`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post("http://localhost:5000/api/rooms/book", {
                roomId: room._id,
                amount: price,
                paymentType: 'hostel_fee'
            }, config);

            // 1. Alert success
            alert("Room Booked Successfully! Welcome to your new home.");
            
            // 2. Update Context & LocalStorage with fresh data from backend
            if (data.user) {
                updateUser(data.user);
            }
            
            // 3. Small delay then reload to refresh all views (or skip reload if state is enough)
            window.location.reload();
        } catch (error) {
            console.error("Booking error details:", error);
            const errorMessage = error.response?.data?.message || "Booking failed. Please check your connection or try again.";
            alert(errorMessage);
        }
    };

    const handleCheckout = async () => {
        if (!confirm("Are you sure you want to checkout? Your room allotment will be removed immediately.")) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post("http://localhost:5000/api/rooms/checkout", {}, config);

            alert("Checked out successfully!");
            if (data.user) {
                updateUser(data.user);
            }
            window.location.reload();
        } catch (error) {
            console.error("Checkout error:", error);
            alert(error.response?.data?.message || "Checkout failed");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <Navbar />
            <div className="h-24" /> {/* Balanced Spacer for Floating Navbar */}
            <div className="container mx-auto p-4 md:p-6 space-y-8 pt-4 max-w-7xl relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
                            Room <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">{user?.roomNumber ? "Allotted" : "Allotment"}</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">Manage your hostel stay and room details.</p>
                    </div>
                    {user?.roomNumber && (
                        <Button 
                            variant="destructive" 
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-6 rounded-2xl font-bold flex items-center gap-2 group transition-all"
                            onClick={handleCheckout}
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Checkout Hostel
                        </Button>
                    )}
                </div>

                {user?.roomNumber && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                        {/* Status Card - Full Width on Mobile */}
                        <Card className="lg:col-span-3 glass-panel border-primary/20 bg-primary/5 overflow-hidden">
                            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-[2rem] bg-primary/20 flex items-center justify-center border border-primary/30 shadow-2xl shadow-primary/20">
                                        <BedDouble className="w-10 h-10 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className="bg-green-500/20 text-green-500 border-green-500/20 px-3 py-1 rounded-full animate-pulse">
                                                Active Allotment
                                            </Badge>
                                            <Badge variant="outline" className="border-white/10 text-white/60">
                                                ID: {user._id?.slice(-6).toUpperCase()}
                                            </Badge>
                                        </div>
                                        <h2 className="text-3xl font-bold text-white">Room {user.roomNumber}</h2>
                                        <p className="text-muted-foreground">Your Official Hostel Residence</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm text-muted-foreground font-medium">Monthly Fee</p>
                                        <p className="text-2xl font-black text-white">₹{user.hostelBlock?.includes('AC') && !user.hostelBlock?.includes('Non-AC') ? '8,000' : '5,000'}</p>
                                    </div>
                                    <div className="w-px h-12 bg-white/10 hidden md:block mx-4" />
                                    <Button 
                                        variant="outline" 
                                        className="glass-panel border-white/10 hover:bg-white/5 rounded-xl h-12 px-6"
                                        onClick={() => setShowReceipt(true)}
                                    >
                                        View Receipt
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Detailed Info Cards */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="glass-panel border-white/10">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Building className="w-5 h-5 text-primary" />
                                            Hostel Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="font-bold text-white">{user.hostelName || 'Boys Premium Hostel'}</p>
                                                <p className="text-sm text-muted-foreground">{user.hostelBlock || 'Block-A, North Wing'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <ShieldCheck className="w-4 h-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="font-bold text-white">Chief Warden</p>
                                                <p className="text-sm text-muted-foreground">Mr. Rajesh Sharma (+91 98XXX XXX00)</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="glass-panel border-white/10">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <UserIcon className="w-5 h-5 text-blue-400" />
                                            Student Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-muted-foreground">Department</span>
                                            <span className="font-medium text-white">{user.department || 'Computer Science'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-muted-foreground">Student ID</span>
                                            <span className="font-medium text-white">{user.studentId || 'STU-2024-001'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card className="glass-panel border-white/10 overflow-hidden">
                                <CardHeader className="bg-white/5 border-b border-white/5">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Users className="w-6 h-6 text-primary" />
                                        Roommates
                                    </CardTitle>
                                    <CardDescription>People sharing this room with you</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-white/5">
                                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-blue-500/20 flex items-center justify-center border border-white/10 text-primary font-bold">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white uppercase">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">Primary Resident (You)</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                                        </div>
                                        <div className="p-6 text-center bg-white/5">
                                            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                                            <p className="text-muted-foreground text-sm italic">Waiting for more roommates to join...</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar/Action Cards */}
                        <div className="space-y-6">
                            <Card className="glass-panel border-white/10 bg-gradient-to-br from-primary/10 to-transparent shadow-2xl shadow-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-primary" />
                                        Payment Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Paid Monthly Fee</p>
                                            <p className="text-xl font-black text-white">₹{user.hostelBlock?.includes('AC') && !user.hostelBlock?.includes('Non-AC') ? '8,000.00' : '5,000.00'}</p>
                                        </div>
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass-panel border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                        Stay Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative pl-6 border-l-2 border-primary/30 py-2 space-y-6">
                                        <div className="relative">
                                            <div className="absolute -left-[1.85rem] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                                            <p className="text-sm font-bold text-white uppercase tracking-wider">Checked In</p>
                                            <p className="text-xs text-muted-foreground">MAR 2024 - 10:45 AM</p>
                                        </div>
                                        <div className="relative opacity-30">
                                            <div className="absolute -left-[1.85rem] top-1 w-4 h-4 rounded-full bg-white/20 border-4 border-background" />
                                            <p className="text-sm font-bold text-white uppercase tracking-wider">End of Session</p>
                                            <p className="text-xs text-muted-foreground font-mono">JUNE 2024</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                <div className="space-y-6 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-1 bg-primary rounded-full" />
                        <h2 className="text-2xl font-bold text-white">Available Rooms</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loadingRooms ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-muted-foreground animate-pulse">Loading available rooms...</p>
                            </div>
                        ) : error ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-destructive font-medium">Error: {error}</p>
                                <Button variant="outline" onClick={fetchRooms} className="mt-4">Retry</Button>
                            </div>
                        ) : rooms.length > 0 ? (
                            rooms.map((room) => {
                                const isMyRoom = user?.roomNumber === room.roomNumber;
                                const isFull = (room.occupants?.length || 0) >= room.capacity;

                                return (
                                    <Card key={room._id} className={`hover:shadow-lg transition-all border-primary/20 group relative overflow-hidden ${isMyRoom ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                                        {isMyRoom && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <Badge className="bg-primary text-white shadow-lg border-white/20">YOUR ROOM</Badge>
                                            </div>
                                        )}
                                        <CardHeader className={isMyRoom ? "pt-14" : ""}>
                                            <CardTitle className="flex justify-between items-center">
                                                <span>Room {room.roomNumber}</span>
                                                <Badge className="group-hover:scale-110 transition-transform" variant={room.type === 'AC' ? 'default' : 'secondary'}>{room.type}</Badge>
                                            </CardTitle>
                                            <CardDescription>Floor {room.floor} • Capacity: {room.capacity}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Users className="w-4 h-4" />
                                                    <span>{room.occupants?.length || 0} / {room.capacity} Occupied</span>
                                                </div>
                                                <div className="text-2xl font-bold text-primary">₹{room.type === 'AC' ? '8000' : '5000'}</div>
                                            </div>
                                            
                                            {isMyRoom ? (
                                                <Button 
                                                    className="w-full h-12 text-sm font-bold bg-green-500/20 text-green-500 border border-green-500/20 cursor-default"
                                                    disabled
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Current Room
                                                </Button>
                                            ) : isFull ? (
                                                <Button 
                                                    className="w-full h-12 text-sm font-bold opacity-50 cursor-not-allowed"
                                                    disabled
                                                >
                                                    Room Full
                                                </Button>
                                            ) : (
                                                <Button 
                                                    className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20" 
                                                    onClick={() => handleBookRoom(room)}
                                                >
                                                    {user?.roomNumber ? "Request Change" : "Book & Pay Now"}
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })
                        ) : (
                            <div 
                                className="col-span-full text-center py-12 border border-dashed border-white/10 rounded-3xl bg-white/5 cursor-pointer hover:bg-white/10 transition-all group duration-500"
                                onClick={fetchRooms}
                            >
                                <div className="p-4 bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <BedDouble className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                    {user?.roomNumber ? "Explore Other Vacant Rooms" : "No Rooms Available"}
                                </h3>
                                <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                                    {user?.roomNumber 
                                        ? "Click here to see other rooms currently available for re-allotment or switching." 
                                        : "All rooms are currently at full capacity. Please check back later or contact admin."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Receipt Dialog */}
            <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                <DialogContent className="sm:max-w-[500px] bg-[#0A0A0A] border-white/10 text-white overflow-hidden p-0">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400" />
                    
                    <div className="p-8 space-y-8">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-black tracking-tighter text-white">HOSTEL<span className="text-primary">HERO</span></h1>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Official Payment Receipt</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Receipt ID</p>
                                <p className="text-xs font-mono text-white">#BTX-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                            </div>
                        </div>

                        {/* Status Banner */}
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <CheckCircle className="w-24 h-24 text-primary" />
                            </div>
                            <div className="bg-primary/20 p-3 rounded-full mb-2">
                                <CheckCircle className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-black text-white italic tracking-tight">PAYMENT SUCCESSFUL</h2>
                            <p className="text-muted-foreground text-sm uppercase tracking-wider font-bold">Alloted: Room {user.roomNumber}</p>
                        </div>

                        {/* Details Table */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Student Name</p>
                                    <p className="font-bold text-white uppercase">{user.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Student ID</p>
                                    <p className="font-bold text-white tracking-tighter">{user.studentId || "STU-2024-001"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Hostel & Block</p>
                                    <p className="font-bold text-white">{user.hostelName || "Boys Hostel"} • {user.hostelBlock || "Block-A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Date of Booking</p>
                                    <p className="font-bold text-white">{new Date().toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>

                            {/* Amount Section */}
                            <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Allocation Fee</span>
                                    <span className="text-white font-medium">₹5,000.00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Service Tax (0%)</span>
                                    <span className="text-white font-medium">₹0.00</span>
                                </div>
                                <div className="flex justify-between items-center py-4 px-6 bg-white/5 rounded-xl mt-4">
                                    <span className="font-black text-white uppercase tracking-wider italic">Total Paid</span>
                                    <span className="text-2xl font-black text-primary italic">₹{user.hostelBlock?.includes('AC') && !user.hostelBlock?.includes('Non-AC') ? '8,000.00' : '5,000.00'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center space-y-4">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium leading-relaxed">
                                This is a computer-generated receipt and does not require a physical signature.
                                <br /> For any queries, contact the warden office.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button 
                                    className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold gap-2"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="w-4 h-4" /> Print
                                </Button>
                                <Button className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
                                    <Download className="w-4 h-4" /> Download
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RoomAllotment;
