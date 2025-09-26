const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const Application = require('./models/Application');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkCredits() {
  try {
    // Find candidates with applications
    const candidates = await Candidate.find({ 
      registrationMethod: 'placement',
      credits: { $gte: 0 }
    }).select('email credits');
    
    console.log('Placement candidates:');
    for (const candidate of candidates) {
      const applicationCount = await Application.countDocuments({ candidateId: candidate._id });
      console.log(`${candidate.email}: ${candidate.credits} credits, ${applicationCount} applications`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCredits();