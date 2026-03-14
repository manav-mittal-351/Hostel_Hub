const express = require('express');
const router = express.Router();
const {
    getAllActions,
    createAction,
    updateActionStatus,
    deleteAction,
    getMyActions
} = require('../controllers/nonDisciplinaryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllActions)
    .post(protect, admin, createAction);

router.get('/my', protect, getMyActions);

router.route('/:id')
    .put(protect, admin, updateActionStatus)
    .delete(protect, admin, deleteAction);

module.exports = router;
