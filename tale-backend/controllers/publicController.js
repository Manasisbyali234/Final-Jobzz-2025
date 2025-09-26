const Job = require('../models/Job');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Testimonial = require('../models/Testimonial');
const Partner = require('../models/Partner');
const FAQ = require('../models/FAQ');

// Job Controllers
exports.getJobs = async (req, res) => {
  try {
    const { location, jobType, category, search, title, employerId, employmentType, skills, keyword, jobTitle, page = 1, limit = 10, sortBy } = req.query;
    
    let query = { status: { $in: ['active', 'pending'] } };
    
    if (employerId) query.employerId = employerId;
    if (title) query.title = new RegExp(title, 'i');
    if (location) query.location = new RegExp(location, 'i');

    // Handle both jobType and employmentType (employmentType takes priority)
    if (employmentType) {
      query.jobType = employmentType;
    } else if (jobType) {
      if (Array.isArray(jobType)) {
        query.jobType = { $in: jobType };
      } else {
        query.jobType = jobType;
      }
    }
    
    // Combine all search terms
    const searchTerms = [];
    if (search) searchTerms.push(search);
    if (keyword) searchTerms.push(keyword);
    if (jobTitle) searchTerms.push(jobTitle);
    
    if (searchTerms.length > 0) {
      const orConditions = [];
      searchTerms.forEach(term => {
        orConditions.push(
          { title: new RegExp(term, 'i') },
          { description: new RegExp(term, 'i') },
          { requiredSkills: { $in: [new RegExp(term, 'i')] } }
        );
      });
      query.$or = orConditions;
    }
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query.requiredSkills = { $in: skillsArray.map(skill => new RegExp(skill, 'i')) };
    }

    // Determine sort criteria
    let sortCriteria = { createdAt: -1 }; // Default: Most Recent
    
    if (sortBy) {
      switch (sortBy) {
        case 'Most Recent':
          sortCriteria = { createdAt: -1 };
          break;
        case 'Oldest':
          sortCriteria = { createdAt: 1 };
          break;
        case 'Salary High to Low':
          sortCriteria = { 'salary.max': -1, 'salary.min': -1 };
          break;
        case 'Salary Low to High':
          sortCriteria = { 'salary.min': 1, 'salary.max': 1 };
          break;
        case 'A-Z':
          sortCriteria = { title: 1 };
          break;
        case 'Z-A':
          sortCriteria = { title: -1 };
          break;
        default:
          sortCriteria = { createdAt: -1 };
      }
    }

    console.log('Query for jobs:', JSON.stringify(query, null, 2));
    
    const jobs = await Job.find(query)
      .select('title location jobType salary vacancies description requiredSkills status createdAt employerId companyName category ctc netSalary')
      .populate({
        path: 'employerId',
        select: 'companyName status isApproved employerType',
        match: { status: 'active', isApproved: true }
      })
      .sort(sortCriteria)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    console.log(`Found ${jobs.length} jobs before filtering`);
    const approvedJobs = jobs.filter(job => job.employerId);
    console.log(`Found ${approvedJobs.length} jobs after employer approval filtering`);
    
    if (employerId) {
      console.log(`Found ${approvedJobs.length} jobs for employer ${employerId}`);
      console.log('Jobs for employer:', approvedJobs.map(job => ({ 
        title: job.title, 
        employerId: job.employerId?._id,
        status: job.status 
      })));
    }
    
    if (category) {
      console.log(`Found ${approvedJobs.length} jobs after category filter for '${category}'`);
      console.log('Job categories:', approvedJobs.map(job => ({ title: job.title, category: job.category })));
    } 
    
    const EmployerProfile = require('../models/EmployerProfile');
    const jobsWithProfiles = await Promise.all(
      approvedJobs.map(async (job) => {
        const employerProfile = await EmployerProfile.findOne({ employerId: job.employerId._id });
        return {
          ...job.toObject(),
          employerProfile: employerProfile,
          postedBy: job.employerId.employerType === 'consultant' ? 'Consultant' : 'Company'
        };
      })
    );
    
    // Get total count for pagination
    const totalJobs = await Job.countDocuments(query);
    
    res.json({
      success: true,
      jobs: jobsWithProfiles,
      total: jobsWithProfiles.length,
      totalCount: totalJobs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalJobs / parseInt(limit)),
      hasNextPage: parseInt(page) < Math.ceil(totalJobs / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1
    });
  } catch (error) {
    console.error('Error in getJobs:', error);
    // Return empty jobs array when DB is unavailable
    res.json({ success: true, jobs: [], total: 0 });
  }
};

