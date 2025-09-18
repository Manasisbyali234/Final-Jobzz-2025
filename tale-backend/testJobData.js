const mongoose = require('mongoose');
const Job = require('./models/Job');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testJobData() {
  try {
    // Find all jobs and check if company data exists
    const jobs = await Job.find({}).limit(5);
    
    console.log('=== JOB DATA TEST ===');
    console.log(`Found ${jobs.length} jobs`);
    
    jobs.forEach((job, index) => {
      console.log(`\n--- Job ${index + 1} ---`);
      console.log('Title:', job.title);
      console.log('Company Name:', job.companyName || 'NOT SET');
      console.log('Company Logo:', job.companyLogo ? 'EXISTS' : 'NOT SET');
      console.log('Company Description:', job.companyDescription || 'NOT SET');
      console.log('Employer ID:', job.employerId);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

testJobData();