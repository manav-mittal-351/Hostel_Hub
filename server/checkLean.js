const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkLean = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({ role: 'student' }).sort({ createdAt: -1 }).lean();
        console.log("Raw Students (Lean):", JSON.stringify(users, null, 2));
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkLean();
