const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['Outing', 'Leave'],
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    outDate: {
        type: Date,
        required: true,
    },
    inDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    }
}, {
    timestamps: true,
});

const GatePass = mongoose.model('GatePass', gatePassSchema);
module.exports = GatePass;
