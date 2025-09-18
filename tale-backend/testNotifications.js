const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const { createNotification } = require('./controllers/notificationController');

// Test notification creation
async function testNotificationSystem() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Create a test notification for employer
    const testNotification = await createNotification({
      title: 'Test Account Approved',
      message: 'This is a test notification. Your employer account has been approved. You can now post jobs.',
      type: 'profile_approved',
      role: 'employer',
      relatedId: new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId()
    });

    console.log('Test notification created successfully:', testNotification);

    // Create a test rejection notification
    const testRejection = await createNotification({
      title: 'Test Account Rejected',
      message: 'This is a test notification. Your employer account has been rejected. Please contact support.',
      type: 'profile_rejected',
      role: 'employer',
      relatedId: new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId()
    });

    console.log('Test rejection notification created successfully:', testRejection);

    process.exit(0);
  } catch (error) {
    console.error('Error testing notification system:', error);
    process.exit(1);
  }
}

testNotificationSystem();