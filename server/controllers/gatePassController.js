const GatePass = require('../models/GatePass');
const { createAndSendNotification } = require('./notificationController');
const User = require('../models/User');

// @desc    Create a new gate pass request
// @route   POST /api/gate-pass
// @access  Private (Student)
const createGatePass = async (req, res) => {
    try {
        const { type, reason, outDate, inDate } = req.body;

        const gatePass = await GatePass.create({
            student: req.user._id,
            type,
            reason,
            outDate,
            inDate
        });

        // Notify Admins & Wardens
        const staff = await User.find({ role: { $in: ['admin', 'warden'] } });
        staff.forEach(user => {
            createAndSendNotification({
                recipient: user._id,
                sender: req.user._id,
                title: "New Gatepass Request",
                message: `${req.user.name} requested a pass for ${new Date(outDate).toLocaleDateString()}.`,
                type: "gatepass",
                link: `/admin/gate-pass`
            });
        });

        res.status(201).json(gatePass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my gate pass requests
// @route   GET /api/gate-pass/my-passes
// @access  Private (Student)
const getMyGatePasses = async (req, res) => {
    try {
        const passes = await GatePass.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(passes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all gate pass requests
// @route   GET /api/gate-pass
// @access  Private (Admin/Warden)
const getAllGatePasses = async (req, res) => {
    try {
        const passes = await GatePass.find()
            .populate('student', 'name email roomNumber')
            .sort({ createdAt: -1 });
        res.json(passes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update gate pass status
// @route   PUT /api/gate-pass/:id/status
// @access  Private (Admin/Warden)
const updateGatePassStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const gatePass = await GatePass.findById(req.params.id);

        if (gatePass) {
            gatePass.status = status;
            const updatedPass = await gatePass.save();
            
            // Notify student
            createAndSendNotification({
                recipient: gatePass.student.toString(),
                sender: req.user._id,
                title: `Pass ${status}`,
                message: `Your gate pass request for ${new Date(gatePass.outDate).toLocaleDateString()} has been ${status.toLowerCase()} by ${req.user.name}.`,
                type: status === "Approved" ? "success" : "warning",
                link: "/gate-pass"
            });

            res.json(updatedPass);
        } else {
            res.status(404).json({ message: 'Gate pass not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createGatePass, getMyGatePasses, getAllGatePasses, updateGatePassStatus };
