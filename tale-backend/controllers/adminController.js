const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Candidate = require('../models/Candidate');
const CandidateProfile = require('../models/CandidateProfile');
const Employer = require('../models/Employer');
const Placement = require('../models/Placement');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const Partner = require('../models/Partner');
const SiteSettings = require('../models/SiteSettings');
const EmployerProfile = require('../models/EmployerProfile');
const { base64ToBuffer, generateFilename } = require('../utils/base64Helper');
const { createNotification } = require('./notificationController');
const mongoose = require('mongoose');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Authentication Controller
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (admin.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Account is inactive' });
    }

    const token = generateToken(admin._id, 'admin');

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dashboard Statistics Controller
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const totalEmployers = await Employer.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const pendingJobs = await Job.countDocuments({ status: 'pending' });

    const stats = {
      totalCandidates,
      totalEmployers,
      totalJobs,
      totalApplications,
      activeJobs,
      pendingJobs
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Chart Data Controller
exports.getChartData = async (req, res) => {
  try {
    // Get monthly application data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyApplications = await Application.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyEmployers = await Employer.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get top employers by job count
    const topEmployers = await Job.aggregate([
      { $match: { status: 'active' } },
      {
        $lookup: {
          from: 'employers',
          localField: 'employerId',
          foreignField: '_id',
          as: 'employer'
        }
      },
      { $unwind: '$employer' },
      {
        $group: {
          _id: '$employerId',
          companyName: { $first: '$employer.companyName' },
          jobCount: { $sum: 1 }
        }
      },
      { $sort: { jobCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      chartData: {
        monthlyApplications,
        monthlyEmployers,
        topEmployers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User Management Controllers
exports.getUsers = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    
    let users;
    if (type === 'candidates') {
      users = await Candidate.find().select('-password')
        .limit(limit * 1).skip((page - 1) * limit);
    } else if (type === 'employers') {
      users = await Employer.find().select('-password')
        .limit(limit * 1).skip((page - 1) * limit);
    } else {
      const candidates = await Candidate.find().select('-password').limit(5);
      const employers = await Employer.find().select('-password').limit(5);
      users = { candidates, employers };
    }

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    
    if (userType === 'candidate') {
      await Candidate.findByIdAndDelete(userId);
    } else if (userType === 'employer') {
      await Employer.findByIdAndDelete(userId);
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    
    let user;
    if (userType === 'candidate') {
      user = await Candidate.findByIdAndUpdate(userId, req.body, { new: true }).select('-password');
    } else if (userType === 'employer') {
      user = await Employer.findByIdAndUpdate(userId, req.body, { new: true }).select('-password');
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Job Management Controllers
exports.approveJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { status: 'active' },
      { new: true }
    );

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { status: 'closed' },
      { new: true }
    );

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const jobs = await Job.find(query)
      .populate('employerId', 'companyName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllEmployers = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const employers = await Employer.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ success: true, data: employers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const candidates = await Candidate.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ success: true, data: candidates, candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEmployerStatus = async (req, res) => {
  try {
    const { status, isApproved } = req.body;

    const updateData = {};

    // Normalize and validate status to only 'active' | 'inactive'
    if (status !== undefined) {
      const normalized = String(status).toLowerCase();
      if (normalized === 'approved') {
        updateData.status = 'active';
      } else if (normalized === 'rejected') {
        updateData.status = 'inactive';
      } else if (normalized === 'active' || normalized === 'inactive') {
        updateData.status = normalized;
      }
      // Any other status values are ignored to prevent invalid writes
    }

    // Update approval flag
    if (isApproved !== undefined) updateData.isApproved = !!isApproved;

    // If approving and no explicit status provided, ensure account is active
    if (updateData.isApproved === true && updateData.status === undefined) {
      updateData.status = 'active';
    }
    
    const employer = await Employer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer not found' });
    }

    // Create notification for employer
    if (isApproved !== undefined) {
      const notificationData = {
        title: isApproved ? 'Account Approved' : 'Account Rejected',
        message: isApproved 
          ? 'Your employer account has been approved. You can now post jobs.' 
          : 'Your employer account has been rejected. Please contact support for more information.',
        type: isApproved ? 'profile_approved' : 'profile_rejected',
        role: 'employer',
        relatedId: employer._id,
        createdBy: req.user.id
      };
      
      await createNotification(notificationData);
    }

    res.json({ success: true, employer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEmployer = async (req, res) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);
    
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer not found' });
    }

    res.json({ success: true, message: 'Employer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployerProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ employerId: req.params.id })
      .populate('employerId', 'name email phone companyName');
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Employer profile not found' });
    }

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEmployerProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOneAndUpdate(
      { employerId: req.params.id },
      req.body,
      { new: true }
    ).populate('employerId', 'name email phone companyName');
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Employer profile not found' });
    }

    // Check if any document verification status was updated and create notification
    try {
      const verificationFields = {
        panCardVerified: 'PAN Card',
        cinVerified: 'CIN Document',
        gstVerified: 'GST Certificate',
        incorporationVerified: 'Certificate of Incorporation',
        authorizationVerified: 'Authorization Letter'
      };

      for (const [field, documentName] of Object.entries(verificationFields)) {
        if (req.body[field] && (req.body[field] === 'approved' || req.body[field] === 'rejected')) {
          const notificationData = {
            title: `Document ${req.body[field] === 'approved' ? 'Approved' : 'Rejected'}`,
            message: `Your ${documentName} has been ${req.body[field]} by admin.`,
            type: req.body[field] === 'approved' ? 'profile_approved' : 'profile_rejected',
            role: 'employer',
            relatedId: new mongoose.Types.ObjectId(req.params.id),
            createdBy: new mongoose.Types.ObjectId(req.user.id)
          };
          
          console.log('Creating notification:', notificationData);
          const createdNotification = await createNotification(notificationData);
          console.log('Notification created:', createdNotification);
        }
      }
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Continue execution even if notification fails
    }

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Download Base64 document
exports.downloadDocument = async (req, res) => {
  try {
    const { employerId, documentType } = req.params;
    
    const profile = await EmployerProfile.findOne({ employerId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const base64Data = profile[documentType];
    if (!base64Data) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const { buffer, mimeType, extension } = base64ToBuffer(base64Data);
    const filename = generateFilename(documentType, extension);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Content Management Controllers
exports.createContent = async (req, res) => {
  try {
    const { type } = req.params;
    let content;

    switch (type) {
      case 'blog':
        content = await Blog.create({ ...req.body, author: req.user._id });
        break;
      case 'testimonial':
        content = await Testimonial.create(req.body);
        break;
      case 'faq':
        content = await FAQ.create(req.body);
        break;
      case 'partner':
        content = await Partner.create(req.body);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid content type' });
    }

    res.status(201).json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { type, contentId } = req.params;
    let content;

    switch (type) {
      case 'blog':
        content = await Blog.findByIdAndUpdate(contentId, req.body, { new: true });
        break;
      case 'testimonial':
        content = await Testimonial.findByIdAndUpdate(contentId, req.body, { new: true });
        break;
      case 'faq':
        content = await FAQ.findByIdAndUpdate(contentId, req.body, { new: true });
        break;
      case 'partner':
        content = await Partner.findByIdAndUpdate(contentId, req.body, { new: true });
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid content type' });
    }

    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { type, contentId } = req.params;

    switch (type) {
      case 'blog':
        await Blog.findByIdAndDelete(contentId);
        break;
      case 'testimonial':
        await Testimonial.findByIdAndDelete(contentId);
        break;
      case 'faq':
        await FAQ.findByIdAndDelete(contentId);
        break;
      case 'partner':
        await Partner.findByIdAndDelete(contentId);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid content type' });
    }

    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Contact Form Management Controllers
exports.getContactForms = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteContactForm = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.contactId);
    res.json({ success: true, message: 'Contact form deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Site Settings Controllers
exports.updateSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const applications = await Application.find(filter)
      .populate('candidateId', 'name email phone')
      .populate('employerId', 'companyName email')
      .populate('jobId', 'title location')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRegisteredCandidates = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const candidates = await Candidate.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get profiles for each candidate
    const candidatesWithProfiles = await Promise.all(
      candidates.map(async (candidate) => {
        const profile = await CandidateProfile.findOne({ candidateId: candidate._id });
        return {
          ...candidate.toObject(),
          profile: profile || null,
          hasProfile: !!profile
        };
      })
    );

    res.json({ success: true, data: candidatesWithProfiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCandidateDetails = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findById(candidateId).select('-password');
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const profile = await CandidateProfile.findOne({ candidateId });
    
    // Get candidate's job applications with company details
    const applications = await Application.find({ candidateId })
      .populate({
        path: 'jobId',
        select: 'title category location',
        populate: {
          path: 'employerId',
          select: 'companyName'
        }
      })
      .populate('employerId', 'companyName')
      .sort({ createdAt: -1 });

    // Format applications data for the frontend
    const formattedApplications = applications.map(app => ({
      companyName: app.jobId?.employerId?.companyName || app.employerId?.companyName || 'N/A',
      jobCategory: app.jobId?.category || 'N/A',
      shortlistedStatus: app.status === 'shortlisted' || app.status === 'interview_scheduled' || app.status === 'selected',
      currentRound: app.interviewRound || (app.status === 'applied' ? 'Initial' : app.status),
      selected: app.status === 'selected',
      appliedDate: app.createdAt,
      createdAt: app.createdAt
    }));
    
    const candidateWithProfile = {
      ...candidate.toObject(),
      ...profile?.toObject(),
      hasProfile: !!profile,
      applications: formattedApplications
    };

    res.json({ success: true, candidate: candidateWithProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployerJobs = async (req, res) => {
  try {
    const { employerId } = req.params;
    
    const jobs = await Job.find({ employerId })
      .select('title status createdAt')
      .sort({ createdAt: -1 });

    const jobCount = jobs.length;

    res.json({ success: true, jobs, jobCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Placement Management Controllers
exports.getAllPlacements = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const placements = await Placement.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ success: true, data: placements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePlacementStatus = async (req, res) => {
  try {
    const { status, isApproved } = req.body;

    const updateData = {};
    if (status !== undefined) {
      const normalized = String(status).toLowerCase();
      if (normalized === 'approved') {
        updateData.status = 'active';
      } else if (normalized === 'rejected') {
        updateData.status = 'inactive';
      }
    }

    if (isApproved !== undefined) updateData.isApproved = !!isApproved;
    if (updateData.isApproved === true && updateData.status === undefined) {
      updateData.status = 'active';
    }
    
    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement officer not found' });
    }

    // If approved and has student data, automatically process candidates
    if (updateData.status === 'active' && placement.studentData && !placement.isProcessed) {
      console.log('Triggering background processing for placement:', placement._id);
    }

    res.json({ success: true, placement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPlacementDetails = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id).select('-password');
    
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement officer not found' });
    }

    res.json({ success: true, placement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.downloadPlacementFile = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement || !placement.studentData) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const { buffer, mimeType } = base64ToBuffer(placement.studentData);
    const filename = placement.fileName || 'student_data.xlsx';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignPlacementCredits = async (req, res) => {
  try {
    const { credits } = req.body;
    const creditsNum = Math.min(10000, Math.max(0, parseInt(credits) || 0));
    
    const placement = await Placement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement officer not found' });
    }

    // Update Excel/CSV file with credits if file exists
    let updatedStudentData = placement.studentData;
    if (placement.studentData && placement.fileType) {
      try {
        const XLSX = require('xlsx');
        const { buffer } = base64ToBuffer(placement.studentData);
        
        let workbook;
        if (placement.fileType.includes('csv')) {
          // Handle CSV
          const csvData = buffer.toString('utf8');
          workbook = XLSX.read(csvData, { type: 'string' });
        } else {
          // Handle Excel
          workbook = XLSX.read(buffer, { type: 'buffer' });
        }
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Add Credits Assigned column to all rows
        const updatedData = jsonData.map(row => ({
          ...row,
          'Credits Assigned': creditsNum
        }));
        
        // Convert back to Excel/CSV
        const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
        
        let newBuffer;
        let mimeType;
        if (placement.fileType.includes('csv')) {
          const csvOutput = XLSX.utils.sheet_to_csv(newWorksheet);
          newBuffer = Buffer.from(csvOutput, 'utf8');
          mimeType = 'text/csv';
        } else {
          newBuffer = XLSX.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' });
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }
        
        updatedStudentData = `data:${mimeType};base64,${newBuffer.toString('base64')}`;
      } catch (fileError) {
        console.error('Error updating file:', fileError);
      }
    }
    
    const updatedPlacement = await Placement.findByIdAndUpdate(
      req.params.id,
      { 
        credits: creditsNum,
        studentData: updatedStudentData
      },
      { new: true, runValidators: true }
    ).select('-password');

    // Update all candidates linked to this placement with new credits
    const placementObjectId = new mongoose.Types.ObjectId(req.params.id);
    const updateResult = await Candidate.updateMany(
      { placementId: placementObjectId },
      { $set: { credits: creditsNum } }
    );

    console.log(`Updated credits to ${creditsNum} for ${updateResult.modifiedCount} candidates linked to placement ${req.params.id}`);
    console.log('Update result:', updateResult);

    res.json({ success: true, placement: updatedPlacement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Credit Management Controllers
exports.updateCandidateCredits = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { creditsToAdd } = req.body;
    
    if (typeof creditsToAdd !== 'number') {
      return res.status(400).json({ success: false, message: 'Credits must be a number' });
    }
    
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    
    const newCredits = Math.max(0, (candidate.credits || 0) + creditsToAdd);
    
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { credits: newCredits },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, candidate: updatedCandidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkUpdateCandidateCredits = async (req, res) => {
  try {
    const { creditsToAdd, candidateIds } = req.body;
    
    if (typeof creditsToAdd !== 'number' || !Array.isArray(candidateIds)) {
      return res.status(400).json({ success: false, message: 'Invalid request data' });
    }
    
    // Get all candidates to calculate new credits
    const candidates = await Candidate.find({ _id: { $in: candidateIds } });
    
    // Update each candidate's credits
    const updatePromises = candidates.map(candidate => {
      const newCredits = Math.max(0, (candidate.credits || 0) + creditsToAdd);
      return Candidate.findByIdAndUpdate(
        candidate._id,
        { credits: newCredits },
        { new: true }
      );
    });
    
    await Promise.all(updatePromises);
    
    res.json({ 
      success: true, 
      message: `Successfully updated credits for ${candidates.length} candidates`,
      updatedCount: candidates.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCandidatesForCredits = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .select('name email credits registrationMethod placementId')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};