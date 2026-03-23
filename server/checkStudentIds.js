const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({ role: 'student' }, 'name email role studentId');
        console.log(JSON.stringify(users, null, 2));
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkUsers();
