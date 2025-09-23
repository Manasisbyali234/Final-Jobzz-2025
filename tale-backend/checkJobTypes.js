const mongoose = require('mongoose');
const Job = require('./models/Job');

mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkJobTypes() {
  try {
    const jobs = await Job.find({}, 'title jobType status');
    console.log('Jobs with jobType:');
    jobs.forEach(job => {
      console.log(`- ${job.title} | JobType: ${job.jobType || 'NOT SET'} | Status: ${job.status}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkJobTypes();