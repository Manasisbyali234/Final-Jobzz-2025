const mongoose = require('mongoose');
const Employer = require('./models/Employer');

mongoose.connect('mongodb://localhost:27017/tale-job-portal');

async function testLogin() {
  try {
    const employer = await Employer.findOne({ email: 'employer@test.com' });
    if (employer) {
      console.log('Employer found:', employer.email);
      const isMatch = await employer.comparePassword('password123');
      console.log('Password match:', isMatch);
      console.log('Status:', employer.status);
    } else {
      console.log('Employer not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testLogin();