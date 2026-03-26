const Room = require('../models/Room');
const User = require('../models/User');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');
const { createAndSendNotification } = require('./notificationController');

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
        
        if (mongoose.Types.ObjectId.isValid(studentId)) {
            student = await User.findById(studentId);
        }
        
        if (!student) {
            const queryId = !isNaN(studentId) ? Number(studentId) : studentId;
            student = await User.findOne({ studentId: queryId });
        }

        if (!room || !student) {
            return res.status(404).json({ message: 'Target mismatch: Ensure you are using the correct numeric Student ID.' });
        }

        if (room.occupants.length >= room.capacity) {
            return res.status(400).json({ message: 'Unit capacity reached' });
        }

        if (room.occupants.some(id => id.toString() === student._id.toString())) {
            return res.status(400).json({ message: 'Member already allocated to this unit' });
        }

        const existingRoom = await Room.findOne({ occupants: student._id });
        if (existingRoom) {
            return res.status(400).json({ message: `Member is already assigned to Unit ${existingRoom.roomNumber}` });
        }

        room.occupants.push(student._id);
        await room.save();

        student.roomNumber = room.roomNumber;
        student.hostelBlock = room.hostelBlock || 'Main Block';
        student.hostelName = room.hostelName || 'Boys Hostel';
        await student.save();

        // Notify student about room allotment
        createAndSendNotification({
            recipient: student._id,
            sender: req.user._id,
            title: "Room Allotted",
            message: `You have been allotted Room ${room.roomNumber} in ${student.hostelName}.`,
            type: "room",
            link: "/room-allotment"
        });

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: "Infrastructure error during allocation: " + error.message });
    }
};

// @desc    Book a room with payment
// @route   POST /api/rooms/book
// @access  Private (Student)
const bookRoom = async (req, res) => {
    const { roomId, amount, paymentType } = req.body;
    const userId = req.user._id;

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
        student.hostelBlock = room.hostelBlock;
        student.hostelName = room.hostelName;
        await student.save();

        // Notify student of success
        createAndSendNotification({
            recipient: userId,
            sender: userId,
            title: "Room Booked",
            message: `Room ${room.roomNumber} successfully booked. Payment confirmed.`,
            type: "success",
            link: "/room-allotment"
        });

        // Notify Wardens/Admins
        const staff = await User.find({ role: { $in: ['admin', 'warden'] } });
        staff.forEach(user => {
            createAndSendNotification({
                recipient: user._id,
                sender: userId,
                title: "New Room Booking",
                message: `${student.name} booked Room ${room.roomNumber}.`,
                type: "room",
                link: `/admin/rooms`
            });
        });

        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
        const updatedUser = { ...student.toObject(), token };
        delete updatedUser.password;

        res.status(200).json({ message: 'Room booked successfully', room, user: updatedUser });

    } catch (error) {
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

        const roomNum = student.roomNumber;
        const room = await Room.findOne({ roomNumber: roomNum });
        if (room) {
            room.occupants = room.occupants.filter(id => id.toString() !== userId.toString());
            await room.save();
        }

        student.roomNumber = undefined;
        student.hostelBlock = undefined;
        student.hostelName = undefined;
        await student.save();

        // Notify Wardens/Admins
        const staff = await User.find({ role: { $in: ['admin', 'warden'] } });
        staff.forEach(user => {
            createAndSendNotification({
                recipient: user._id,
                sender: userId,
                title: "Room Checkout",
                message: `${student.name} has checked out of Room ${roomNum}.`,
                type: "info",
                link: `/admin/rooms`
            });
        });

        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
        const updatedUser = { ...student.toObject(), token };
        delete updatedUser.password;

        res.status(200).json({ message: 'Checked out successfully', user: updatedUser });

    } catch (error) {
        res.status(400).json({ message: error.message || 'Checkout failed' });
    }
};

// @desc    Get occupants of a specific room
// @route   GET /api/rooms/:roomNumber/occupants
// @access  Private
const getRoomOccupants = async (req, res) => {
    try {
        const room = await Room.findOne({ roomNumber: req.params.roomNumber })
            .populate('occupants', 'name studentId department');
        
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json(room.occupants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createRoom, getAllRooms, allocateRoom, bookRoom, checkoutRoom, getRoomOccupants };
