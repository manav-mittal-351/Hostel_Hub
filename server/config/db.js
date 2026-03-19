const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('CRITICAL ERROR: MONGO_URI is not defined in environment variables.');
            return;
        }

        console.log('Attempting to establish new MongoDB connection...');
        const db = await mongoose.connect(uri, {
            // Options are largely default in Mongoose 6+, but keeping for clarity
            serverSelectionTimeoutMS: 15000, // Timeout after 15s instead of default
        });

        isConnected = !!db.connections[0].readyState;
        console.log(`MongoDB Connected: ${db.connection.host}`);
        
        // Seed initial admin user if database is empty
        await seedAdmin();
    } catch (error) {
        console.error(`Database Connection Failure: ${error.message}`);
        // For serverless, we don't want to exit, but we need to mark as disconnected
        isConnected = false;
        throw error;
    }
};

const seedAdmin = async () => {
    try {
        // Use dynamic import to avoid circular dependency if any
        const User = require('../models/User');
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.warn('⚠️  Skipping admin seeding: ADMIN_EMAIL or ADMIN_PASSWORD not defined in environment.');
            return;
        }

        const adminExists = await User.findOne({ email: adminEmail });
        
        if (!adminExists) {
            console.log('Seeding initial administrative user...');
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            console.log('Admin user seeded successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error(`Admin Seeding Failure: ${error.message}`);
    }
};

module.exports = connectDB;
