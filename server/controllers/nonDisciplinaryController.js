const NonDisciplinaryAction = require('../models/NonDisciplinaryAction');
const User = require('../models/User');

// @desc    Get all non-disciplinary actions
// @route   GET /api/non-disciplinary
// @access  Private (Admin)
const getAllActions = async (req, res) => {
    try {
        const actions = await NonDisciplinaryAction.find()
            .populate('student', 'name studentId email roomNumber')
            .sort({ createdAt: -1 });
        res.json(actions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create non-disciplinary action
// @route   POST /api/non-disciplinary
// @access  Private (Admin)
const createAction = async (req, res) => {
    const { studentId, actionType, description, amount, status } = req.body;

    try {
        // Find student by their searchable studentId or _id
        let student = await User.findOne({ 
            $or: [
                { studentId: studentId },
                { _id: studentId.match(/^[0-9a-fA-F]{24}$/) ? studentId : null }
            ]
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found with that ID' });
        }

        const action = await NonDisciplinaryAction.create({
            student: student._id,
            actionType,
            description,
            amount,
            status: status || 'Pending'
        });

        const populatedAction = await NonDisciplinaryAction.findById(action._id)
            .populate('student', 'name studentId email roomNumber');

        res.status(201).json(populatedAction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update action status
// @route   PUT /api/non-disciplinary/:id
// @access  Private (Admin)
const updateActionStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const action = await NonDisciplinaryAction.findById(req.params.id);

        if (action) {
            action.status = status;
            const updatedAction = await action.save();
            
            const populatedAction = await NonDisciplinaryAction.findById(updatedAction._id)
                .populate('student', 'name studentId email roomNumber');
                
            res.json(populatedAction);
        } else {
            res.status(404).json({ message: 'Action record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete action
// @route   DELETE /api/non-disciplinary/:id
// @access  Private (Admin)
const deleteAction = async (req, res) => {
    try {
        const action = await NonDisciplinaryAction.findById(req.params.id);

        if (action) {
            await action.deleteOne();
            res.json({ message: 'Record removed' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my non-disciplinary actions
// @route   GET /api/non-disciplinary/my
// @access  Private (Student)
const getMyActions = async (req, res) => {
    try {
        const actions = await NonDisciplinaryAction.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(actions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllActions,
    createAction,
    updateActionStatus,
    deleteAction,
    getMyActions
};
