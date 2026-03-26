const express = require('express');
const router = express.Router();
const { getMyPayments, createPayment, getAllPayments, payPayment } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/my-payments', protect, getMyPayments);
router.get('/all-payments', protect, admin, getAllPayments);
router.post('/', protect, admin, createPayment);
router.put('/:id/pay', protect, payPayment);

module.exports = router;
