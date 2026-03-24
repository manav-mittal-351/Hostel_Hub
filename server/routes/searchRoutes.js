const express = require('express');
const router = express.Router();
const { searchAll } = require('../controllers/searchController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, searchAll);

module.exports = router;
