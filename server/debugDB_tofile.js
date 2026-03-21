const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Room = require('./models/Room');
const Payment = require('./models/Payment');

const checkDBDetailedToFile = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let output = '';
        
        const students = await User.find({ role: 'student' });
        output += `--- Students (${students.length}) ---\n`;
        students.forEach(s => output += `ID: ${s._id}, Name: ${s.name}\n`);

        const rooms = await Room.find();
        output += `--- Occupied Rooms ---\n`;
        rooms.forEach(r => {
            if (r.occupants && r.occupants.length > 0) {
                output += `Room: ${r.roomNumber}, Occupants: ${r.occupants.join(', ')}\n`;
            }
        });

        const payments = await Payment.find({ status: 'paid' });
        output += `--- Paid Payments (${payments.length}) ---\n`;
        payments.forEach(p => output += `ID: ${p._id}, Amount: ${p.amount}, User: ${p.student}\n`);

        fs.writeFileSync('db_check.txt', output);
        process.exit();
    } catch (err) {
        process.exit(1);
    }
};

checkDBDetailedToFile();
