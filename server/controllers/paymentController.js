const Payment = require('../models/Payment');

// @desc    Get all payments for a student
// @route   GET /api/payments/my-payments
// @access  Private (Student)
const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a payment record (Admin only or Mock Payment)
// @route   POST /api/payments
// @access  Private (Admin)
const createPayment = async (req, res) => {
    try {
        const { studentId, type, amount, status, dueDate, description } = req.body;

        const payment = await Payment.create({
            student: studentId,
            type,
            amount,
            status,
            dueDate,
            description
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all payments (Admin only)
// @route   GET /api/payments/all-payments
// @access  Private (Admin/Warden)
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('student', 'name email roomNumber')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyPayments, createPayment, getAllPayments };
