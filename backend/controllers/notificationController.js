const Notification = require('../models/Notification');

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Ensure the notification belongs to the logged-in user
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this notification' });
    }

    notification.read = true;
    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error marking notification as read' });
  }
};

// @desc    Mark all notifications as read for the logged-in user
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { $set: { read: true } });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error marking all notifications as read' });
  }
};

// Helper function to create a notification (can be called internally by other controllers)
const createNotification = async (userId, message, link = '', type = '') => {
  try {
    const notification = await Notification.create({
      userId,
      message,
      link,
      type,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // In a real app, you might want to log this error more robustly
    return null;
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification, // Exported for use by other controllers
};