const mongoose = require('mongoose');
const Job = require('./models/Job');
const Employer = require('./models/Employer');

mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixJobs() {
  try {
    // Find an existing employer or create one
    let employer = await Employer.findOne();
    if (!employer) {
      employer = await Employer.create({
        name: 'Test Employer',
        email: 'test@example.com',
        password: 'password123',
        companyName: 'Test Company',
        status: 'active',
        isApproved: true,
        employerType: 'company'
      });
    } else {
      // Update existing employer to be approved
      await Employer.updateOne({ _id: employer._id }, { 
        status: 'active', 
        isApproved: true 
      });
    }
    
    // Update all jobs to use this employer ID
    const result = await Job.updateMany({}, { 
      employerId: employer._id,
      status: 'active'
    });
    
    console.log(`Updated ${result.modifiedCount} jobs with employer ID: ${employer._id}`);
    console.log('Employer approved:', employer.isApproved);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixJobs();