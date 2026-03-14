const express = require('express');
const router = express.Router();
const { createComplaint, getMyComplaints, getAllComplaints, resolveComplaint } = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createComplaint)
    .get(protect, admin, getAllComplaints);

router.get('/my', protect, getMyComplaints);
router.put('/:id/resolve', protect, admin, resolveComplaint);

module.exports = router;
