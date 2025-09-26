const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Placement = require('../models/Placement');
const Candidate = require('../models/Candidate');
const CandidateProfile = require('../models/CandidateProfile');
const { createNotification } = require('./notificationController');
const XLSX = require('xlsx');
const { base64ToBuffer } = require('../utils/base64Helper');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.registerPlacement = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingPlacement = await Placement.findOne({ email });
    if (existingPlacement) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    let placementData = { name, email, password, phone };

    // Handle file upload if present
    if (req.file) {
      const { fileToBase64 } = require('../middlewares/upload');
      placementData.studentData = fileToBase64(req.file);
      placementData.fileName = req.file.originalname;
      placementData.fileType = req.file.mimetype;
    }

    const placement = await Placement.create(placementData);
    const token = generateToken(placement._id, 'placement');

    res.status(201).json({
      success: true,
      token,
      placement: {
        id: placement._id,
        name: placement.name,
        email: placement.email,
        phone: placement.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.loginPlacement = async (req, res) => {
  try {
    const { email, password } = req.body;

    const placement = await Placement.findOne({ email });
    if (!placement || !(await placement.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (placement.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Account is inactive' });
    }

    const token = generateToken(placement._id, 'placement');

    res.json({
      success: true,
      token,
      placement: {
        id: placement._id,
        name: placement.name,
        email: placement.email,
        phone: placement.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get parsed data from Excel/CSV file for viewing
exports.getPlacementData = async (req, res) => {
  try {
    const placementId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(placementId)) {
      return res.status(400).json({ success: false, message: 'Invalid placement ID format' });
    }
    
    const placement = await Placement.findById(placementId);
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement officer not found' });
    }

    // If placement is processed, get data from database
    if (placement.isProcessed) {
      const candidates = await Candidate.find({ placementId }).select('name email password phone credits');
      const students = candidates.map(candidate => ({
        name: candidate.name,
        email: candidate.email,
        password: candidate.password,
        phone: candidate.phone,
        credits: candidate.credits
      }));
      
      return res.json({
        success: true,
        students: students
      });
    }

    if (!placement.studentData) {
      return res.status(400).json({ success: false, message: 'No student data file found' });
    }

    // Parse Excel file
    const result = base64ToBuffer(placement.studentData);
    const buffer = result.buffer;

    let workbook;
    if (placement.fileType && placement.fileType.includes('csv')) {
      const csvData = buffer.toString('utf8');
      workbook = XLSX.read(csvData, { type: 'string' });
    } else {
      workbook = XLSX.read(buffer, { type: 'buffer' });
    }
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Parse and format data
    const students = jsonData.map(row => ({
      name: row.Name || row.name || row.NAME || row['Full Name'] || row['full name'] || '',
      email: row.Email || row.email || row.EMAIL || '',
      password: row.Password || row.password || row.PASSWORD || '',
      phone: row.Phone || row.phone || row.PHONE || row.Mobile || row.mobile || '',
      credits: parseInt(row.Credits || row.credits || row.CREDITS || row.Credit || row.credit || placement.credits || 0)
    }));
    
    res.json({
      success: true,
      students: students
    });
    
  } catch (error) {
    console.error('Error getting placement data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process Excel file and create candidates after placement approval
exports.processPlacementApproval = async (req, res) => {
  try {
    const placementId = req.params.id;
    console.log('Processing placement:', placementId);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(placementId)) {
      return res.status(400).json({ success: false, message: 'Invalid placement ID format' });
    }
    
    const placement = await Placement.findById(placementId);
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement officer not found' });
    }

    console.log('Placement found:', placement.name);
    console.log('Has student data:', !!placement.studentData);

    if (!placement.studentData) {
      return res.status(400).json({ success: false, message: 'No student data file found' });
    }

    // Parse Excel file
    let buffer;
    try {
      const result = base64ToBuffer(placement.studentData);
      buffer = result.buffer;
    } catch (bufferError) {
      console.error('Buffer conversion error:', bufferError);
      return res.status(400).json({ success: false, message: 'Invalid file format' });
    }

    let workbook;
    try {
      if (placement.fileType && placement.fileType.includes('csv')) {
        const csvData = buffer.toString('utf8');
        workbook = XLSX.read(csvData, { type: 'string' });
      } else {
        workbook = XLSX.read(buffer, { type: 'buffer' });
      }
    } catch (xlsxError) {
      console.error('XLSX parsing error:', xlsxError);
      return res.status(400).json({ success: false, message: 'Failed to parse Excel file' });
    }
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('Parsed rows:', jsonData.length);
    
    let createdCount = 0;
    let skippedCount = 0;
    const errors = [];
    
    // Process each row from Excel
    for (const row of jsonData) {
      try {
        console.log('Processing row:', row);
        // Extract data from Excel (case-insensitive)
        const email = row.Email || row.email || row.EMAIL;
        const password = row.Password || row.password || row.PASSWORD;
        const name = row.Name || row.name || row.NAME || row['Full Name'] || row['full name'];
        const phone = row.Phone || row.phone || row.PHONE || row.Mobile || row.mobile;
        const credits = parseInt(row.Credits || row.credits || row.CREDITS || row.Credit || row.credit || 0);
        
        console.log('Extracted data:', { name, email, password: password ? '***' : 'MISSING', phone, credits });
        
        if (!email || !password || !name) {
          console.log('Missing required fields for row');
          errors.push(`Row missing required fields`);
          continue;
        }
        
        // Check if candidate already exists
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
          skippedCount++;
          continue;
        }
        
        // Create candidate with exact credits from placement officer
        const finalCredits = placement.credits || 0;
        console.log('Creating candidate:', { name, email, password: password, phone, credits: finalCredits });
        const candidate = await Candidate.create({
          name,
          email,
          password,
          phone: phone || '',
          credits: finalCredits,
          registrationMethod: 'placement',
          placementId: placement._id,
          isVerified: true,
          status: 'active'
        });
        console.log('Candidate created:', candidate.email, 'with credits:', candidate.credits);
        
        // Create candidate profile
        await CandidateProfile.create({ candidateId: candidate._id });
        
        createdCount++;
      } catch (rowError) {
        console.error('Row processing error:', rowError);
        errors.push(`Error processing row: ${rowError.message}`);
      }
    }
    
    // Create notification
    try {
      await createNotification({
        title: 'Candidates Registered Successfully',
        message: `${createdCount} candidates have been successfully registered from the placement data. ${skippedCount} candidates were skipped (already exist).`,
        type: 'placement_processed',
        role: 'admin'
      });
    } catch (notifError) {
      console.error('Notification error:', notifError);
    }
    
    // Update placement
    await Placement.findByIdAndUpdate(placementId, { 
      isProcessed: true,
      processedAt: new Date(),
      candidatesCreated: createdCount
    });
    
    res.json({
      success: true,
      message: 'Placement data processed successfully',
      stats: {
        created: createdCount,
        skipped: skippedCount,
        errors: errors.length
      },
      errors: errors.slice(0, 10)
    });
    
  } catch (error) {
    console.error('Error processing placement approval:', error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

// Get placement officer's students
exports.getMyStudents = async (req, res) => {
  try {
    const placementId = req.user.id;
    
    // Find candidates created by this placement officer
    const candidates = await Candidate.find({ placementId }).select('name email password phone credits');
    
    const students = candidates.map(candidate => ({
      name: candidate.name,
      email: candidate.email,
      password: candidate.password,
      phone: candidate.phone,
      credits: candidate.credits
    }));
    
    res.json({
      success: true,
      students
    });
    
  } catch (error) {
    console.error('Error getting placement students:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};