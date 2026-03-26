import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useContext, useEffect, useState, useMemo } from "react";
import AuthContext from "@/context/AuthContext";
import { BedDouble, Building, Users, CheckCircle2, LogOut, MapPin, User as UserIcon, ShieldCheck, CreditCard, Calendar, Download, Printer, CheckCircle, Info, MessageSquare, ArrowRight, UserCircle, TrendingUp } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminRoomManagement from "@/components/AdminRoomManagement";
import { jsPDF } from "jspdf";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { useNotifications } from "@/context/NotificationContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ConfirmationModal } from "@/components/ConfirmationModal";

const RoomAllotment = () => {
    const { user, updateUser } = useContext(AuthContext);
    const { addNotification } = useNotifications();
    const [rooms, setRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [error, setError] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showAllAvailable, setShowAllAvailable] = useState(!user?.roomNumber);
    const [roommates, setRoommates] = useState([]);
    const [loadingRoommates, setLoadingRoommates] = useState(false);
    const [roomToBook, setRoomToBook] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const token = user?.token;

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

    const fetchRoommates = async () => {
        if (!user?.roomNumber || !token) return;
        setLoadingRoommates(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`/api/rooms/${user.roomNumber}/occupants`, config);
            // Filter out the current user
            setRoommates(data.filter(occupant => occupant._id !== user._id));
        } catch (error) {
            console.error("Error fetching roommates:", error);
        } finally {
            setLoadingRoommates(false);
        }
    };

    const recommendedRooms = useMemo(() => {
        if (!rooms || rooms.length === 0) return [];
        // Just pick 3 interesting options:
        // 1. Less crowded (most vacant slots)
        // 2. Best Budget (lowest price)
        // 3. Premium (AC with good occupancy)
        const sorted = [...rooms].filter(r => r.occupied < r.capacity);
        const budget = [...sorted].sort((a, b) => a.price - b.price)[0];
        const private_option = [...sorted].sort((a, b) => (a.capacity - a.occupied) - (b.capacity - b.occupied))[0];
        const premium = [...sorted].filter(r => r.type === 'AC').sort((a, b) => b.price - a.price)[0];

        return [
            { ...budget, recommend_tag: 'Best Budget', recommend_desc: 'Most economical choice.' },
            { ...private_option, recommend_tag: 'Quiet Room', recommend_desc: 'Maximum vacancy available.' },
            { ...premium, recommend_tag: 'Premium', recommend_desc: 'Top-tier amenities.' }
        ].filter((v, i, a) => a.findIndex(t => t?._id === v?._id) === i && v?._id);
    }, [rooms]);

    useEffect(() => {
        if (user?.role === 'student') {
            fetchRooms();
            if (user.roomNumber) {
                fetchRoommates();
            } else {
                setShowAllAvailable(true);
            }
        }
    }, [user, token]);
    
    const handleDownloadReceipt = () => {
        console.log("Generating receipt for:", user.name);
        const doc = new jsPDF();
        
        // Premium Header
        doc.setFillColor(79, 70, 229); // Accent color
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Hostel Receipt", 20, 25);
        
        // Receipt metadata
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Order ID: ${user._id?.toUpperCase()}`, 20, 32);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 25);
        
        // Reset color for body
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(12);
        
        // Recipient Details
        doc.setFont("helvetica", "bold");
        doc.text("Resident Details", 20, 60);
        doc.setLineWidth(0.5);
        doc.line(20, 63, 190, 63);
        
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${user.name}`, 20, 75);
        doc.text(`Student ID: ${user.studentId}`, 20, 85);
        doc.text(`Department: ${user.department || 'General'}`, 20, 95);
        
        // Property Details
        doc.setFont("helvetica", "bold");
        doc.text("Room Details", 20, 115);
        doc.line(20, 118, 190, 118);
        
        doc.setFont("helvetica", "normal");
        doc.text(`Hostel: ${user.hostelName || 'HostelHub Central'}`, 20, 130);
        doc.text(`Block: ${user.hostelBlock || 'Resident Block'}`, 20, 140);
        doc.text(`Room Number: ${user.roomNumber}`, 20, 150);
        
        // Payment Summary Table
        doc.setFillColor(243, 244, 246);
        doc.rect(20, 170, 170, 10, 'F');
        doc.setFont("helvetica", "bold");
        doc.text("Description", 25, 177);
        doc.text("Amount (INR)", 150, 177);
        
        doc.setFont("helvetica", "normal");
        doc.text("Standard Room Rent", 25, 190);
        doc.text("₹5,000.00", 150, 190);
        
        if (user.hostelBlock?.includes('AC')) {
            doc.text("Premium AC Facility", 25, 200);
            doc.text("₹3,000.00", 150, 200);
        }
        
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 210, 190, 210);
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL PAID", 25, 222);
        doc.text(`₹${user.hostelBlock?.includes('AC') ? '8,000.00' : '5,000.00'}`, 150, 222);
        
        // Footer
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("This is an electronically generated receipt and does not require a physical signature.", 105, 270, null, null, "center");
        doc.text("HostelHub Administration © 2026", 105, 276, null, null, "center");
        
        doc.save(`receipt_${user.studentId || user.name.replace(/\s+/g, '_')}.pdf`);
    };

    if (user?.role === 'admin' || user?.role === 'warden') {
        return <AdminRoomManagement />;
    }

    const handleBookRoom = (room) => {
        setRoomToBook(room);
        setIsBookingModalOpen(true);
    };

    const handleCheckout = () => {
        setIsCheckoutModalOpen(true);
    };

    const onBookConfirm = async () => {
        if (!roomToBook) return;
        const price = roomToBook.type === 'AC' ? 8000 : 5000;
        setBookingLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post("/api/rooms/book", {
                roomId: roomToBook._id,
                amount: price,
                paymentType: 'hostel_fee'
            }, config);

            addNotification({
                title: "Room Booked",
                message: `Room ${roomToBook.roomNumber} (${roomToBook.type}) is yours. Welcome!`,
                type: "success"
            });

            toast.success("Room Booked Successfully! Welcome to your new home.");
            if (data.user) {
                updateUser(data.user);
            }
            setIsBookingModalOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Booking error details:", error);
            toast.error(error.response?.data?.message || "Booking failed.");
        } finally {
            setBookingLoading(false);
        }
    };

    const onCheckoutConfirm = async () => {
        setCheckoutLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post("/api/rooms/checkout", {}, config);

            addNotification({
                title: "Checked Out",
                message: "Your room has been cancelled successfully.",
                type: "warning"
            });

            toast.success("Checked out successfully!");
            if (data.user) {
                updateUser(data.user);
            }
            setIsCheckoutModalOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(error.response?.data?.message || "Checkout failed");
        } finally {
            setCheckoutLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <ConfirmationModal 
                open={isBookingModalOpen}
                onOpenChange={setIsBookingModalOpen}
                title="Confirm Booking?"
                description={roomToBook ? `Are you sure you want to book Room ${roomToBook.roomNumber} (${roomToBook.type})? A fee of ₹${roomToBook.type === 'AC' ? 8000 : 5000} will apply.` : ""}
                onConfirm={onBookConfirm}
                confirmText="Book Room"
                cancelText="Cancel"
                loading={bookingLoading}
                variant="primary"
            />

            <ConfirmationModal 
                open={isCheckoutModalOpen}
                onOpenChange={setIsCheckoutModalOpen}
                title="Sure you want to leave?"
                description="This will cancel your room booking. You can't undo this action."
                onConfirm={onCheckoutConfirm}
                confirmText="Check Out"
                cancelText="Stay"
                loading={checkoutLoading}
                variant="destructive"
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-4">
                <div>
                    <h1 className="section-title">
                        My <span className="text-primary">{user?.roomNumber ? "Room" : "Selection"}</span>
                    </h1>
                    <p className="section-subtitle">View your room details or choose a new room.</p>
                </div>
                {user?.roomNumber && (
                    <Button 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 px-6 h-12 rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all border border-red-100/50 active:scale-95"
                        onClick={handleCheckout}
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Check Out
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
                                            Booked
                                        </Badge>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary/30 rounded-lg border border-border/40">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active</span>
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-bold tracking-tight text-foreground">Room {user.roomNumber}</h2>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.1em]">Order ID</p>
                                        <div className="px-2 py-0.5 bg-secondary/50 rounded font-mono text-[10px] border border-border/50 uppercase tracking-tighter">
                                            {user._id?.slice(-12)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 flex items-center gap-12 bg-secondary/10 relative z-10 min-w-[320px]">
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Monthly Fee</p>
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
                                    <Printer className="h-3.5 w-3.5 mr-2" /> Download Receipt
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
                                            <p className="text-[13px] font-semibold text-foreground">{user.hostelName || 'Hostel'}</p>
                                            <p className="text-[11px] text-muted-foreground">{user.hostelBlock || 'Not assigned'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-2xl border border-border/40 group hover:border-primary/30 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2.5 bg-white rounded-xl border border-border/50 text-muted-foreground group-hover:text-primary transition-colors">
                                                <ShieldCheck className="w-4.5 h-4.5" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-foreground">Warden</p>
                                                <p className="text-[11px] font-medium text-muted-foreground">Phone: +91 XXXXXXXX</p>
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
                                    <h3 className="text-[14px] font-semibold text-foreground">Student Details</h3>
                                </div>
                                <div className="space-y-3">
                                    <DetailRow label="Department" value={user.department || 'General'} />
                                    <DetailRow label="Student ID" value={user.studentId || 'NOT SET'} />
                                    <DetailRow label="Joined On" value={new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} />
                                </div>
                            </Card>
                        </div>

                        <Card className="premium-card bg-white p-6 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Users className="w-4 h-4" />
                                </div>
                                <h3 className="text-[14px] font-bold text-foreground">Roommates</h3>
                            </div>
                            
                            {loadingRoommates ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-12 bg-secondary/30 rounded-xl" />
                                    <div className="h-12 bg-secondary/30 rounded-xl" />
                                </div>
                            ) : roommates.length > 0 ? (
                                <div className="space-y-3">
                                    {roommates.map((mate) => (
                                        <div key={mate._id} className="flex items-center gap-4 p-3.5 bg-secondary/5 rounded-2xl border border-border/20 group hover:border-primary/30 transition-all">
                                            <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                                <UserCircle className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-bold text-foreground truncate">{mate.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{mate.studentId} • {mate.department || 'General'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 space-y-3">
                                    <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center mx-auto text-muted-foreground/40 border border-dashed border-border">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <p className="text-[12px] text-muted-foreground font-medium px-4">
                                        No roommates assigned yet. They will appear here once added.
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="premium-card bg-white p-6">
                            <h3 className="text-[14px] font-semibold text-foreground mb-4">Payment</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-emerald-50/50 flex items-center justify-between border border-emerald-100/50">
                                    <div>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Status</p>
                                        <p className="text-[15px] font-bold text-foreground">Paid</p>
                                    </div>
                                    <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="space-y-2.5 px-0.5">
                                    <div className="flex justify-between text-[12px]">
                                        <span className="text-muted-foreground">Rent</span>
                                        <span className="font-semibold text-foreground">₹5,000.00</span>
                                    </div>
                                    {user.hostelBlock?.includes('AC') && (
                                        <div className="flex justify-between text-[12px]">
                                            <span className="text-muted-foreground">Premium Fee</span>
                                            <span className="font-semibold text-foreground">₹3,000.00</span>
                                        </div>
                                    )}
                                    <div className="pt-3 mt-1 border-t border-dashed border-border flex justify-between text-[14px] font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">₹{user.hostelBlock?.includes('AC') ? '8,000.00' : '5,000.00'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="premium-card bg-secondary/20 p-5">
                            <div className="flex items-center gap-2 mb-3 text-primary">
                                <Info className="w-4 h-4" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">Rules</span>
                            </div>
                            <ul className="space-y-2.5">
                                <li className="text-[11px] leading-relaxed text-muted-foreground flex gap-2">
                                    <div className="w-1 h-1 bg-primary/40 rounded-full mt-1.5 shrink-0" />
                                    Please check out before leaving your room.
                                </li>
                                <li className="text-[11px] leading-relaxed text-muted-foreground flex gap-2">
                                    <div className="w-1 h-1 bg-primary/40 rounded-full mt-1.5 shrink-0" />
                                    Any damages will be charged to your account.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 
                            className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3"
                        >
                            <div className="w-1.5 h-8 bg-primary rounded-full" />
                            Available Rooms
                        </h2>
                        <p className="text-sm text-muted-foreground ml-4">View and request available rooms.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {user?.roomNumber && (
                            <Button 
                                variant="outline" 
                                onClick={() => setShowAllAvailable(!showAllAvailable)}
                                className="h-10 px-5 rounded-xl text-[11px] font-bold uppercase tracking-widest border-border/60 hover:bg-secondary/20 transition-all active:scale-95"
                            >
                                {showAllAvailable ? "Hide Rooms" : "See Others"}
                            </Button>
                        )}
                        {!user?.roomNumber && loadingRooms && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg">
                                <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Updating</span>
                            </div>
                        )}
                    </div>
                </div>

                {showAllAvailable && (
                    <div className="space-y-12">
                        {/* Smart Recommendations Section */}
                        {recommendedRooms.length > 0 && !user?.roomNumber && (
                            <section className="animate-in fade-in slide-in-from-top-4 duration-700">
                                <div className="flex items-center justify-between mb-8 px-1">
                                    <div>
                                        <h2 className="text-[17px] font-black text-foreground tracking-tight flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-primary" /> Selected for you
                                        </h2>
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Hand-picked rooms based on your profile.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {recommendedRooms.map((room) => (
                                        <Card key={`rec-${room._id}`} className="premium-card bg-primary/[0.03] border-primary/20 p-6 relative overflow-hidden group hover:scale-[1.02] transition-all">
                                            <div className="absolute top-0 right-0 p-3">
                                                <Badge className="bg-primary text-white text-[9px] font-black uppercase tracking-widest border-none px-2 rounded-md shadow-lg shadow-primary/20">
                                                    {room.recommend_tag}
                                                </Badge>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-black text-foreground">Room {room.roomNumber}</h3>
                                                    <p className="text-[11px] text-muted-foreground font-medium italic opacity-80 leading-snug">"{room.recommend_desc}"</p>
                                                </div>
                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center gap-2 text-[12px] font-bold text-foreground">
                                                        <Users className="w-3.5 h-3.5 text-primary" />
                                                        {room.occupants?.length || 0}/{room.capacity} Slots
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        className="h-9 px-4 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10 rounded-xl flex items-center gap-2"
                                                        onClick={() => handleBookRoom(room)}
                                                    >
                                                        View <ArrowRight className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Interactive Floor Map Section */}
                        <section className="animate-in fade-in duration-1000">
                            <div className="flex items-center justify-between mb-8 px-1">
                                <div>
                                    <h2 className="text-[17px] font-black text-foreground tracking-tight flex items-center gap-2">
                                        <Building className="h-4 w-4 text-primary" /> Floor Plan
                                    </h2>
                                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Room map for each floor.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Vacant</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Partial</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-200" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Occupied</span>
                                    </div>
                                </div>
                            </div>
                            
                            <Card className="premium-card bg-white p-8 border-border/60 overflow-x-auto shadow-sm">
                                <div className="flex flex-col gap-10 min-w-[600px]">
                                    {[1, 2, 3].map((floor) => (
                                        <div key={`floor-${floor}`} className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Badge className="h-7 w-12 flex items-center justify-center bg-secondary/50 text-foreground font-black text-[11px] rounded-lg border-none">
                                                    Floor {floor}
                                                </Badge>
                                                <div className="h-px bg-slate-100 flex-1" />
                                            </div>
                                            <div className="grid grid-cols-10 gap-3">
                                                {rooms.filter(r => r.floor === floor).map(room => {
                                                    const occupancy = (room.occupants?.length || 0);
                                                    const statusColor = occupancy === 0 ? 'bg-emerald-500' : occupancy >= room.capacity ? 'bg-red-500' : 'bg-amber-500';
                                                    return (
                                                        <motion.button
                                                            key={`map-${room._id}`}
                                                            whileHover={{ scale: 1.1, y: -2 }}
                                                            onClick={() => handleBookRoom(room)}
                                                            className={`h-11 rounded-xl flex items-center justify-center text-[11px] font-black text-white shadow-lg transition-all ${statusColor} ring-offset-4 hover:ring-2 ring-primary/20`}
                                                        >
                                                            {room.roomNumber}
                                                        </motion.button>
                                                    );
                                                })}
                                                {rooms.filter(r => r.floor === floor).length === 0 && (
                                                    <div className="col-span-full py-4 text-center opacity-20">
                                                        <p className="text-[10px] font-black tracking-widest uppercase">No rooms on this level</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </section>

                        <div className="h-px bg-border/50 mx-4" />

                        <div className="flex items-center justify-between px-1">
                            <div>
                                <h2 className="text-[17px] font-black text-foreground tracking-tight">Available Rooms</h2>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{rooms.length} rooms found.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-700 pb-20">
                    {loadingRooms ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-56 rounded-2xl bg-muted animate-pulse border border-border/50" />
                        ))
                    ) : error ? (
                        <div className="col-span-full py-16 text-center premium-card bg-red-50/50 border-red-100">
                            <p className="text-red-600 font-semibold mb-4 text-sm">Can't connect: {error}</p>
                            <Button variant="outline" onClick={fetchRooms} className="rounded-xl border-red-200 text-red-600 hover:bg-red-100 text-[12px] h-9">
                                Try Again
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
                                                    Floor {room.floor} • Block {room.roomNumber.charAt(0)}
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
                                                Your Room
                                            </Button>
                                        ) : isFull ? (
                                            <Button 
                                                className="w-full h-11 text-[13px] font-semibold bg-muted text-muted-foreground rounded-xl shadow-none cursor-not-allowed border border-border/50"
                                                disabled
                                            >
                                                Full
                                            </Button>
                                        ) : (
                                            <Button 
                                                className="w-full h-11 text-[13px] font-semibold btn-primary rounded-xl" 
                                                onClick={() => handleBookRoom(room)}
                                            >
                                                {user?.roomNumber ? "Change Room" : "Book Now"}
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center premium-card border-dashed border-2 m-4 bg-secondary/10">
                            <BedDouble className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-[15px] font-semibold text-foreground">No Rooms Available</h3>
                            <p className="text-[12px] text-muted-foreground">Ask the office for more info.</p>
                        </div>
                    )}
                        </div>
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
                            <h2 className="text-xl font-bold tracking-tight mt-4">Payment Successful</h2>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-none">Official Receipt</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2.5 border-b border-border">
                                <span className="text-[11px] text-muted-foreground font-semibold uppercase">Resident</span>
                                <span className="text-[13px] font-bold text-foreground">{user.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-border">
                                <span className="text-[11px] text-muted-foreground font-semibold uppercase">Room</span>
                                <span className="text-[13px] font-bold text-foreground">Room {user.roomNumber}</span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-border">
                                <span className="text-[11px] text-muted-foreground font-semibold uppercase">Order ID</span>
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
                            <Button 
                                className="h-11 rounded-xl btn-primary font-bold gap-2 text-[12px]"
                                onClick={handleDownloadReceipt}
                            >
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
