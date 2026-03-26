const Counter = require('../models/Counter');

const getNextSequenceValue = async (sequenceName, prefix = '', startVal = 1000) => {
    // 1. Try to increment existing counter
    let sequenceDocument = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { seq: 1 } },
        { new: true }
    );

    // 2. If counter doesn't exist, initialize it with start value
    if (!sequenceDocument) {
        try {
            // First ever ID should be startVal + 1
            sequenceDocument = await Counter.create({ 
                _id: sequenceName, 
                seq: startVal + 1 
            });
        } catch (error) {
            // If another process created it simultaneously, performing a fallback increment
            sequenceDocument = await Counter.findOneAndUpdate(
                { _id: sequenceName },
                { $inc: { seq: 1 } },
                { new: true }
            );
        }
    }
    
    if (!sequenceDocument) {
        throw new Error(`Counter for ${sequenceName} initialization failed!`);
    }
    
    return `${prefix}${sequenceDocument.seq}`;
};

module.exports = { getNextSequenceValue };
