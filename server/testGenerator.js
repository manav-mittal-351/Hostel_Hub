const mongoose = require('mongoose');
require('dotenv').config();
const { getNextSequenceValue } = require('./utils/idGenerator');

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const id1 = await getNextSequenceValue('studentId');
        console.log('Generated ID 1:', id1);
        const id2 = await getNextSequenceValue('studentId');
        console.log('Generated ID 2:', id2);
        
        // I won't delete it this time to see the state in DB later
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

test();
