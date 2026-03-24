const mongoose = require('mongoose');
require('dotenv').config();
const Counter = require('./models/Counter');

const fix = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to", mongoose.connection.name);
        
        await Counter.deleteMany({});
        console.log("Deleted old counters");
        
        const c = await Counter.create({ _id: 'studentId', seq: 1000 });
        console.log("Created new counter:", c);
        
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

fix();
