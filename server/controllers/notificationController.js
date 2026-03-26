const Notification = require('../models/Notification');
const { sendNotification } = require('../utils/socket');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { read: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user._id });
        res.json({ message: 'Notifications cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Utility to create and send notification (to be used in other controllers)
const createAndSendNotification = async (data) => {
    try {
        const notification = new Notification(data);
        await notification.save();
        
        // Use common socket logic
        sendNotification(data.recipient, {
            ...data,
            _id: notification._id,
            createdAt: notification.createdAt
        });
        return notification;
    } catch (error) {
        console.error("Failed to create/send notification:", error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotifications,
    createAndSendNotification
};
