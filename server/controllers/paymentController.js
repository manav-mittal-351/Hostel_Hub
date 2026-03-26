const Payment = require('../models/Payment');
const { createAndSendNotification } = require('./notificationController');

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

        // Notify student of new payment due
        createAndSendNotification({
            recipient: studentId,
            sender: req.user._id,
            title: "New Payment Due",
            message: `A new ${type} of ₹${amount} has been added to your account. Due by: ${new Date(dueDate).toLocaleDateString()}`,
            type: "payment",
            link: "/payments"
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

// @desc    Update payment status to Paid (Student paying their due)
// @route   PUT /api/payments/:id/pay
// @access  Private (Student)
const payPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Check ownership
        if (payment.student.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to pay this bill' });
        }

        payment.status = 'Paid';
        await payment.save();

        // Notify student of success
        createAndSendNotification({
            recipient: req.user._id.toString(),
            sender: req.user._id, // Self-notification for record
            title: "Transaction Successful",
            message: `Payment of ₹${payment.amount} for ${payment.type} has been processed successfully.`,
            type: "success",
            link: "/payments"
        });

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyPayments, createPayment, getAllPayments, payPayment };
