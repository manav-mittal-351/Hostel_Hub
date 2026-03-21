const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const checkRole = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find();
        users.forEach(u => console.log(`${u.name} | ${u.role} | ${u.email}`));
        process.exit();
    } catch (err) {
        process.exit(1);
    }
};

checkRole();
