const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const User = require('./models/User');

dotenv.config();

const rooms = require('./config/initialRooms.json');

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

        // 2. Seed Default Admin (if defined in env)
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        
        if (adminEmail && adminPassword) {
            const adminExists = await User.findOne({ email: adminEmail });
            
            if (!adminExists) {
                await User.create({
                    name: 'System Admin',
                    email: adminEmail,
                    password: adminPassword,
                    role: 'admin'
                });
                console.log(`👤 Default Admin created (Email: ${adminEmail})`);
            } else {
                console.log('ℹ️  Admin user already exists');
            }
        } else {
            console.warn('⚠️  Skipping admin seeding in script: ADMIN_EMAIL or ADMIN_PASSWORD not defined.');
        }

        console.log('\n✨ Database seeding complete! You can now log in.');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
