const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');
const CandidateProfile = require('../models/CandidateProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Message = require('../models/Message');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Authentication Controllers
exports.registerCandidate = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const candidate = await Candidate.create({ name, email, password, phone });
    await CandidateProfile.create({ candidateId: candidate._id });

    const token = generateToken(candidate._id, 'candidate');

    res.status(201).json({
      success: true,
      token,
      candidate: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await Candidate.findOne({ email });
    if (!candidate || !(await candidate.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (candidate.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Account is inactive' });
    }

    const token = generateToken(candidate._id, 'candidate');

    res.json({
      success: true,
      token,
      candidate: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Profile Controllers
exports.getProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ candidateId: req.user._id })
      .populate('candidateId', 'name email phone');
    
    if (!profile) {
      return res.json({ success: true, profile: null });
    }

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('User ID:', req.user._id);
    
    const { name, phone, email, ...profileData } = req.body;
    
    // Update candidate basic info
    if (name || phone || email) {
      const updatedCandidate = await Candidate.findByIdAndUpdate(req.user._id, {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email && { email })
      }, { new: true });
      console.log('Updated candidate:', updatedCandidate);
    }
    
    // Prepare profile update data
    const updateData = { ...profileData };
    if (req.file) {
      const { fileToBase64 } = require('../middlewares/upload');
      updateData.profilePicture = fileToBase64(req.file);
    }
    
    // Update profile data
    const profile = await CandidateProfile.findOneAndUpdate(
      { candidateId: req.user._id },
      updateData,
      { new: true, upsert: true }
    ).populate('candidateId', 'name email phone');
    
    console.log('Updated profile:', profile);
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { fileToBase64 } = require('../middlewares/upload');
    const resumeBase64 = fileToBase64(req.file);

    const profile = await CandidateProfile.findOneAndUpdate(
      { candidateId: req.user._id },
      { resume: resumeBase64 },
      { new: true, upsert: true }
    );

    res.json({ success: true, resume: resumeBase64, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadMarksheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { fileToBase64 } = require('../middlewares/upload');
    const marksheetBase64 = fileToBase64(req.file);

    res.json({ success: true, filePath: marksheetBase64 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Job Controllers
exports.applyForJob = async (req, res) => {
  try {
    const { coverLetter, jobId: bodyJobId } = req.body;
    const jobId = req.params.jobId || bodyJobId;
    
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Block applying if job is not active or application limit reached
    if (job.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Job post ended' });
    }
    if (typeof job.applicationLimit === 'number' && job.applicationLimit > 0 && job.applicationCount >= job.applicationLimit) {
      return res.status(400).json({ success: false, message: 'Job post ended: application limit reached' });
    }

    const existingApplication = await Application.findOne({
      jobId,
      candidateId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    const profile = await CandidateProfile.findOne({ candidateId: req.user._id });
    
    const application = await Application.create({
      jobId,
      candidateId: req.user._id,
      employerId: job.employerId,
      coverLetter,
      resume: profile?.resume
    });

    // Update job application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    // Create notification for candidate if job has scheduled interviews
    if (job.interviewScheduled && job.interviewRoundDetails) {
      try {
        const { createNotification } = require('./notificationController');
        
        // Get scheduled rounds with details
        const scheduledRounds = [];
        Object.entries(job.interviewRoundTypes).forEach(([roundType, isSelected]) => {
          if (isSelected && job.interviewRoundDetails[roundType]) {
            const details = job.interviewRoundDetails[roundType];
            if (details.date && details.time) {
              const roundNames = {
                technical: 'Technical Round',
                nonTechnical: 'Non-Technical Round', 
                managerial: 'Managerial Round',
                final: 'Final Round',
                hr: 'HR Round'
              };
              scheduledRounds.push({
                name: roundNames[roundType],
                date: new Date(details.date).toLocaleDateString(),
                time: details.time,
                description: details.description
              });
            }
          }
        });
        
        if (scheduledRounds.length > 0) {
          let message = `Your application for ${job.title} has been received. Interview rounds scheduled:\n\n`;
          scheduledRounds.forEach((round, index) => {
            message += `${index + 1}. ${round.name}\n`;
            message += `   Date: ${round.date}\n`;
            message += `   Time: ${round.time}\n`;
            if (round.description) {
              message += `   Details: ${round.description}\n`;
            }
            message += '\n';
          });
          message += 'Please be prepared and arrive on time. Good luck!';
          
          await createNotification({
            title: 'Interview Schedule - Application Received',
            message: message,
            type: 'interview_scheduled',
            role: 'candidate',
            relatedId: application._id,
            createdBy: job.employerId,
            candidateId: req.user._id
          });
        }
      } catch (notifError) {
        console.error('Notification creation failed:', notifError);
      }
    }

    // If we just hit the limit, mark job as closed
    const updatedJob = await Job.findById(jobId).select('applicationCount applicationLimit status');
    if (
      updatedJob &&
      typeof updatedJob.applicationLimit === 'number' &&
      updatedJob.applicationLimit > 0 &&
      updatedJob.applicationCount >= updatedJob.applicationLimit &&
      updatedJob.status !== 'closed'
    ) {
      await Job.findByIdAndUpdate(jobId, { status: 'closed' });
    }

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate('jobId', 'title location jobType status interviewRoundsCount interviewRoundTypes')
      .populate('employerId', 'companyName')
      .sort({ createdAt: -1 });

    console.log('Applications found:', applications.length);
    if (applications.length > 0) {
      console.log('First application jobId:', applications[0].jobId);
      console.log('Job interviewRoundTypes:', applications[0].jobId?.interviewRoundTypes);
      console.log('Interview rounds data:', applications[0].interviewRounds);
    }

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Application Status Controller
exports.getApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.applicationId,
      candidateId: req.user._id
    })
    .populate('jobId', 'title interviewRoundsCount interviewRoundTypes')
    .populate('employerId', 'companyName');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Message Controllers
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const conversationId = [req.user._id, receiverId].sort().join('-');
    
    const newMessage = await Message.create({
      senderId: req.user._id,
      senderModel: 'Candidate',
      receiverId,
      receiverModel: 'Employer',
      message,
      conversationId
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name')
      .populate('receiverId', 'name companyName')
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Password Management Controllers
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const candidate = await Candidate.findOne({ email });
    
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const resetToken = require('crypto').randomBytes(32).toString('hex');
    candidate.resetPasswordToken = resetToken;
    candidate.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await candidate.save();

    const { sendResetEmail } = require('../utils/emailService');
    await sendResetEmail(email, resetToken, 'candidate');

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.confirmResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const candidate = await Candidate.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!candidate) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    candidate.password = newPassword;
    candidate.resetPasswordToken = undefined;
    candidate.resetPasswordExpires = undefined;
    await candidate.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const candidate = await Candidate.findById(req.user._id);
    
    if (!(await candidate.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    candidate.password = newPassword;
    await candidate.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const candidateId = req.user._id;
    
    const applied = await Application.countDocuments({ candidateId });
    const inProgress = await Application.countDocuments({ candidateId, status: { $in: ['pending', 'interviewed'] } });
    const shortlisted = await Application.countDocuments({ candidateId, status: 'shortlisted' });
    
    const recentApplications = await Application.find({ candidateId })
      .populate('jobId', 'title location')
      .populate('employerId', 'companyName')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      success: true,
      stats: { applied, inProgress, shortlisted },
      recentApplications,
      candidate: { name: req.user.name }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const candidateId = req.user._id;
    
    const applied = await Application.countDocuments({ candidateId });
    const inProgress = await Application.countDocuments({ candidateId, status: { $in: ['pending', 'interviewed'] } });
    const shortlisted = await Application.countDocuments({ candidateId, status: 'shortlisted' });
    
    res.json({
      success: true,
      stats: { applied, inProgress, shortlisted },
      candidate: { name: req.user.name }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCandidateApplicationsWithInterviews = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate('jobId', 'title location jobType status interviewRoundsCount interviewRoundTypes')
      .populate('employerId', 'companyName')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};