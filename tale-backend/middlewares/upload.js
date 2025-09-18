const multer = require('multer');

// Store files in memory for Base64 conversion
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    if (file.mimetype === 'application/pdf' || file.mimetype.includes('document')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files allowed for resume'), false);
    }
  } else if (file.fieldname === 'document') {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files allowed for documents'), false);
    }
  } else {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Helper function to convert file to Base64
const fileToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

module.exports = { upload, fileToBase64 };