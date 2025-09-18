const mongoose = require('mongoose');
const Job = require('./models/Job');

mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkJobs() {
  try {
    const jobs = await Job.find({}, 'title category status');
    console.log('All jobs in database:');
    jobs.forEach(job => {
      console.log(`- ${job.title} | Category: ${job.category || 'NOT SET'} | Status: ${job.status}`);
    });
    
    const marketingJobs = await Job.find({ category: 'Marketing' });
    console.log(`\nMarketing jobs found: ${marketingJobs.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkJobs();