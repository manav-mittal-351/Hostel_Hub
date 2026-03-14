import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, BedDouble, CheckCircle2, XCircle, Search, Filter, ShieldPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminRoomManagement = () => {
    const { user } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRoom, setNewRoom] = useState({ roomNumber: '', capacity: 3, floor: 1, type: 'Non-AC' });
    const [allocateData, setAllocateData] = useState({ roomId: '', studentId: '' });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/rooms', config);
            setRooms(data);
        } catch (error) {
            console.error("Error fetching rooms", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault(); 
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/rooms', newRoom, config);
            setNewRoom({ roomNumber: '', capacity: 3, floor: 1, type: 'Non-AC' });
            fetchRooms();
        } catch (error) {
            console.error("Error creating room", error);
            alert("Error creating room");
        }
    };

    const handleAllocate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/rooms/${allocateData.roomId}/allocate`, { studentId: allocateData.studentId }, config);
            setAllocateData({ roomId: '', studentId: '' });
            fetchRooms();
            alert("Room allocated successfully");
        } catch (error) {
            console.error("Error allocating room", error);
            alert("Error allocating room");
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Room Card */}
                <Card className="apple-card border-none bg-white shadow-sm overflow-hidden">
                    <CardHeader className="bg-[#1D1D1F] text-white p-8">
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" /> Initialize New Room
                        </CardTitle>
                        <CardDescription className="text-white/60">Register a new room unit into the registry.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleCreateRoom} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Room No</Label>
                                    <Input 
                                        className="bg-[#F5F5F7] border-none rounded-xl h-12 focus:ring-2 focus:ring-primary/20"
                                        placeholder="E.g. 101"
                                        value={newRoom.roomNumber} 
                                        onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Capacity</Label>
                                    <Input 
                                        type="number"
                                        className="bg-[#F5F5F7] border-none rounded-xl h-12 focus:ring-2 focus:ring-primary/20"
                                        value={newRoom.capacity} 
                                        onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Floor</Label>
                                    <Input 
                                        type="number"
                                        className="bg-[#F5F5F7] border-none rounded-xl h-12 focus:ring-2 focus:ring-primary/20"
                                        value={newRoom.floor} 
                                        onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Type</Label>
                                    <div className="flex gap-4 mt-2">
                                        {['Non-AC', 'AC'].map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                                <input 
                                                    type="radio" 
                                                    name="type"
                                                    value={type} 
                                                    className="hidden"
                                                    checked={newRoom.type === type} 
                                                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} 
                                                />
                                                <div className={`px-4 py-2 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${
                                                    newRoom.type === type ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/30 border-transparent text-muted-foreground group-hover:bg-muted/50'
                                                }`}>
                                                    {type}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-black transition-all font-bold">Register Room</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Allocation Card */}
                <Card className="apple-card border-none bg-white shadow-sm overflow-hidden">
                    <CardHeader className="bg-primary text-white p-8">
                        <CardTitle className="flex items-center gap-2">
                            <ShieldPlus className="h-5 w-5" /> Direct Allocation
                        </CardTitle>
                        <CardDescription className="text-white/60">Manually assign a student to a specific room.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleAllocate} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Select Room</Label>
                                <select
                                    className="w-full bg-[#F5F5F7] border-none rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                                    value={allocateData.roomId}
                                    onChange={(e) => setAllocateData({ ...allocateData, roomId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose available room...</option>
                                    {rooms.filter(r => r.occupants.length < r.capacity).map(r => (
                                        <option key={r._id} value={r._id}>Room {r.roomNumber} ({r.type}) - {r.capacity - r.occupants.length} slots left</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Student MongoDB ID</Label>
                                <Input
                                    className="bg-[#F5F5F7] border-none rounded-xl h-12 focus:ring-2 focus:ring-primary/20"
                                    placeholder="Enter full database ID"
                                    value={allocateData.studentId}
                                    onChange={(e) => setAllocateData({ ...allocateData, studentId: e.target.value })}
                                    required
                                />
                                <p className="text-[10px] text-muted-foreground italic pl-1">ID can be found in the global user registry.</p>
                            </div>
                            <Button type="submit" className="w-full h-12 rounded-xl bg-[#1D1D1F] hover:bg-black transition-all font-bold mt-4 shadow-xl shadow-black/10">Authorize Allocation</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Global Registry</h2>
                        <p className="text-sm text-[#86868B] font-medium">Monitoring {rooms.length} room units across {new Set(rooms.map(r => r.floor)).size} floors.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-48 rounded-[2rem] bg-muted/30 animate-pulse" />
                        ))
                    ) : rooms.map(room => (
                        <Card key={room._id} className="apple-card border-none bg-white shadow-sm group hover:shadow-md transition-all overflow-hidden">
                            <div className={`h-1.5 w-full ${room.occupants.length >= room.capacity ? 'bg-red-500' : 'bg-green-500'}`} />
                            <CardHeader className="p-6 pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-bold">Room {room.roomNumber}</CardTitle>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Floor {room.floor}</p>
                                    </div>
                                    <Badge className={`${room.type === 'AC' ? 'bg-blue-50 text-blue-600' : 'bg-neutral-50 text-neutral-600'} border-none text-[9px] font-black uppercase tracking-[0.1em]`}>
                                        {room.type}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <div className="flex items-center justify-between text-sm py-3 border-b border-[#F5F5F7]">
                                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                                        <Users className="h-3 w-3" /> Occupancy
                                    </span>
                                    <span className={`font-black italic ${room.occupants.length >= room.capacity ? 'text-red-500' : 'text-green-500'}`}>
                                        {room.occupants.length}/{room.capacity}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest pl-1">Residents</p>
                                    <div className="space-y-1.5 min-h-[40px]">
                                        {room.occupants.length > 0 ? (
                                            room.occupants.map(occ => (
                                                <div key={occ._id} className="text-[11px] font-bold text-[#1D1D1F] flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    {occ.name}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[11px] text-muted-foreground/50 italic">Room is currently vacant</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminRoomManagement;
