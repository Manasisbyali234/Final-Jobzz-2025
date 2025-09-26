const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateCandidates() {
  try {
    // Update all existing candidates without registrationMethod to 'signup'
    const result1 = await Candidate.updateMany(
      { registrationMethod: { $exists: false } },
      { $set: { registrationMethod: 'signup' } }
    );
    
    // Update candidates with credits > 0 but no placementId to 'admin' method
    const result2 = await Candidate.updateMany(
      { 
        credits: { $gt: 0 },
        placementId: { $exists: false },
        registrationMethod: 'signup'
      },
      { $set: { registrationMethod: 'admin' } }
    );
    
    console.log(`Updated ${result1.modifiedCount} candidates with registrationMethod: 'signup'`);
    console.log(`Updated ${result2.modifiedCount} candidates with registrationMethod: 'admin'`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating candidates:', error);
    process.exit(1);
  }
}

updateCandidates();