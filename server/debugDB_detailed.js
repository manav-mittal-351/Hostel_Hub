const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Room = require('./models/Room');
const Payment = require('./models/Payment');

const checkDBDetailed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const students = await User.find({ role: 'student' });
        console.log(`--- Students (${students.length}) ---`);
        students.forEach(s => console.log(`ID: ${s._id}, Name: ${s.name}`));

        const rooms = await Room.find();
        console.log(`--- Rooms ---`);
        rooms.forEach(r => {
            if (r.occupants && r.occupants.length > 0) {
                console.log(`Room: ${r.roomNumber}, Occupants: ${r.occupants.join(', ')}`);
            }
        });

        const payments = await Payment.find({ status: 'paid' });
        console.log(`--- Paid Payments (${payments.length}) ---`);
        payments.forEach(p => console.log(`ID: ${p._id}, Amount: ${p.amount}, User: ${p.student}`));

        process.exit();
    } catch (err) {
        process.exit(1);
    }
};

checkDBDetailed();
