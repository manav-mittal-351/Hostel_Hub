const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../controllers/assistantController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, getAIResponse);

module.exports = router;
