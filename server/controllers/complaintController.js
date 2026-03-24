const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
    const { title, description } = req.body;

    try {
        const complaint = await Complaint.create({
            student: req.user._id,
            title,
            description,
        });
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's complaints
// @route   GET /api/complaints/my
// @access  Private (Student)
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin/Warden)
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('student', 'name email roomNumber studentId')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resolve complaint
// @route   PUT /api/complaints/:id/resolve
// @access  Private (Admin/Warden)
const resolveComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (complaint) {
            complaint.status = 'resolved';
            complaint.resolvedBy = req.user._id;
            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createComplaint, getMyComplaints, getAllComplaints, resolveComplaint };
