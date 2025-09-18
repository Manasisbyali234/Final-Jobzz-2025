const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get notifications by role
router.get('/:role', notificationController.getNotificationsByRole);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all notifications as read for a role
router.patch('/:role/read-all', notificationController.markAllAsRead);

// Test notification creation
router.post('/test', notificationController.testNotification);

module.exports = router;