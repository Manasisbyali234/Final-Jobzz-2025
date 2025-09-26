const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const Placement = require('./models/Placement');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function debugIds() {
  try {
    const placements = await Placement.find();
    console.log('All placements:');
    placements.forEach(p => console.log(`- ${p.name}: ${p._id} (credits: ${p.credits})`));
    
    const candidates = await Candidate.find({ registrationMethod: 'placement' });
    console.log(`\nPlacement candidates (${candidates.length}):`);
    candidates.forEach(c => console.log(`- ${c.email}: placementId=${c.placementId}, credits=${c.credits}`));
    
    // Check for mismatched IDs
    console.log('\nChecking for matches:');
    for (const placement of placements) {
      const matchingCandidates = await Candidate.find({ placementId: placement._id });
      console.log(`Placement ${placement.name} (${placement._id}): ${matchingCandidates.length} candidates`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugIds();