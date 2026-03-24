const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkLatest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ role: 'student' }).sort({ createdAt: -1 });
        console.log("Latest Student data:", JSON.stringify(user, null, 2));
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkLatest();
