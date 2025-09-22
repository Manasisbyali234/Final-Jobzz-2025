const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const employerController = require('../controllers/employerController');
const employerPasswordController = require('../controllers/employerPasswordController');
const auth = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const handleValidationErrors = require('../middlewares/validation');

// Authentication Routes
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('companyName').notEmpty().withMessage('Company name is required')
], handleValidationErrors, employerController.registerEmployer);

router.post('/login', employerController.loginEmployer);

// Password Reset Routes (Public - before auth middleware)
router.post('/password/reset', [
  body('email').isEmail().withMessage('Valid email is required')
], handleValidationErrors, employerPasswordController.resetPassword);

router.post('/password/confirm-reset', [
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], handleValidationErrors, employerPasswordController.confirmResetPassword);

// Protected Routes
router.use(auth(['employer']));

// Profile Management Routes
router.get('/profile', employerController.getProfile);
router.put('/profile', employerController.updateProfile);
router.post('/profile/logo', upload.single('logo'), employerController.uploadLogo);
router.post('/profile/cover', upload.single('cover'), employerController.uploadCover);
router.post('/profile/document', upload.single('document'), employerController.uploadDocument);

// Job Management Routes
router.get('/jobs', employerController.getEmployerJobs);
router.get('/recent-jobs', employerController.getRecentJobs);
router.post('/jobs', [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('jobType').isIn(['full-time', 'part-time', 'contract', 'internship', 'internship-(paid)', 'internship-(unpaid)', 'work-from-home']).withMessage('Invalid job type')
], handleValidationErrors, employerController.createJob);

router.put('/jobs/:jobId', employerController.updateJob);
router.delete('/jobs/:jobId', employerController.deleteJob);

// Application Management Routes
router.get('/applications', employerController.getEmployerApplications);
router.get('/jobs/:jobId/applications', employerController.getJobApplications);
router.put('/applications/:applicationId/review', employerController.saveInterviewReview);
router.get('/applications/:applicationId', employerController.getApplicationDetails);
router.put('/applications/:applicationId/status', [
  body('status').isIn(['pending', 'shortlisted', 'interviewed', 'hired', 'rejected']).withMessage('Invalid status')
], handleValidationErrors, employerController.updateApplicationStatus);

// Messaging Routes
router.post('/messages', [
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('message').notEmpty().withMessage('Message is required')
], handleValidationErrors, employerController.sendMessage);

router.get('/messages/:conversationId', employerController.getMessages);

// Dashboard Routes
router.get('/dashboard/stats', employerController.getDashboardStats);
router.get('/profile/completion', employerController.getProfileCompletion);
router.get('/recent-activity', employerController.getRecentActivity);

// Consultant Routes
router.get('/consultant/companies', employerController.getConsultantCompanies);

// Subscription Management Routes
router.post('/subscription', employerController.createSubscription);
router.get('/subscription', employerController.getSubscription);
router.put('/subscription', employerController.updateSubscription);

module.exports = router;