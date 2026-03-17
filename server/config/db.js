const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.warn('WARNING: MONGO_URI is not defined. Connecting to localhost fallback...');
        } else {
            console.log('Attempting to connect to MongoDB...');
        }
        const conn = await mongoose.connect(uri || 'mongodb://localhost:27017/hostel_management');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // In serverless, we don't want to exit the process
        // process.exit(1);
    }
};

module.exports = connectDB;
