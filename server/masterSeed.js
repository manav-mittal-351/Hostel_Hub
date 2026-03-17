const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const User = require('./models/User');

dotenv.config();

const rooms = [
    { roomNumber: '101', capacity: 3, floor: 1, type: 'Non-AC' },
    { roomNumber: '102', capacity: 3, floor: 1, type: 'Non-AC' },
    { roomNumber: '103', capacity: 2, floor: 1, type: 'AC' },
    { roomNumber: '201', capacity: 3, floor: 2, type: 'Non-AC' },
    { roomNumber: '202', capacity: 2, floor: 2, type: 'AC' },
    { roomNumber: '301', capacity: 1, floor: 3, type: 'AC' },
];

const seedData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }

        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Seed Rooms
        await Room.deleteMany();
        console.log('🗑️  Existing rooms cleared');
        await Room.insertMany(rooms);
        console.log('🏢 Rooms seeded successfully');

        // 2. Seed Default Admin (if doesn't exist)
        const adminEmail = 'admin@hostelhub.com';
        const adminExists = await User.findOne({ email: adminEmail });
        
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'admin123', // This will be hashed by the User model's pre-save middleware
                role: 'admin'
            });
            console.log('👤 Default Admin created (Email: admin@hostelhub.com, Password: admin123)');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        console.log('\n✨ Database seeding complete! You can now log in.');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
