const mongoose = require('mongoose');
require('dotenv').config();
const Counter = require('./models/Counter');

const checkCounter = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const counters = await Counter.find({});
        console.log(JSON.stringify(counters, null, 2));
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkCounter();
