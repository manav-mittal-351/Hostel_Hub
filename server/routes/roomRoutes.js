const express = require('express');
const router = express.Router();
const { createRoom, getAllRooms, allocateRoom, bookRoom, checkoutRoom } = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createRoom)
    .get(protect, getAllRooms);

router.post('/book', protect, bookRoom);
router.post('/checkout', protect, checkoutRoom);
router.put('/:id/allocate', protect, admin, allocateRoom);

module.exports = router;
