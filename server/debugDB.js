const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Room = require('./models/Room');
const Payment = require('./models/Payment');

const checkDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in .env');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const students = await User.find({ role: 'student' });
        console.log(`Total Students (role student): ${students.length}`);
        students.forEach(s => console.log(`- ${s.name} (${s.email})`));

        const rooms = await Room.find();
        let occupiedCount = 0;
        rooms.forEach(r => {
            if (r.occupants && r.occupants.length > 0) {
                occupiedCount += r.occupants.length;
                console.log(`Room ${r.roomNumber} has ${r.occupants.length} occupants`);
            }
        });
        console.log(`Total Occupied: ${occupiedCount}`);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const payments = await Payment.find({
            createdAt: { $gte: startOfMonth },
            status: 'paid'
        });
        console.log(`Payments this month (paid): ${payments.length}`);
        let totalRevenue = 0;
        payments.forEach(p => totalRevenue += p.amount);
        console.log(`Total Monthly Revenue: ${totalRevenue}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
