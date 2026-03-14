const User = require('../models/User');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const Payment = require('../models/Payment');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Students
        const totalStudents = await User.countDocuments({ role: 'student' });

        // 2. Room Occupancy
        const rooms = await Room.find();
        const totalCapacity = rooms.reduce((acc, room) => acc + room.capacity, 0);
        const totalOccupied = rooms.reduce((acc, room) => acc + room.occupants.length, 0);
        const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

        // 3. Pending Complaints
        const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

        // 4. Revenue (This Month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const payments = await Payment.find({
            createdAt: { $gte: startOfMonth },
            status: 'paid'
        });

        const monthlyRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);

        res.json({
            totalStudents,
            occupancy: {
                occupied: totalOccupied,
                capacity: totalCapacity,
                rate: occupancyRate
            },
            pendingComplaints,
            monthlyRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
