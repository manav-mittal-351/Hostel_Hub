const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['hostel_fee', 'mess_fee', 'fine'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'overdue'],
        default: 'pending',
    },
    dueDate: {
        type: Date,
        required: true,
    },
    paymentDate: {
        type: Date,
    },
    transactionId: {
        type: String,
    },
    description: {
        type: String,
    }
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
