const express = require('express');
const router = express.Router();
const { createGatePass, getMyGatePasses, getAllGatePasses, updateGatePassStatus } = require('../controllers/gatePassController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createGatePass)
    .get(protect, admin, getAllGatePasses);

router.get('/my-passes', protect, getMyGatePasses);
router.put('/:id/status', protect, admin, updateGatePassStatus);

module.exports = router;
