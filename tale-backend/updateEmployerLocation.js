const mongoose = require('mongoose');
const EmployerProfile = require('./models/EmployerProfile');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateEmployerLocation() {
  try {
    // First, let's see all profiles
    const allProfiles = await EmployerProfile.find({});
    console.log(`Found ${allProfiles.length} employer profiles`);
    
    // Check current location values
    allProfiles.forEach((profile, index) => {
      console.log(`Profile ${index + 1}: location = '${profile.location}'`);
    });
    
    // Update all employer profiles to have Bangalore as location
    const result = await EmployerProfile.updateMany(
      {},
      { $set: { location: 'Bangalore' } }
    );
    
    console.log(`Updated ${result.modifiedCount} employer profiles with location: Bangalore`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating employer locations:', error);
    process.exit(1);
  }
}

updateEmployerLocation();