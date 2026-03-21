const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentActivities } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/activities', protect, admin, getRecentActivities);

module.exports = router;
