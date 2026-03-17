import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import { BedDouble, Building, Users, CheckCircle2, LogOut, MapPin, User as UserIcon, ShieldCheck, CreditCard, Calendar, Download, Printer, CheckCircle, Info, MessageSquare, ArrowRight } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminRoomManagement from "@/components/AdminRoomManagement";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

const RoomAllotment = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [error, setError] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showAllAvailable, setShowAllAvailable] = useState(false);
    const token = user?.token;

    if (user?.role === 'admin') {
        return <AdminRoomManagement />;
    }

    const fetchRooms = async () => {
        if (!token) return;
        setLoadingRooms(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get("/api/rooms", config);
            setRooms(data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setError(error.response?.data?.message || "Failed to load rooms");
        } finally {
            setLoadingRooms(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'student') {
            fetchRooms();
        }
    }, [user, token]);

    const handleBookRoom = async (room) => {
        const price = room.type === 'AC' ? 8000 : 5000;
        if (!confirm(`Are you sure you want to book Room ${room.roomNumber} (${room.type})? Payment of ₹${price} will be deducted.`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post("/api/rooms/book", {
                roomId: room._id,
                amount: price,
                paymentType: 'hostel_fee'
            }, config);

            alert("Room Booked Successfully! Welcome to your new home.");
            if (data.user) {
                updateUser(data.user);
            }
            window.location.reload();
        } catch (error) {
            console.error("Booking error details:", error);
            alert(error.response?.data?.message || "Booking failed.");
        }
    };

    const handleCheckout = async () => {
        if (!confirm("Are you sure you want to checkout? Your room allotment will be removed immediately.")) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post("/api/rooms/checkout", {}, config);

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
        <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-2">
                <div>
                    <h1 className="section-title">
                        Residential <span className="text-primary">{user?.roomNumber ? "Confirmation" : "Selection"}</span>
                    </h1>
                    <p className="section-subtitle">Coordinate your academic residency and manage your allotted premises.</p>
                </div>
                {user?.roomNumber && (
                    <Button 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 px-6 h-10 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all border border-red-100/50 active:scale-95"
                        onClick={handleCheckout}
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Checkout
                    </Button>
                )}
            </div>

            {user?.roomNumber && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <Card className="premium-card lg:col-span-3 border-border/80 bg-white text-foreground overflow-hidden shadow-xl shadow-primary/5 p-0">
                        <CardContent className="p-0 flex flex-col md:flex-row items-stretch justify-between relative min-h-[160px]">
                            <div className="p-10 flex-1 flex items-center gap-8 relative z-10 border-r border-dashed border-border/60">
                                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <BedDouble className="w-10 h-10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-emerald-500 text-white border-none px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm shadow-emerald-500/10">
                                            Registry Confirmed
                                        </Badge>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary/30 rounded-lg border border-border/40">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active</span>
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-bold tracking-tight text-foreground">Unit {user.roomNumber}</h2>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.1em]">Allocation ID</p>
                                        <div className="px-2 py-0.5 bg-secondary/50 rounded font-mono text-[10px] border border-border/50 uppercase tracking-tighter">
                                            {user._id?.slice(-12)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 flex items-center gap-12 bg-secondary/10 relative z-10 min-w-[320px]">
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Institutional Billing</p>
                                    <p className="text-3xl font-bold tracking-tighter text-foreground italic flex items-baseline justify-end gap-1">
                                        <span className="text-lg translate-y-[-2px]">₹</span>
                                        {user.hostelBlock?.includes('AC') && !user.hostelBlock?.includes('Non-AC') ? '8,000' : '5,000'}
                                        <span className="text-sm text-muted-foreground font-medium opacity-60">/mo</span>
                                    </p>
                                </div>
                                <div className="w-px h-12 bg-border/40" />
                                <Button 
                                    className="bg-primary text-white hover:bg-primary/90 transition-all rounded-xl h-12 px-8 font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/10 active:scale-95"
                                    onClick={() => setShowReceipt(true)}
                                >
                                    <Printer className="h-3.5 w-3.5 mr-2" /> Retrieve Receipt
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="premium-card bg-white p-6 space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary/50 rounded-lg text-primary">
                                        <Building className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-[14px] font-semibold text-foreground">Hostel Info</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-[13px] font-semibold text-foreground">{user.hostelName || 'Boys Premium Hostel'}</p>
                                            <p className="text-[11px] text-muted-foreground">{user.hostelBlock || 'Block-A, North Wing'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-2xl border border-border/40 group hover:border-primary/30 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2.5 bg-white rounded-xl border border-border/50 text-muted-foreground group-hover:text-primary transition-colors">
                                                <ShieldCheck className="w-4.5 h-4.5" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-foreground">Hostel Warden</p>
                                                <p className="text-[11px] font-medium text-muted-foreground">Mr. Sharma (+91 98XXX XXX00)</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10 hover:text-primary">
                                            <MessageSquare className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <Card className="premium-card bg-white p-6 space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-secondary/50 rounded-lg text-primary">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-[14px] font-semibold text-foreground">Resident Access</h3>
                                </div>
                                <div className="space-y-3">
                                    <DetailRow label="Department" value={user.department || 'CS Engineering'} />
                                    <DetailRow label="Student ID" value={user.studentId || 'STU-2024-001'} />
                                    <DetailRow label="Joined" value="Mar 2024" />
                                </div>
                            </Card>
                        </div>

                        <Card className="premium-card bg-white text-center p-12">
                            <div className="max-w-xs mx-auto space-y-4">
                                <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center mx-auto text-primary">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h3 className="text-[15px] font-semibold text-foreground">Seeking Roommates</h3>
                                <p className="text-[12px] text-muted-foreground leading-relaxed">
                                    Your room is currently set for single occupancy. New roommates will appear here once allocated by admin.
                                </p>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="premium-card bg-white p-6">
                            <h3 className="text-[14px] font-semibold text-foreground mb-4">Allocation Details</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-emerald-50/50 flex items-center justify-between border border-emerald-100/50">
                                    <div>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Fee Token</p>
                                        <p className="text-[15px] font-bold text-foreground">Active & Paid</p>
                                    </div>
                                    <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="space-y-2.5 px-0.5">
                                    <div className="flex justify-between text-[12px]">
                                        <span className="text-muted-foreground">Standard Rent</span>
                                        <span className="font-semibold text-foreground">₹5,000.00</span>
                                    </div>
                                    {user.hostelBlock?.includes('AC') && (
                                        <div className="flex justify-between text-[12px]">
                                            <span className="text-muted-foreground">Premium AC Fee</span>
                                            <span className="font-semibold text-foreground">₹3,000.00</span>
                                        </div>
                                    )}
                                    <div className="pt-3 mt-1 border-t border-dashed border-border flex justify-between text-[14px] font-bold">
                                        <span>Subtotal</span>
                                        <span className="text-primary">₹{user.hostelBlock?.includes('AC') ? '8,000.00' : '5,000.00'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="premium-card bg-secondary/20 p-5">
                            <div className="flex items-center gap-2 mb-3 text-primary">
                                <Info className="w-4 h-4" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">Residence Policy</span>
                            </div>
                            <ul className="space-y-2.5">
                                <li className="text-[11px] leading-relaxed text-muted-foreground flex gap-2">
                                    <div className="w-1 h-1 bg-primary/40 rounded-full mt-1.5 shrink-0" />
                                    Formal checkout is mandatory before room vacation.
                                </li>
                                <li className="text-[11px] leading-relaxed text-muted-foreground flex gap-2">
                                    <div className="w-1 h-1 bg-primary/40 rounded-full mt-1.5 shrink-0" />
                                    Inventory damage will be billed to scholar account.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6 pt-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 
                            className="text-xl font-semibold text-foreground tracking-tight cursor-pointer hover:text-primary transition-colors flex items-center gap-2 group"
                            onClick={() => setShowAllAvailable(!showAllAvailable)}
                        >
                            Available Residences
                            <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${showAllAvailable ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                        </h2>
                        <p className="text-sm text-muted-foreground">Explore and reserve your preferred room unit.</p>
                    </div>
                    {!user?.roomNumber && loadingRooms && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg">
                            <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Syncing</span>
                        </div>
                    )}
                </div>

                {!showAllAvailable && !user?.roomNumber && (
                    <div 
                        className="py-12 border-2 border-dashed border-border/60 rounded-3xl bg-secondary/5 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/30 transition-all cursor-pointer group"
                        onClick={() => setShowAllAvailable(true)}
                    >
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-border/40 group-hover:scale-105 transition-transform">
                            <BedDouble className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[15px] font-bold text-foreground">Discover Open Units</h3>
                            <p className="text-[12px] text-muted-foreground max-w-[240px]">Navigate through all currently unallotted premises in the institutional sector.</p>
                        </div>
                        <Button variant="outline" className="h-10 rounded-xl px-6 font-bold uppercase tracking-widest text-[10px] mt-2 group-hover:bg-primary group-hover:text-white transition-all">
                            View All Units
                        </Button>
                    </div>
                )}

                {showAllAvailable && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
                    {loadingRooms ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-56 rounded-2xl bg-muted animate-pulse border border-border/50" />
                        ))
                    ) : error ? (
                        <div className="col-span-full py-16 text-center premium-card bg-red-50/50 border-red-100">
                            <p className="text-red-600 font-semibold mb-4 text-sm">System Connection Unavailable: {error}</p>
                            <Button variant="outline" onClick={fetchRooms} className="rounded-xl border-red-200 text-red-600 hover:bg-red-100 text-[12px] h-9">
                                Retry Connection
                            </Button>
                        </div>
                    ) : rooms.length > 0 ? (
                        rooms.map((room) => {
                            const isMyRoom = user?.roomNumber === room.roomNumber;
                            const isFull = (room.occupants?.length || 0) >= room.capacity;

                            return (
                                <Card key={room._id} className={`premium-card h-full transition-all group ${isMyRoom ? 'border-primary bg-primary/5' : 'bg-white'}`}>
                                    <CardHeader className="p-6 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg font-bold">Room {room.roomNumber}</CardTitle>
                                                <CardDescription className="text-[11px] font-semibold uppercase tracking-wider mt-0.5 text-muted-foreground">
                                                    Floor {room.floor} • Sector {room.roomNumber.charAt(0)}
                                                </CardDescription>
                                            </div>
                                            <Badge className={`rounded-lg px-2.5 py-1 text-[10px] font-bold ${room.type === 'AC' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'} border-none uppercase tracking-wider`}>
                                                {room.type}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-2 space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Occupancy</p>
                                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {room.occupants?.length || 0} / {room.capacity}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Per Month</p>
                                                <p className="text-xl font-bold text-primary italic">₹{room.type === 'AC' ? '8K' : '5K'}</p>
                                            </div>
                                        </div>
                                        
                                        {isMyRoom ? (
                                            <Button 
                                                className="w-full h-11 text-[13px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shadow-none cursor-default"
                                                disabled
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Active Residence
                                            </Button>
                                        ) : isFull ? (
                                            <Button 
                                                className="w-full h-11 text-[13px] font-semibold bg-muted text-muted-foreground rounded-xl shadow-none cursor-not-allowed border border-border/50"
                                                disabled
                                            >
                                                Capacity Reached
                                            </Button>
                                        ) : (
                                            <Button 
                                                className="w-full h-11 text-[13px] font-semibold btn-primary rounded-xl" 
                                                onClick={() => handleBookRoom(room)}
                                            >
                                                {user?.roomNumber ? "Request Transfer" : "Reserve Room"}
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center premium-card border-dashed border-2 m-4 bg-secondary/10">
                            <BedDouble className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-[15px] font-semibold text-foreground">No Units Available</h3>
                            <p className="text-[12px] text-muted-foreground">Please contact administration for offline waitlist availability.</p>
                        </div>
                    )}
                </div>
                )}
            </div>

            {/* Receipt Modal */}
            <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                <DialogContent className="sm:max-w-md bg-white border-none p-0 overflow-hidden rounded-2xl shadow-2xl">
                    <div className="p-8 space-y-8">
                        <div className="text-center space-y-2">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                                <CheckCircle className="w-7 h-7" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight mt-4">Transaction Confirmed</h2>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-none">Official Residence Receipt</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2.5 border-b border-border">
                                <span className="text-[11px] text-muted-foreground font-semibold uppercase">Resident</span>
                                <span className="text-[13px] font-bold text-foreground">{user.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-border">
                                <span className="text-[11px] text-muted-foreground font-semibold uppercase">Allocated Unit</span>
                                <span className="text-[13px] font-bold text-foreground">Room {user.roomNumber}</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-border">
                                <span className="text-[11px] text-muted-foreground font-semibold uppercase">ID Ref</span>
                                <span className="text-[11px] font-mono text-muted-foreground">{user._id}</span>
                            </div>
                            <div className="py-8 flex flex-col items-center bg-secondary/20 rounded-2xl mt-4">
                                <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-2">Total Amount Paid</p>
                                <p className="text-4xl font-bold text-primary italic tracking-tight">
                                    ₹{user.hostelBlock?.includes('AC') ? '8,000.00' : '5,000.00'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pb-2">
                            <Button 
                                variant="outline" 
                                className="h-11 rounded-xl border-border hover:bg-muted font-bold gap-2 text-[12px]"
                                onClick={() => window.print()}
                            >
                                <Printer className="w-4 h-4" /> Print
                            </Button>
                            <Button className="h-11 rounded-xl btn-primary font-bold gap-2 text-[12px]">
                                <Download className="w-4 h-4" /> Export
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-0.5 text-[12px]">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-semibold text-foreground">{value}</span>
    </div>
);

export default RoomAllotment;
