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
    } catch (error) {
        console.error(`Database Connection Failure: ${error.message}`);
        // For serverless, we don't want to exit, but we need to mark as disconnected
        isConnected = false;
        throw error;
    }
};

module.exports = connectDB;
