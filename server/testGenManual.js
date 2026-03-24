const mongoose = require('mongoose');
require('dotenv').config();
const Counter = require('./models/Counter');

const testGen = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to:", mongoose.connection.name);
        
        console.log("Updating Counter...");
        const result = await Counter.findOneAndUpdate(
            { _id: 'studentId' },
            { $inc: { seq: 1 }, $setOnInsert: { seq: 1000 } },
            { new: true, upsert: true }
        );
        console.log("Update result:", JSON.stringify(result, null, 2));
        mongoose.connection.close();
    } catch (err) {
        console.error("Error in generator:", err);
    }
};

testGen();
