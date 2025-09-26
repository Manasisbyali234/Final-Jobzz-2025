const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const Placement = require('./models/Placement');
const XLSX = require('xlsx');
const { base64ToBuffer } = require('./utils/base64Helper');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixPlacementPasswords() {
  try {
    const processedPlacements = await Placement.find({ isProcessed: true });
    
    for (const placement of processedPlacements) {
      console.log(`Processing placement: ${placement.name}`);
      
      if (!placement.studentData) continue;
      
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
      
      // Process all candidates from Excel
      for (const row of jsonData) {
        const email = row.Email || row.email || row.EMAIL;
        const password = row.Password || row.password || row.PASSWORD;
        const name = row['Candidate Name'] || row.Name || row.name || row.NAME || row['Full Name'] || row['full name'];
        const phone = row.Phone || row.phone || row.PHONE || row.Mobile || row.mobile;
        
        if (email && password && name) {
          const existingCandidate = await Candidate.findOne({ email });
          
          if (existingCandidate) {
            // Update existing candidate
            await Candidate.updateOne(
              { _id: existingCandidate._id },
              { 
                $set: { 
                  password: password,
                  registrationMethod: 'placement',
                  placementId: placement._id,
                  credits: placement.credits || 0
                }
              }
            );
            console.log(`Updated existing candidate: ${email}`);
          } else {
            // Create new candidate
            const newCandidate = await Candidate.create({
              name,
              email,
              password,
              phone: phone || '',
              credits: placement.credits || 0,
              registrationMethod: 'placement',
              placementId: placement._id,
              isVerified: true,
              status: 'active'
            });
            console.log(`Created new candidate: ${email}`);
            
            // Create candidate profile
            const CandidateProfile = require('./models/CandidateProfile');
            await CandidateProfile.create({ candidateId: newCandidate._id });
          }
        } else {
          console.log(`Skipping row - missing required fields:`, { name, email, password });
        }
      }
    }
    
    console.log('Finished updating placement passwords');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing placement passwords:', error);
    process.exit(1);
  }
}

fixPlacementPasswords();