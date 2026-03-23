const express = require('express');
const router = express.Router();
const { getAllStudents, deleteStudent } = require('../controllers/studentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Using the `admin` middleware as it already allows both Admin and Warden as per current implementation
router.get('/', protect, admin, getAllStudents);
router.delete('/:id', protect, admin, deleteStudent);

module.exports = router;
