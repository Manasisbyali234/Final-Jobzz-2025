const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const handleValidationErrors = require('../middlewares/validation');

// Authentication Route
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], handleValidationErrors, adminController.loginAdmin);

// Protected Routes
router.use(auth(['admin']));

// Dashboard Route
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/chart-data', adminController.getChartData);

// User Management Routes
router.get('/users', adminController.getUsers);
router.delete('/users/:userType/:userId', adminController.deleteUser);
router.put('/users/:userType/:userId', adminController.updateUser);

// Job Management Routes
router.get('/jobs', adminController.getAllJobs);
router.delete('/jobs/:id', adminController.deleteJob);
router.put('/jobs/:jobId/approve', adminController.approveJob);
router.put('/jobs/:jobId/reject', adminController.rejectJob);

// Employer Management Routes
router.get('/employers', adminController.getAllEmployers);
router.get('/employer-profile/:id', adminController.getEmployerProfile);
router.put('/employer-profile/:id', adminController.updateEmployerProfile);
router.get('/download-document/:employerId/:documentType', adminController.downloadDocument);
router.put('/employers/:id/status', adminController.updateEmployerStatus);
router.delete('/employers/:id', adminController.deleteEmployer);
router.get('/employer-jobs/:employerId', adminController.getEmployerJobs);

// Candidate Management Routes
router.get('/candidates', adminController.getAllCandidates);
router.get('/registered-candidates', adminController.getRegisteredCandidates);
router.get('/candidates/:candidateId', adminController.getCandidateDetails);
router.delete('/candidates/:id', adminController.deleteCandidate);

// Credit Management Routes
router.put('/candidates/:candidateId/credits', adminController.updateCandidateCredits);
router.put('/candidates/credits/bulk', adminController.bulkUpdateCandidateCredits);

// Content Management Routes
router.post('/content/:type', upload.single('image'), [
  body('title').optional().notEmpty(),
  body('content').optional().notEmpty(),
  body('name').optional().notEmpty()
], handleValidationErrors, adminController.createContent);

router.put('/content/:type/:contentId', upload.single('image'), adminController.updateContent);
router.delete('/content/:type/:contentId', adminController.deleteContent);

// Contact Form Management Routes
router.get('/contacts', adminController.getContactForms);
router.delete('/contacts/:contactId', adminController.deleteContactForm);

// Applications Routes
router.get('/applications', adminController.getApplications);

// Placement Management Routes
router.get('/placements', adminController.getAllPlacements);
router.get('/placements/:id', adminController.getPlacementDetails);
router.put('/placements/:id/status', adminController.updatePlacementStatus);
router.post('/placements/:id/process', require('../controllers/placementController').processPlacementApproval);
router.get('/placements/:id/download', adminController.downloadPlacementFile);
router.get('/placements/:id/data', require('../controllers/placementController').getPlacementData);
router.put('/placements/:id/credits', adminController.assignPlacementCredits);

// Site Settings Routes
router.get('/settings', adminController.getSettings);
router.put('/settings', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]), adminController.updateSettings);

module.exports = router;