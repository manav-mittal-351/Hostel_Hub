const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const checkRoleToFile = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find();
        let output = '';
        users.forEach(u => output += `${u.name} | ${u.role} | ${u.email}\n`);
        fs.writeFileSync('roles_check.txt', output);
        process.exit();
    } catch (err) {
        process.exit(1);
    }
};

checkRoleToFile();
