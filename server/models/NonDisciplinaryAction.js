const mongoose = require('mongoose');

const nonDisciplinaryActionSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    actionType: {
        type: String,
        required: true,
        enum: ['Damage', 'Late Payment', 'Extra Service', 'Other']
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Paid', 'Resolved'],
        default: 'Pending'
    },
    dateCovered: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const NonDisciplinaryAction = mongoose.model('NonDisciplinaryAction', nonDisciplinaryActionSchema);

module.exports = NonDisciplinaryAction;
