const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['profile_submitted', 'job_posted', 'application_received', 'profile_approved', 'profile_rejected'], required: true },
  role: { type: String, enum: ['admin', 'candidate', 'employer'], required: true },
  isRead: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Job ID or Profile ID
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);