const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const Placement = require('./models/Placement');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixPlacementCandidates() {
  try {
    // Find all placements that have been processed
    const processedPlacements = await Placement.find({ isProcessed: true });
    console.log(`Found ${processedPlacements.length} processed placements`);
    
    for (const placement of processedPlacements) {
      console.log(`Processing placement: ${placement.name} (${placement.email})`);
      
      // Find candidates created around the same time as placement processing
      // and with the same credits as the placement
      const candidates = await Candidate.find({
        credits: placement.credits,
        createdAt: { $gte: new Date(placement.processedAt || placement.createdAt) }
      });
      
      console.log(`Found ${candidates.length} potential candidates for this placement`);
      
      // Update these candidates to link to this placement
      for (const candidate of candidates) {
        await Candidate.findByIdAndUpdate(candidate._id, {
          registrationMethod: 'placement',
          placementId: placement._id
        });
        console.log(`Updated candidate: ${candidate.email}`);
      }
    }
    
    console.log('Finished updating placement candidates');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing placement candidates:', error);
    process.exit(1);
  }
}

fixPlacementCandidates();