const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin/Warden)
const getAllStudents = async (req, res) => {
    try {
        let query = { role: 'student' };

        // If warden, restrict to their hostel block
        if (req.user.role === 'warden' && req.user.hostelBlock) {
            query.hostelBlock = req.user.hostelBlock;
        }

        console.log("Fetching students with query:", query);
        const students = await User.find(query).select('-password').sort({ createdAt: -1 });
        console.log("Returning students count:", students.length);
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private (Admin/Warden)
const deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check permissions
        if (req.user.role === 'warden') {
            if (req.user.hostelBlock && student.hostelBlock !== req.user.hostelBlock) {
                return res.status(403).json({ message: 'Not authorized to delete students from other blocks' });
            }
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllStudents, deleteStudent };
