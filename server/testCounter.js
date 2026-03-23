const mongoose = require('mongoose');
require('dotenv').config();
const Counter = require('./models/Counter');

const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { id: sequenceName },
        { 
            $inc: { seq: 1 },
            $setOnInsert: { seq: 1000 }
        },
        { new: true, upsert: true }
    );
    console.log("Found document:", JSON.stringify(sequenceDocument, null, 2));
    return sequenceDocument.seq;
};

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const seq = await getNextSequenceValue('studentId');
        console.log("Resulting seq:", seq);
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

test();
