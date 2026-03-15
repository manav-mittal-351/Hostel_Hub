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
            alert("Room created successfully");
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
        <div className="space-y-10 animate-in fade-in duration-1000">
            <header className="border-b border-border/50 pb-2">
                <h1 className="section-title">Residential Unit Engineering</h1>
                <p className="section-subtitle">Initialize inventory parameters and manage resident environmental assignments.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Room Card */}
                <Card className="premium-card bg-white p-0 overflow-hidden">
                    <CardHeader className="px-7 py-6 border-b border-border bg-secondary/30">
                        <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                            <Plus className="h-4 w-4 text-primary" /> Initialize Room Unit
                        </CardTitle>
                        <CardDescription className="text-[12px]">Register a new room into the central registry.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-7">
                        <form onSubmit={handleCreateRoom} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Room Number</Label>
                                    <Input 
                                        className="h-11 px-4 text-[13px] bg-secondary/20 border-border/50 focus:bg-white transition-all rounded-xl"
                                        placeholder="E.g. 101"
                                        value={newRoom.roomNumber} 
                                        onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Max Capacity</Label>
                                    <Input 
                                        type="number"
                                        className="h-11 px-4 text-[13px] bg-secondary/20 border-border/50 focus:bg-white transition-all rounded-xl"
                                        value={newRoom.capacity} 
                                        onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Floor Level</Label>
                                    <Input 
                                        type="number"
                                        className="h-11 px-4 text-[13px] bg-secondary/20 border-border/50 focus:bg-white transition-all rounded-xl"
                                        value={newRoom.floor} 
                                        onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Environment</Label>
                                    <div className="flex gap-2 mt-1">
                                        {['Non-AC', 'AC'].map((type) => (
                                            <label key={type} className="flex-1 cursor-pointer group">
                                                <input 
                                                    type="radio" 
                                                    name="type"
                                                    value={type} 
                                                    className="hidden"
                                                    checked={newRoom.type === type} 
                                                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} 
                                                />
                                                <div className={`h-11 flex items-center justify-center rounded-xl border text-[12px] font-semibold transition-all ${
                                                    newRoom.type === type ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-border/50 text-muted-foreground hover:bg-secondary/50'
                                                }`}>
                                                    {type}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-11 btn-primary text-[13px] font-semibold">Register Unit</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Allocation Card */}
                <Card className="premium-card bg-white p-0 overflow-hidden">
                    <CardHeader className="px-7 py-6 border-b border-border bg-secondary/30">
                        <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                            <ShieldPlus className="h-4 w-4 text-primary" /> Direct Allocation
                        </CardTitle>
                        <CardDescription className="text-[12px]">Manually assign resident to a specific room unit.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-7">
                        <form onSubmit={handleAllocate} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Choose Room Unit</Label>
                                <select
                                    className="w-full h-11 px-4 text-[13px] bg-secondary/20 border border-border/50 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%20xmlns%3D%220%200%2010%206%22%3E%3Cpath%20d%3D%22M1%201L5%205L9%201%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:10px] bg-[right_1rem_center] bg-no-repeat"
                                    value={allocateData.roomId}
                                    onChange={(e) => setAllocateData({ ...allocateData, roomId: e.target.value })}
                                    required
                                >
                                    <option value="">Select available unit...</option>
                                    {rooms.filter(r => r.occupants.length < r.capacity).map(r => (
                                        <option key={r._id} value={r._id}>Room {r.roomNumber} ({r.type}) — {r.capacity - r.occupants.length} slots available</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-muted-foreground ml-1">Student System ID</Label>
                                <Input
                                    className="h-11 px-4 text-[13px] bg-secondary/20 border-border/50 focus:bg-white transition-all rounded-xl"
                                    placeholder="Paste database reference ID"
                                    value={allocateData.studentId}
                                    onChange={(e) => setAllocateData({ ...allocateData, studentId: e.target.value })}
                                    required
                                />
                                <p className="text-[10px] text-muted-foreground pl-1 italic">Reference ID can be found in the global records registry.</p>
                            </div>
                            <Button type="submit" className="w-full h-11 btn-primary text-[13px] font-semibold mt-4">Execute Allocation</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[17px] font-semibold text-foreground tracking-tight">Active Room Inventory</h2>
                        <p className="text-sm text-muted-foreground font-medium">Monitoring {rooms.length} units across {new Set(rooms.map(r => r.floor)).size} floor levels.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-48 rounded-2xl bg-muted/30 animate-pulse border border-border/50" />
                        ))
                    ) : rooms.map(room => (
                        <Card key={room._id} className="premium-card bg-white group hover:border-primary/30 transition-all overflow-hidden p-0">
                            <div className={`h-1 w-full ${room.occupants.length >= room.capacity ? 'bg-red-400' : 'bg-emerald-400'}`} />
                            <CardHeader className="p-5 pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-[15px] font-bold">Room {room.roomNumber}</CardTitle>
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Level {room.floor}</p>
                                    </div>
                                    <Badge className={`${room.type === 'AC' ? 'bg-primary/5 text-primary' : 'bg-muted text-muted-foreground'} border-none text-[9px] font-bold uppercase`}>
                                        {room.type}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 space-y-4">
                                <div className="flex items-center justify-between text-[12px] py-2.5 border-b border-border/50">
                                    <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Users className="h-3 w-3" /> Status
                                    </span>
                                    <span className={`font-bold ${room.occupants.length >= room.capacity ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {room.occupants.length}/{room.capacity} Full
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Residents</p>
                                    <div className="space-y-1.5 min-h-[40px]">
                                        {room.occupants.length > 0 ? (
                                            room.occupants.map(occ => (
                                                <div key={occ._id} className="text-[11px] font-medium text-foreground flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                                                    {occ.name}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[11px] text-muted-foreground/50 italic py-1">Unit is currently vacant</p>
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
