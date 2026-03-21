const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Room = require('./models/Room');
const Payment = require('./models/Payment');
const Complaint = require('./models/Complaint');
const GatePass = require('./models/GatePass');

const purgeOrphanedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Get all valid student IDs
        const students = await User.find({ role: 'student' }).select('_id');
        const studentIdsStrings = students.map(s => s._id.toString());

        console.log(`Found ${students.length} valid students in database.`);

        // 2. Clear invalid occupants in Rooms
        const rooms = await Room.find();
        for (const room of rooms) {
            const originalCount = room.occupants.length;
            room.occupants = room.occupants.filter(occId => 
                occId && studentIdsStrings.includes(occId.toString())
            );
            if (room.occupants.length !== originalCount) {
                console.log(`Cleaned up ${originalCount - room.occupants.length} orphaned occupants from Room ${room.roomNumber}.`);
                await room.save();
            }
        }

        // 3. Clear orphaned Payments
        const paymentResult = await Payment.deleteMany({
            student: { $nin: students.map(s => s._id) }
        });
        console.log(`Deleted ${paymentResult.deletedCount} orphaned payment records.`);

        // 4. Clear orphaned Complaints
        const complaintResult = await Complaint.deleteMany({
            student: { $nin: students.map(s => s._id) }
        });
        console.log(`Deleted ${complaintResult.deletedCount} orphaned complaint records.`);

        // 5. Clear orphaned GatePasses
        const gatePassResult = await GatePass.deleteMany({
            student: { $nin: students.map(s => s._id) }
        });
        console.log(`Deleted ${gatePassResult.deletedCount} orphaned gatepass records.`);

        console.log('Cleanup complete.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

purgeOrphanedData();
