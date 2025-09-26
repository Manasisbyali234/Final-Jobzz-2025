const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const placementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  studentData: { type: String }, // Base64 encoded Excel/CSV file
  fileName: { type: String },
  fileType: { type: String },
  credits: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
  isProcessed: { type: Boolean, default: false },
  processedAt: { type: Date },
  candidatesCreated: { type: Number, default: 0 },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, {
  timestamps: true
});

placementSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

placementSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Placement', placementSchema);