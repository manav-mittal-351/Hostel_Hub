const User = require('../models/User');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const Payment = require('../models/Payment');
const GatePass = require('../models/GatePass');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        // 1. Get all active student IDs to ensure we only count real data
        const students = await User.find({ role: 'student' }).select('_id');
        const studentIds = students.map(s => s._id.toString());
        const totalStudents = students.length;

        // 2. Room Occupancy
        const rooms = await Room.find();
        let totalCapacity = 0;
        let totalOccupied = 0;

        rooms.forEach(room => {
            totalCapacity += room.capacity;
            // Only count occupants that are in our valid student list
            const validOccupants = room.occupants.filter(occId => 
                occId && studentIds.includes(occId.toString())
            );
            totalOccupied += validOccupants.length;
        });

        const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

        // 3. Pending Complaints
        // Only count complaints from valid students
        const pendingComplaints = await Complaint.countDocuments({ 
            status: 'pending',
            student: { $in: studentIds }
        });

        // 4. Revenue (This Month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const payments = await Payment.find({
            createdAt: { $gte: startOfMonth },
            status: 'paid',
            student: { $in: studentIds } // Only count payments from existing students
        });

        const monthlyRevenue = payments.reduce((acc, payment) => acc + (payment.amount || 0), 0);

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

const getRecentActivities = async (req, res) => {
    try {
        // 1. Recent Student Registrations (Admissions)
        const recentStudents = await User.find({ role: 'student' })
            .sort({ createdAt: -1 })
            .limit(4)
            .select('name email createdAt');

        // 2. Recent Complaints
        const recentComplaints = await Complaint.find()
            .populate('student', 'name')
            .sort({ createdAt: -1 })
            .limit(4);

        // 3. Recent GatePasses
        const recentGatePasses = await GatePass.find()
            .populate('student', 'name')
            .sort({ createdAt: -1 })
            .limit(4);

        // 4. Recent Payments
        const recentPayments = await Payment.find({ status: 'paid' })
            .populate('student', 'name')
            .sort({ createdAt: -1 })
            .limit(4);

        // Combine and format these as "Activities"
        const activities = [
            ...recentStudents.map(s => ({
                id: s._id,
                type: 'registration',
                text: `${s.name} was enrolled as a resident student.`,
                time: s.createdAt,
                label: 'Admission'
            })),
            ...recentComplaints.map(c => ({
                id: c._id,
                type: 'complaint',
                text: `${c.student?.name || 'A student'} raised a new complaint: "${c.title}".`,
                time: c.createdAt,
                label: 'Complaint'
            })),
            ...recentGatePasses.map(g => ({
                id: g._id,
                type: 'gatepass',
                text: `${g.student?.name || 'A student'} applied for a ${g.type} gatepass.`,
                time: g.createdAt,
                label: 'Access Request'
            })),
            ...recentPayments.map(p => ({
                id: p._id,
                type: 'payment',
                text: `Fee payment of ₹${p.amount} confirmed for ${p.student?.name || 'a student'}.`,
                time: p.createdAt,
                label: 'Fee Paid'
            }))
        ];

        // Sort combined activities by time (newest first)
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json(activities.slice(0, 15));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getRecentActivities };
