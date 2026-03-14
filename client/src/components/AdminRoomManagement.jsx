import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminRoomManagement = () => {
    const { user } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ roomNumber: '', capacity: 3, floor: 1, type: 'Non-AC' });
    const [allocateData, setAllocateData] = useState({ roomId: '', studentId: '' });

    // Fetch all students for allocation dropdown (simplified for now)
    // ideally we should fetch students who don't have a room.

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/rooms', config);
            setRooms(data);
        } catch (error) {
            console.error("Error fetching rooms", error);
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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Add New Room</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Room No</Label>
                                    <Input value={newRoom.roomNumber} onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })} required />
                                </div>
                                <div>
                                    <Label>Capacity</Label>
                                    <Input type="number" value={newRoom.capacity} onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })} required />
                                </div>
                                <div>
                                    <Label>Floor</Label>
                                    <Input type="number" value={newRoom.floor} onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })} required />
                                </div>
                                <div>
                                    <Label>Type</Label>
                                    <div className="flex gap-4 mt-2">
                                        <label className="flex items-center gap-2">
                                            <input type="radio" value="Non-AC" checked={newRoom.type === 'Non-AC'} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} /> Non-AC
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" value="AC" checked={newRoom.type === 'AC'} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} /> AC
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <Button type="submit">Create Room</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Allocate Room</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleAllocate} className="space-y-4">
                            <div>
                                <Label>Select Room</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={allocateData.roomId}
                                    onChange={(e) => setAllocateData({ ...allocateData, roomId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Room</option>
                                    {rooms.filter(r => r.occupants.length < r.capacity).map(r => (
                                        <option key={r._id} value={r._id}>{r.roomNumber} ({r.type})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label>Student ID</Label>
                                <Input
                                    placeholder="Enter Student ID"
                                    value={allocateData.studentId}
                                    onChange={(e) => setAllocateData({ ...allocateData, studentId: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">Copy ID from user list (to be implemented)</p>
                            </div>
                            <Button type="submit">Allocate</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-bold text-primary">All Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {rooms.map(room => (
                    <Card key={room._id} className={room.occupants.length >= room.capacity ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between">
                                <CardTitle className="text-lg">Room {room.roomNumber}</CardTitle>
                                <span className="text-xs font-mono bg-white px-2 py-1 rounded border">{room.type}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-sm mt-2">
                                <p>Floor: {room.floor}</p>
                                <p>Occupants: {room.occupants.length} / {room.capacity}</p>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                                {room.occupants.map(occ => (
                                    <div key={occ._id}>- {occ.name}</div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminRoomManagement;
