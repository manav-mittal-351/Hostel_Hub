const mongoose = require('mongoose');
require('dotenv').config();
const Counter = require('./models/Counter');

const resetCounter = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // Find and update or create with 1000
        const result = await Counter.findOneAndUpdate(
            { _id: 'studentId' },
            { $set: { seq: 1000 } },
            { upsert: true, new: true }
        );
        console.log("Counter reset to:", result.seq);
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

resetCounter();
