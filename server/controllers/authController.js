const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { getNextSequenceValue } = require('../utils/idGenerator');
const { createAndSendNotification } = require('./notificationController');

const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    let { name, email, password, role } = req.body;
    role = role || 'student';

    // Security check: If the creator is a warden, they can ONLY create student accounts
    if (req.user && req.user.role === 'warden') {
        role = 'student';
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let generatedId;
        const roleKey = (role || 'student').toLowerCase();
        
        if (roleKey === 'student') {
            generatedId = await getNextSequenceValue('studentId', 'ST', 1000);
        } else if (roleKey === 'warden') {
            generatedId = await getNextSequenceValue('wardenId', 'W', 10100);
        } else if (roleKey === 'admin') {
            generatedId = await getNextSequenceValue('adminId', 'A', 1250);
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            studentId: generatedId 
        });

        if (user) {
            // Notify other admins/wardens about new enrollment
            const staff = await User.find({ role: 'admin', _id: { $ne: req.user?._id } });
            staff.forEach(s => {
                createAndSendNotification({
                    recipient: s._id,
                    sender: req.user?._id,
                    title: "New Enrollment",
                    message: `${name} has been added as a ${user.role} to the system.`,
                    type: "system",
                    link: "/admin/students"
                });
            });

            // Notify the user themselves
            createAndSendNotification({
                recipient: user._id,
                title: `Welcome to HostelHub`,
                message: `Hello ${name}, your account has been created successfully. Your ID is ${generatedId}.`,
                type: "success",
                link: "/profile"
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentId: user.studentId,
                department: user.department,
                hostelName: user.hostelName,
                hostelBlock: user.hostelBlock,
                roomNumber: user.roomNumber,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body; // email field here is used as a generic identifier

    try {
        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { studentId: email } // Allowing login by Student/Admin ID
            ]
        });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentId: user.studentId,
                department: user.department,
                hostelName: user.hostelName,
                hostelBlock: user.hostelBlock,
                roomNumber: user.roomNumber,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            
            if (req.body.password) {
                user.password = req.body.password;
            }

            // Update additional fields from request body, allow clearing if explicitly sent but default to current
            if (req.user.role === 'admin') {
                user.studentId = req.body.studentId !== undefined ? req.body.studentId : user.studentId;
            }
            
            user.department = req.body.department !== undefined ? req.body.department : user.department;
            user.hostelName = req.body.hostelName !== undefined ? req.body.hostelName : user.hostelName;
            user.hostelBlock = req.body.hostelBlock !== undefined ? req.body.hostelBlock : user.hostelBlock;
            user.roomNumber = req.body.roomNumber !== undefined ? req.body.roomNumber : user.roomNumber;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                studentId: updatedUser.studentId,
                department: updatedUser.department,
                hostelName: updatedUser.hostelName,
                hostelBlock: updatedUser.hostelBlock,
                roomNumber: updatedUser.roomNumber,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentId: user.studentId,
                department: user.department,
                hostelName: user.hostelName,
                hostelBlock: user.hostelBlock,
                roomNumber: user.roomNumber,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getUserProfile };
