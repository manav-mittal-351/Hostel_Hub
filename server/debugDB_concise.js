const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Room = require('./models/Room');
const Payment = require('./models/Payment');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const students = await User.find({ role: 'student' });
        console.log(`ST_COUNT: ${students.length}`);

        const rooms = await Room.find();
        let occupiedSum = 0;
        rooms.forEach(r => {
            if (r.occupants && r.occupants.length > 0) {
                occupiedSum += r.occupants.length;
                console.log(`ROOM_${r.roomNumber}: ${r.occupants.length} occ`);
                r.occupants.forEach(occ => {
                    console.log(` - Occ ID: ${occ}`);
                });
            }
        });
        console.log(`TOTAL_OCC: ${occupiedSum}`);

        const payments = await Payment.find({ status: 'paid' });
        let totalRev = 0;
        payments.forEach(p => totalRev += p.amount);
        console.log(`TOTAL_REV: ${totalRev}`);

        process.exit();
    } catch (err) {
        process.exit(1);
    }
};

checkDB();
