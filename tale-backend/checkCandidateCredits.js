const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const Placement = require('./models/Placement');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkCredits() {
  try {
    const placements = await Placement.find({ isProcessed: true });
    
    for (const placement of placements) {
      console.log(`\n=== Placement: ${placement.name} ===`);
      console.log(`Placement Credits: ${placement.credits}`);
      
      const candidates = await Candidate.find({ placementId: placement._id });
      console.log(`Found ${candidates.length} candidates`);
      
      for (const candidate of candidates) {
        console.log(`- ${candidate.email}: ${candidate.credits} credits (method: ${candidate.registrationMethod})`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCredits();