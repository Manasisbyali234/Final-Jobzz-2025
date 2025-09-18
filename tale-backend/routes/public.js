const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const publicController = require('../controllers/publicController');
const handleValidationErrors = require('../middlewares/validation');
const { upload } = require('../middlewares/upload');

// Job Routes
router.get('/jobs', publicController.getJobs);
router.get('/jobs/search', publicController.searchJobs);
router.get('/jobs/:id', publicController.getJobById);
router.get('/jobs/category/:category', publicController.getJobsByCategory);

// Blog Routes
router.get('/blogs', publicController.getBlogs);
router.get('/blogs/:id', publicController.getBlogById);

// Contact Route
router.post('/contact', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
], handleValidationErrors, publicController.submitContactForm);

// Content Routes
router.get('/testimonials', publicController.getTestimonials);
router.get('/partners', publicController.getPartners);
router.get('/faqs', publicController.getFAQs);

// Public Stats
router.get('/stats', publicController.getPublicStats);

// Employer Profile
router.get('/employers/:id', publicController.getEmployerProfile);
router.get('/employers', publicController.getEmployers);

// Apply for job without login
router.post('/apply-job', upload.single('resume'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('jobId').notEmpty().withMessage('Job ID is required')
], handleValidationErrors, publicController.applyForJob);

module.exports = router;