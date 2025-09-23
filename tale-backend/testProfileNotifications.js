const mongoose = require('mongoose');
const { createProfileCompletionNotification } = require('./controllers/notificationController');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testProfileNotifications() {
  try {
    console.log('Testing profile completion notifications...');
    
    // Test different completion percentages
    const testCandidateId = '507f1f77bcf86cd799439011'; // dummy ObjectId
    
    // Test 50% completion
    console.log('\n1. Testing 50% completion notification...');
    await createProfileCompletionNotification(testCandidateId, 50);
    
    // Test 80% completion
    console.log('\n2. Testing 80% completion notification...');
    await createProfileCompletionNotification(testCandidateId, 80);
    
    // Test 100% completion
    console.log('\n3. Testing 100% completion notification...');
    await createProfileCompletionNotification(testCandidateId, 100);
    
    console.log('\nAll test notifications created successfully!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

setTimeout(testProfileNotifications, 1000);