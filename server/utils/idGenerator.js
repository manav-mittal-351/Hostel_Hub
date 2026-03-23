const Counter = require('../models/Counter');

const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { 
            $inc: { seq: 1 },
            $setOnInsert: { seq: 1000 }
        },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
};

module.exports = { getNextSequenceValue };
