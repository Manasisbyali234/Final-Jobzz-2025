const mongoose = require('mongoose');
const Employer = require('./models/Employer');
const EmployerProfile = require('./models/EmployerProfile');
const Subscription = require('./models/Subscription');

mongoose.connect('mongodb://localhost:27017/tale-job-portal');

async function createTestEmployer() {
  try {
    // Check if employer already exists
    const existing = await Employer.findOne({ email: 'employer@test.com' });
    if (existing) {
      console.log('Test employer already exists');
      return;
    }

    // Create employer
    const employer = await Employer.create({
      name: 'Test Employer',
      email: 'employer@test.com',
      password: 'password123',
      phone: '1234567890',
      companyName: 'Test Company'
    });

    // Create profile
    await EmployerProfile.create({
      employerId: employer._id,
      description: 'Test company description'
    });

    // Create subscription
    await Subscription.create({
      employerId: employer._id
    });

    console.log('Test employer created successfully');
    console.log('Email: employer@test.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createTestEmployer();