exports.getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const jobs = await Job.find({ 
      status: 'active',
      category: new RegExp(category, 'i')
    })
    .populate({
      path: 'employerId',
      select: 'companyName status isApproved employerType',
      match: { status: 'active', isApproved: true }
    })
    .sort({ createdAt: -1 });
    
    const approvedJobs = jobs.filter(job => job.employerId);
    const roles = [...new Set(approvedJobs.map(job => job.title))];
    
    res.json({ success: true, roles, jobs: approvedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employerId', 'companyName email phone employerType');
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Get employer profile for logo and cover image
    const EmployerProfile = require('../models/EmployerProfile');
    const employerProfile = await EmployerProfile.findOne({ employerId: job.employerId._id });
    
    // Add profile data to job object
    const jobWithProfile = {
      ...job.toObject(),
      employerProfile: employerProfile,
      postedBy: job.employerId.employerType === 'consultant' ? 'Consultant' : 'Company'
    };

    res.json({ success: true, job: jobWithProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    const { q, location, jobType } = req.query;
    
    let query = { status: 'active' };
    
    if (q) {
      query.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { skills: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    if (location) query.location = new RegExp(location, 'i');
    if (jobType) query.jobType = jobType;

    const jobs = await Job.find(query)
      .populate({
        path: 'employerId',
        select: 'companyName status isApproved employerType',
        match: { status: 'active', isApproved: true }
      })
      .sort({ createdAt: -1 });

    // Filter out jobs where employer is not approved
    const filteredJobs = jobs.filter(job => job.employerId);

    res.json({ success: true, jobs: filteredJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Blog Controllers
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    
    let query = { isPublished: true };
    if (category) query.category = category;
    
    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isPublished: true 
    }).populate('author', 'name');
    
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.views += 1;
    await blog.save();

    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Contact Controller
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const contact = await Contact.create({
      name, email, phone, subject, message
    });

    res.status(201).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      contact 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Content Controllers
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    res.json({ success: true, partners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    
    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public stats for homepage (no auth)
exports.getPublicStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ status: { $in: ['active', 'pending', 'closed', 'draft'] } });
    const totalEmployers = await require('../models/Employer').countDocuments();
    const totalApplications = await require('../models/Application').countDocuments();

    res.json({
      success: true,
      stats: {
        totalJobs,
        totalEmployers,
        totalApplications,
      },
    });
  } catch (error) {
    // Return fallback stats when DB is unavailable
    res.json({
      success: true,
      stats: {
        totalJobs: 0,
        totalEmployers: 0,
        totalApplications: 0,
      },
    });
  }
};

exports.getEmployerProfile = async (req, res) => {
  try {
    const EmployerProfile = require('../models/EmployerProfile');
    const Employer = require('../models/Employer');
    
    let profile = await EmployerProfile.findOne({ employerId: req.params.id })
      .populate('employerId', 'name email phone companyName');
    
    // If no profile exists, create basic profile from employer data
    if (!profile) {
      const employer = await Employer.findById(req.params.id);
      if (!employer) {
        return res.status(404).json({ success: false, message: 'Employer not found' });
      }
      
      profile = {
        employerId: employer,
        companyName: employer.companyName,
        email: employer.email,
        phone: employer.phone,
        description: 'No company description available.'
      };
    }

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployers = async (req, res) => {
  try {
    const Employer = require('../models/Employer');
    const employers = await Employer.find({ status: 'active', isApproved: true }).select('-password');
    
    res.json({ success: true, employers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apply for job without login
exports.applyForJob = async (req, res) => {
  try {
    const { name, email, phone, message, jobId } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !jobId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, phone, and job ID are required' 
      });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Job post ended' });
    }
    if (typeof job.applicationLimit === 'number' && job.applicationLimit > 0 && job.applicationCount >= job.applicationLimit) {
      return res.status(400).json({ success: false, message: 'Job post ended: application limit reached' });
    }

    // Handle file upload if resume is provided
    let resumeData = null;
    if (req.file) {
      const { fileToBase64 } = require('../middlewares/upload');
      resumeData = {
        filename: req.file.originalname,
        originalName: req.file.originalname,
        data: fileToBase64(req.file),
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }

    // Create application record
    const Application = require('../models/Application');
    const application = await Application.create({
      jobId,
      candidateId: null, // No candidate ID for non-logged-in users
      applicantName: name,
      applicantEmail: email,
      applicantPhone: phone,
      coverLetter: message || '',
      resume: resumeData,
      status: 'pending',
      appliedAt: new Date(),
      isGuestApplication: true
    });

    // Increment the job's application count and close if limit reached
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });
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

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Error in applyForJob:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};