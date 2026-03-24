const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkOne = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ role: 'student' });
        console.log("Full Student data:", JSON.stringify(user, null, 2));
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkOne();
