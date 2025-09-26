const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const Placement = require('./models/Placement');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testUpdate() {
  try {
    // Find Manasi Byali's placement
    const placement = await Placement.findOne({ name: 'Manasi Byali' });
    console.log('Placement found:', placement.name, 'ID:', placement._id);
    console.log('Placement credits:', placement.credits);
    
    // Check candidates before update
    const candidatesBefore = await Candidate.find({ placementId: placement._id });
    console.log(`\nBefore update: ${candidatesBefore.length} candidates`);
    candidatesBefore.forEach(c => console.log(`- ${c.email}: ${c.credits} credits`));
    
    // Update candidates
    const updateResult = await Candidate.updateMany(
      { placementId: placement._id },
      { $set: { credits: placement.credits } }
    );
    
    console.log('\nUpdate result:', updateResult);
    
    // Check candidates after update
    const candidatesAfter = await Candidate.find({ placementId: placement._id });
    console.log(`\nAfter update: ${candidatesAfter.length} candidates`);
    candidatesAfter.forEach(c => console.log(`- ${c.email}: ${c.credits} credits`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testUpdate();