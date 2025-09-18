const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
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
  })
], handleValidationErrors, candidateController.registerCandidate);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], handleValidationErrors, candidateController.loginCandidate);

// Password Reset Routes (Public - before auth middleware)
router.post('/password/reset', [
  body('email').isEmail().withMessage('Valid email is required')
], handleValidationErrors, candidateController.resetPassword);

router.post('/password/confirm-reset', [
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], handleValidationErrors, candidateController.confirmResetPassword);

// Protected Routes
router.use(auth(['candidate']));

// Profile Management Routes
router.get('/profile', candidateController.getProfile);
router.put('/profile', upload.single('profilePicture'), candidateController.updateProfile);
router.post('/upload-resume', upload.single('resume'), candidateController.uploadResume);
router.post('/upload-marksheet', upload.single('marksheet'), candidateController.uploadMarksheet);

// Dashboard Routes
router.get('/dashboard', candidateController.getDashboard);
router.get('/dashboard/stats', candidateController.getDashboardStats);

// Job Application Routes
router.post('/jobs/:jobId/apply', [
  body('coverLetter').optional().isString()
], handleValidationErrors, candidateController.applyForJob);

router.post('/applications', candidateController.applyForJob);
router.post('/apply/:jobId', candidateController.applyForJob);
router.get('/applications', candidateController.getAppliedJobs);
router.get('/applications/:applicationId/status', candidateController.getApplicationStatus);

// Messaging Routes
router.post('/messages', [
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('message').notEmpty().withMessage('Message is required')
], handleValidationErrors, candidateController.sendMessage);

router.get('/messages/:conversationId', candidateController.getMessages);

// Password Management Routes
router.put('/password/change', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], handleValidationErrors, candidateController.changePassword);

module.exports = router;