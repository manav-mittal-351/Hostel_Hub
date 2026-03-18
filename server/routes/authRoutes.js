const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile, getUserProfile } = require('../controllers/authController');

const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', protect, admin, registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
