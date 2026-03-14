const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
    },
    capacity: {
        type: Number,
        required: true,
        default: 3,
    },
    occupants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    floor: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['AC', 'Non-AC'],
        default: 'Non-AC',
    }
}, {
    timestamps: true,
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
