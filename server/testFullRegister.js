const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const { getNextSequenceValue } = require('./utils/idGenerator');

const testRegister = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        let role = 'student';
        let studentId;
        
        console.log("Generating ID...");
        studentId = await getNextSequenceValue('studentId');
        console.log("Generated studentId:", studentId);
        
        const user = await User.create({
            name: "Test Student " + Date.now(),
            email: "test" + Date.now() + "@gmail.com",
            password: "password123",
            role: role,
            studentId: studentId
        });
        
        console.log("Created Student record with ID:", user.studentId);
        
        // No delete, let's keep it to check in UI
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

testRegister();
