const mongoose = require('mongoose');
const Notification = require('./Notification');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
  location: { type: String, required: true },
  // Consultant-specific fields
  companyLogo: { type: String }, // Base64 encoded image (only for consultants)
  companyName: { type: String }, // Company name (only for consultants)
  companyDescription: { type: String }, // Company description (only for consultants)
  category: { type: String }, // Job category (IT, Sales, Marketing, etc.)
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  ctc: {
    min: { type: Number },
    max: { type: Number }
  },
  netSalary: {
    min: { type: Number },
    max: { type: Number }
  },
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'internship-(paid)', 'internship-(unpaid)', 'work-from-home'], required: true },
  vacancies: { type: Number },
  applicationLimit: { type: Number },
  education: { type: String },
  backlogsAllowed: { type: Boolean, default: false },
  requiredSkills: [String],
  experienceLevel: { type: String, enum: ['freshers', 'minimum', 'both', 'entry', 'mid', 'senior', 'executive'] },
  minExperience: { type: Number, default: 0 },
  interviewRoundsCount: { type: Number },
  interviewRoundTypes: {
    technical: { type: Boolean, default: false },
    managerial: { type: Boolean, default: false },
    nonTechnical: { type: Boolean, default: false },
    final: { type: Boolean, default: false },
    hr: { type: Boolean, default: false }
  },
  interviewRoundDetails: {
    technical: {
      description: { type: String },
      date: { type: Date },
      fromDate: { type: Date },
      toDate: { type: Date },
      time: { type: String }
    },
    nonTechnical: {
      description: { type: String },
      date: { type: Date },
      fromDate: { type: Date },
      toDate: { type: Date },
      time: { type: String }
    },
    managerial: {
      description: { type: String },
      date: { type: Date },
      fromDate: { type: Date },
      toDate: { type: Date },
      time: { type: String }
    },
    final: {
      description: { type: String },
      date: { type: Date },
      fromDate: { type: Date },
      toDate: { type: Date },
      time: { type: String }
    },
    hr: {
      description: { type: String },
      date: { type: Date },
      fromDate: { type: Date },
      toDate: { type: Date },
      time: { type: String }
    }
  },
  offerLetterDate: { type: Date },
  transportation: {
    oneWay: { type: Boolean, default: false },
    twoWay: { type: Boolean, default: false },
    noCab: { type: Boolean, default: false }
  },
  status: { type: String, enum: ['active', 'closed', 'draft', 'pending'], default: 'active' },
  applicationCount: { type: Number, default: 0 },
  interviewScheduled: { type: Boolean, default: false }
}, {
  timestamps: true
});

jobSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);