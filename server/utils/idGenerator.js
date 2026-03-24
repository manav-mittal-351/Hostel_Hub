const Counter = require('../models/Counter');

const getNextSequenceValue = async (sequenceName, prefix = '', startVal = 1000) => {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { 
            $inc: { seq: 1 },
            $setOnInsert: { seq: startVal }
        },
        { new: true, upsert: true }
    );
    
    if (!sequenceDocument) {
        throw new Error(`Counter for ${sequenceName} initialization failed!`);
    }
    
    return `${prefix}${sequenceDocument.seq}`;
};

module.exports = { getNextSequenceValue };
