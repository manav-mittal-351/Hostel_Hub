const User = require('../models/User');
const { createAndSendNotification } = require('./notificationController');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin/Warden)
const getAllStudents = async (req, res) => {
    try {
        let query = { role: 'student' };

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
        const studentId = req.params.id;
        const student = await User.findById(studentId);

        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        const studentName = student.name;
        await User.findByIdAndDelete(studentId);

        // Notify other admins
        const staff = await User.find({ role: 'admin', _id: { $ne: req.user._id } });
        staff.forEach(s => {
            createAndSendNotification({
                recipient: s._id,
                sender: req.user._id,
                title: "Student Removed",
                message: `Student record for ${studentName} was removed from the system by ${req.user.name}.`,
                type: "system",
                link: "/admin/students"
            });
        });

        res.json({ message: 'Student removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllStudents, deleteStudent };
