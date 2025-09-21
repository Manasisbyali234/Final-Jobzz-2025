const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: false },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: false },
  
  // Guest application fields
  isGuestApplication: { type: Boolean, default: false },
  applicantName: { type: String, required: false },
  applicantEmail: { type: String, required: false },
  applicantPhone: { type: String, required: false },
  
  status: { 
    type: String, 
    enum: ['pending', 'shortlisted', 'interviewed', 'hired', 'rejected'], 
    default: 'pending' 
  },
  coverLetter: { type: String },
  resume: { 
    filename: String,
    originalName: String,
    data: String, // Base64 encoded file data
    size: Number,
    mimetype: String
  },
  notes: { type: String },
  appliedAt: { type: Date, default: Date.now },
  
  // Interview review fields
  interviewRounds: [{
    round: { type: Number, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
    feedback: { type: String, default: '' }
  }],
  employerRemarks: { type: String, default: '' },
  isSelectedForProcess: { type: Boolean, default: false },
  reviewedAt: { type: Date },
  
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'statusHistory.changedByModel' },
    changedByModel: { type: String, enum: ['Employer', 'Admin'] },
    notes: String
  }]
}, {
  timestamps: true
});

// Create compound index but allow null candidateId for guest applications
applicationSchema.index({ candidateId: 1, jobId: 1 }, { 
  unique: true, 
  partialFilterExpression: { candidateId: { $exists: true } } 
});

module.exports = mongoose.model('Application', applicationSchema);