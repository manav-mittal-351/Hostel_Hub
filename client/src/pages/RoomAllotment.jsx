import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import { BedDouble, Building, Users, CheckCircle2, LogOut, MapPin, User as UserIcon, ShieldCheck, CreditCard, Calendar, Download, Printer, CheckCircle, Info } from "lucide-react";
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
    const token = user?.token;

    useEffect(() => {
        if (user?.role === 'student' && !user?.roomNumber) {
            fetchRooms();
        }
    }, [user, token]);

    if (user?.role === 'admin') {
        return <AdminRoomManagement />;
    }

    const fetchRooms = async () => {
        if (!token) return;
        setLoadingRooms(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get("http://localhost:5000/api/rooms", config);
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
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Room <span className="text-primary">{user?.roomNumber ? "Allotted" : "Allotment"}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage your residence and booking details.</p>
                </div>
                {user?.roomNumber && (
                    <Button 
                        variant="destructive" 
                        className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-none"
                        onClick={handleCheckout}
                    >
                        <LogOut className="w-4 h-4" />
                        Checkout
                    </Button>
                )}
            </div>

            {user?.roomNumber && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="apple-card lg:col-span-3 border-none bg-primary text-primary-foreground overflow-hidden shadow-sm">
                        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30">
                                    <BedDouble className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className="bg-white/20 text-white border-none px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            Active Reservation
                                        </Badge>
                                    </div>
                                    <h2 className="text-3xl font-extrabold tracking-tight">Room {user.roomNumber}</h2>
                                    <p className="text-primary-foreground/70 text-sm font-medium">Official Residence ID: {user._id?.slice(-6).toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs text-primary-foreground/60 font-bold uppercase tracking-widest">Monthly Commitment</p>
                                    <p className="text-2xl font-black italic">₹{user.hostelBlock?.includes('AC') && !user.hostelBlock?.includes('Non-AC') ? '8,000' : '5,000'}</p>
                                </div>
                                <div className="w-px h-10 bg-white/20 hidden md:block mx-4" />
                                <Button 
                                    variant="outline" 
                                    className="bg-white border-none text-primary hover:bg-white/90 rounded-xl h-10 px-6 font-bold shadow-none"
                                    onClick={() => setShowReceipt(true)}
                                >
                                    View Receipt
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="apple-card border-none bg-white shadow-sm p-6 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-xl">
                                        <Building className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-foreground">Hostel Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{user.hostelName || 'Boys Premium Hostel'}</p>
                                            <p className="text-xs text-muted-foreground">{user.hostelBlock || 'Block-A, North Wing'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="w-4 h-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-sm font-bold text-foreground">Warden On Duty</p>
                                            <p className="text-xs text-muted-foreground">Mr. Rajesh Sharma (+91 98XXX XXX00)</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="apple-card border-none bg-white shadow-sm p-6 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 rounded-xl">
                                        <UserIcon className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <h3 className="font-bold text-foreground">Resident Profile</h3>
                                </div>
                                <div className="space-y-3">
                                    <DetailRow label="Department" value={user.department || 'Computer Science'} />
                                    <DetailRow label="ID Number" value={user.studentId || 'STU-2024-001'} />
                                    <DetailRow label="Check-in" value="Mar 2024" />
                                </div>
                            </Card>
                        </div>

                        <Card className="apple-card border-none bg-white shadow-sm overflow-hidden text-center p-10">
                            <div className="max-w-xs mx-auto space-y-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
                                    <Users className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">Seeking Roommates</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Your room is currently set for single occupancy. New roommates will appear here once allocated.
                                </p>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card className="apple-card border-none bg-white shadow-sm p-6">
                            <h3 className="font-bold text-foreground mb-4">Payment Breakdown</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-green-50 flex items-center justify-between border border-green-100">
                                    <div>
                                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Fee Status</p>
                                        <p className="text-lg font-bold text-foreground">Fully Paid</p>
                                    </div>
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2 px-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Base Allocation</span>
                                        <span className="font-medium">₹5,000.00</span>
                                    </div>
                                    {user.hostelBlock?.includes('AC') && (
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">AC Surcharge</span>
                                            <span className="font-medium">₹3,000.00</span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-dashed flex justify-between text-sm font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">₹{user.hostelBlock?.includes('AC') ? '8,000.00' : '5,000.00'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="apple-card border-none bg-muted/30 p-6">
                            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                                <Info className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Stay Policy</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="text-[11px] leading-relaxed text-muted-foreground flex gap-2">
                                    <span className="w-1 h-1 bg-muted-foreground rounded-full mt-1.5 shrink-0" />
                                    Checkout must be processed at least 48 hours before session end.
                                </li>
                                <li className="text-[11px] leading-relaxed text-muted-foreground flex gap-2">
                                    <span className="w-1 h-1 bg-muted-foreground rounded-full mt-1.5 shrink-0" />
                                    Damages to room inventory will be billed to account.
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            )}

            <div className="space-y-6 pt-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Available Rooms</h2>
                        <p className="text-sm text-muted-foreground">Select a room that fits your preference.</p>
                    </div>
                    {!user?.roomNumber && loadingRooms && (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Refreshing...</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {loadingRooms ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-64 rounded-3xl bg-muted animate-pulse" />
                        ))
                    ) : error ? (
                        <div className="col-span-full py-12 text-center apple-card border-none bg-red-50">
                            <p className="text-red-600 font-bold mb-4">Connection Failed: {error}</p>
                            <Button variant="outline" onClick={fetchRooms} className="rounded-xl border-red-200 text-red-600 hover:bg-red-100">
                                Try Reconnecting
                            </Button>
                        </div>
                    ) : rooms.length > 0 ? (
                        rooms.map((room) => {
                            const isMyRoom = user?.roomNumber === room.roomNumber;
                            const isFull = (room.occupants?.length || 0) >= room.capacity;

                            return (
                                <Card key={room._id} className={`apple-card border-none shadow-sm h-full group ${isMyRoom ? 'ring-2 ring-primary bg-primary/5' : 'bg-white'}`}>
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl font-bold">Room {room.roomNumber}</CardTitle>
                                                <CardDescription className="text-xs font-medium uppercase tracking-widest mt-1">Floor {room.floor} • Wing {room.roomNumber.charAt(0)}</CardDescription>
                                            </div>
                                            <Badge className={`rounded-xl px-3 py-1 font-bold ${room.type === 'AC' ? 'bg-blue-50 text-blue-600' : 'bg-neutral-50 text-neutral-600'} border-none`}>
                                                {room.type}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Occupancy</p>
                                                <div className="flex items-center gap-2 font-bold text-foreground">
                                                    <Users className="w-4 h-4 text-muted-foreground" />
                                                    {room.occupants?.length || 0} / {room.capacity}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Monthly Fee</p>
                                                <p className="text-2xl font-black text-primary italic leading-none mt-1">₹{room.type === 'AC' ? '8000' : '5000'}</p>
                                            </div>
                                        </div>
                                        
                                        {isMyRoom ? (
                                            <Button 
                                                className="w-full h-12 text-sm font-bold bg-green-50 text-green-600 border border-green-100 rounded-2xl shadow-none cursor-default"
                                                disabled
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Your Residence
                                            </Button>
                                        ) : isFull ? (
                                            <Button 
                                                className="w-full h-12 text-sm font-bold bg-muted text-muted-foreground rounded-2xl shadow-none cursor-not-allowed"
                                                disabled
                                            >
                                                Capacity Full
                                            </Button>
                                        ) : (
                                            <Button 
                                                className="w-full h-12 text-sm font-bold rounded-2xl transition-all shadow-none hover:shadow-lg hover:shadow-primary/20" 
                                                onClick={() => handleBookRoom(room)}
                                            >
                                                {user?.roomNumber ? "Request Switch" : "Proceed with Booking"}
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center apple-card border-dashed border-2 m-4 bg-muted/10 opacity-60">
                            <BedDouble className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-foreground">No Vacant Rooms</h3>
                            <p className="text-sm text-muted-foreground">Please contact administration for offline availability.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Receipt Modal */}
            <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                <DialogContent className="sm:max-w-md bg-white border-none p-0 overflow-hidden rounded-[2rem]">
                    <div className="p-8 space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight mt-4">Transaction Official</h2>
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">Validated Payment Receipt</p>
                        </div>

                        <div className="space-y-4 px-4">
                            <div className="flex justify-between items-center py-3 border-b border-border">
                                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Resident</span>
                                <span className="text-sm font-bold text-foreground uppercase">{user.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-border">
                                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Room Alloted</span>
                                <span className="text-sm font-bold text-foreground">Room {user.roomNumber}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-border">
                                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Reference</span>
                                <span className="text-sm font-mono truncate max-w-[100px]">{Math.random().toString(36).substring(7).toUpperCase()}</span>
                            </div>
                            <div className="py-6 flex flex-col items-center">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Total Amount Cleared</p>
                                <p className="text-4xl font-black text-primary italic tracking-tight">
                                    ₹{user.hostelBlock?.includes('AC') ? '8,000.00' : '5,000.00'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 px-4 pb-4">
                            <Button 
                                variant="outline" 
                                className="flex-1 h-12 rounded-2xl border-border hover:bg-muted font-bold gap-2 text-xs uppercase"
                                onClick={() => window.print()}
                            >
                                <Printer className="w-4 h-4" /> Print
                            </Button>
                            <Button className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 text-xs uppercase">
                                <Download className="w-4 h-4" /> Download
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 text-sm">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold text-foreground">{value}</span>
    </div>
);

export default RoomAllotment;
