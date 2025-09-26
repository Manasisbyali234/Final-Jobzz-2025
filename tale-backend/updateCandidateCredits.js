const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateCredits() {
  try {
    const placementId = '68d628fd0e967ccef54c786b';
    const newCredits = 12;
    
    const updateResult = await Candidate.updateMany(
      { placementId: placementId },
      { $set: { credits: newCredits } }
    );
    
    console.log('Update result:', updateResult);
    
    // Verify update
    const candidates = await Candidate.find({ placementId: placementId });
    console.log(`Updated ${candidates.length} candidates:`);
    candidates.forEach(c => console.log(`- ${c.email}: ${c.credits} credits`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateCredits();