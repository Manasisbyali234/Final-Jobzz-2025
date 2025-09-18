const Notification = require('../models/Notification');

// Create notification
exports.createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    console.log('Notification created:', notification);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications by role
exports.getNotificationsByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const notifications = await Notification.find({ role })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const unreadCount = await Notification.countDocuments({ role, isRead: false });
    
    res.json({
      success: true,
      notifications,
      unreadCount,
      total: await Notification.countDocuments({ role })
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark all notifications as read for a role
exports.markAllAsRead = async (req, res) => {
  try {
    const { role } = req.params;
    
    await Notification.updateMany(
      { role, isRead: false },
      { isRead: true }
    );
    
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Test notification creation
exports.testNotification = async (req, res) => {
  try {
    const notification = await exports.createNotification({
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'job_posted',
      role: 'candidate',
      createdBy: '507f1f77bcf86cd799439011' // dummy ObjectId
    });
    
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};