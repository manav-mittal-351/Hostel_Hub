const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkWithId = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({ studentId: { $exists: true } }).lean();
        console.log("Found students with studentId:", users.length);
        if (users.length > 0) {
            console.log("Sample:", JSON.stringify(users[0], null, 2));
        }
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkWithId();
