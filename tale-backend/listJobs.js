const mongoose = require('mongoose');
const Job = require('./models/Job');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function listJobs() {
  try {
    const jobs = await Job.find({}).limit(10);
    console.log('Found', jobs.length, 'jobs:');
    jobs.forEach((job, index) => {
      console.log(`\n${index + 1}. Job ID: ${job._id}`);
      console.log('   Title:', job.title);
      console.log('   Company Name:', job.companyName || 'Not set');
      console.log('   Company Logo:', job.companyLogo ? 'Present' : 'Not present');
      console.log('   Company Description:', job.companyDescription ? 'Present' : 'Not present');
      console.log('   Category:', job.category || 'Not set');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

listJobs();