const NonDisciplinaryAction = require('../models/NonDisciplinaryAction');
const User = require('../models/User');
const { createAndSendNotification } = require('./notificationController');

// @desc    Get all non-disciplinary actions
// @route   GET /api/non-disciplinary
// @access  Private (Admin)
const getAllActions = async (req, res) => {
    try {
        const actions = await NonDisciplinaryAction.find()
            .populate('student', 'name studentId email roomNumber')
            .populate('createdBy', 'name role')
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
    let { studentId, actionType, description, amount, status } = req.body;

    try {
        const queryId = studentId?.toString().trim();
        
        if (!queryId) {
            return res.status(400).json({ message: 'A valid Student ID is required' });
        }

        // Performance-first lookup strategies
        let student = await User.findOne({ 
            $or: [
                { studentId: { $regex: `^${queryId}$`, $options: 'i' } },
                { _id: queryId.match(/^[0-9a-fA-F]{24}$/) ? queryId : null }
            ]
        });

        if (!student && queryId.length >= 4) {
             student = await User.findOne({
                $expr: {
                    $eq: [
                        { $toLower: { $substrCP: [{ $toString: "$_id" }, 18, 6] } },
                        queryId.toLowerCase().slice(-6)
                    ]
                }
            });
        }

        if (!student) {
            student = await User.findOne({ studentId: { $regex: queryId, $options: 'i' } });
        }

        if (!student) {
            return res.status(404).json({ message: `Student Registry not found for ID: ${queryId}.` });
        }

        const action = await NonDisciplinaryAction.create({
            student: student._id,
            createdBy: req.user._id,
            actionType,
            description,
            amount,
            status: status || 'Pending'
        });

        const populatedAction = await NonDisciplinaryAction.findById(action._id)
            .populate('student', 'name studentId email roomNumber')
            .populate('createdBy', 'name role');

        // Notify student about new institutional record
        createAndSendNotification({
            recipient: student._id.toString(),
            sender: req.user._id,
            title: "New Student Record",
            message: `A new ${actionType.toLowerCase()} has been logged for you.`,
            type: actionType === "Penalty" ? "warning" : "info",
            link: "/payments"
        });

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
                .populate('student', 'name studentId email roomNumber')
                .populate('createdBy', 'name role');
                
            // Notify student about record update (status)
            createAndSendNotification({
                recipient: action.student.toString(),
                sender: req.user._id,
                title: "Record Updated",
                message: `Status of your ${action.actionType.toLowerCase()} record is now ${status}.`,
                type: status === "Archived" ? "info" : "success",
                link: "/payments"
            });

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
        const actions = await NonDisciplinaryAction.find({ student: req.user._id })
            .populate('createdBy', 'name role')
            .sort({ createdAt: -1 });
        res.json(actions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Pay or resolve a action (Student)
// @route   PUT /api/non-disciplinary/:id/pay
// @access  Private (Student)
const payAction = async (req, res) => {
    try {
        const action = await NonDisciplinaryAction.findById(req.params.id);

        if (!action) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Check ownership
        if (action.student.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized for this record' });
        }

        action.status = 'Paid';
        await action.save();

        // Notify student and creators/staff
        createAndSendNotification({
            recipient: req.user._id.toString(),
            sender: req.user._id,
            title: "Dues Paid",
            message: `Your ${action.actionType} of ₹${action.amount} has been settled.`,
            type: "success",
            link: "/payments"
        });

        res.json(action);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllActions,
    createAction,
    updateActionStatus,
    deleteAction,
    getMyActions,
    payAction
};
