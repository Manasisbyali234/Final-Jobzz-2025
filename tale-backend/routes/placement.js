const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const placementController = require('../controllers/placementController');
const handleValidationErrors = require('../middlewares/validation');
const { upload } = require('../middlewares/upload');

// Registration route with file upload
router.post('/register', upload.single('studentData'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], handleValidationErrors, placementController.registerPlacement);

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], handleValidationErrors, placementController.loginPlacement);

module.exports = router;