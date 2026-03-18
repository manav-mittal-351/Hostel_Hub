const Room = require('../models/Room');
const User = require('../models/User');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private (Admin)
const createRoom = async (req, res) => {
    const { roomNumber, capacity, floor, type } = req.body;

    try {
        const roomExists = await Room.findOne({ roomNumber });
        if (roomExists) {
            return res.status(400).json({ message: 'Room already exists' });
        }

        const room = await Room.create({
            roomNumber,
            capacity,
            floor,
            type,
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private (Admin/Warden)
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('occupants', 'name email').sort({ roomNumber: 1 });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Allocate room to student
// @route   PUT /api/rooms/:id/allocate
// @access  Private (Admin)
const allocateRoom = async (req, res) => {
    const { studentId } = req.body;

    try {
        const room = await Room.findById(req.params.id);
        let student;
        
        // Try searching by _id first, then by studentId property
        if (mongoose.Types.ObjectId.isValid(studentId)) {
            student = await User.findById(studentId);
        }
        
        if (!student) {
            student = await User.findOne({ studentId: studentId });
        }

        if (!room || !student) {
            return res.status(404).json({ message: 'Room or Student not found. Please ensure you are using a valid Student ID (e.g., STU-001) or System Reference ID.' });
        }

        if (room.occupants.length >= room.capacity) {
            return res.status(400).json({ message: 'Room is full' });
        }

        if (room.occupants.includes(studentId)) {
            return res.status(400).json({ message: 'Student already in this room' });
        }

        // Check if student already has a room
        const existingRoom = await Room.findOne({ occupants: studentId });
        if (existingRoom) {
            // Optional: Remove from old room or throw error
            return res.status(400).json({ message: `Student already assigned to room ${existingRoom.roomNumber}` });
        }

        room.occupants.push(studentId);
        await room.save();

        student.roomNumber = room.roomNumber;
        student.hostelBlock = 'Main Block'; // Default or dynamic
        await student.save();

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Book a room with payment
// @route   POST /api/rooms/book
// @access  Private (Student)
const bookRoom = async (req, res) => {
    const { roomId, amount, paymentType } = req.body;
    const userId = req.user._id;

    console.log(`Booking attempt by user ${userId} for room ${roomId}`);

    try {
        const room = await Room.findById(roomId);
        const student = await User.findById(userId);

        if (!room) return res.status(404).json({ message: 'Room not found' });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        if (room.occupants.length >= room.capacity) return res.status(400).json({ message: 'Room is full' });
        if (room.occupants.includes(userId)) return res.status(400).json({ message: 'You are already in this room' });
        if (student.roomNumber) return res.status(400).json({ message: 'You already have a room allotted' });

        // 1. Create Payment Record
        await Payment.create({
            student: userId,
            type: paymentType || 'hostel_fee',
            amount: amount,
            status: 'paid',
            dueDate: new Date(),
            paymentDate: new Date(),
            description: `Room Booking: Room ${room.roomNumber}`
        });

        // 2. Allocate Room
        room.occupants.push(userId);
        await room.save();

        // 3. Update User Profile
        student.roomNumber = room.roomNumber;
        student.hostelBlock = room.type === 'AC' ? 'Main Block (AC)' : 'Main Block (Non-AC)';
        student.hostelName = 'Boys Hostel';
        await student.save();

        console.log(`Booking successful for user ${userId}`);

        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
        const updatedUser = { ...student.toObject(), token };
        delete updatedUser.password;

        res.status(200).json({ message: 'Room booked successfully', room, user: updatedUser });

    } catch (error) {
        console.error('Room booking error:', error);
        res.status(400).json({ message: error.message || 'Room booking failed' });
    }
};

// @desc    Checkout from room
// @route   POST /api/rooms/checkout
// @access  Private (Student)
const checkoutRoom = async (req, res) => {
    const userId = req.user._id;

    try {
        const student = await User.findById(userId);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        if (!student.roomNumber) return res.status(400).json({ message: 'You do not have a room allotted' });

        const room = await Room.findOne({ roomNumber: student.roomNumber });
        if (room) {
            room.occupants = room.occupants.filter(id => id.toString() !== userId.toString());
            await room.save();
        }

        student.roomNumber = undefined;
        student.hostelBlock = undefined;
        student.hostelName = undefined;
        await student.save();

        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
        const updatedUser = { ...student.toObject(), token };
        delete updatedUser.password;

        res.status(200).json({ message: 'Checked out successfully', user: updatedUser });

    } catch (error) {
        console.error('Checkout error:', error);
        res.status(400).json({ message: error.message || 'Checkout failed' });
    }
};

module.exports = { createRoom, getAllRooms, allocateRoom, bookRoom, checkoutRoom };
