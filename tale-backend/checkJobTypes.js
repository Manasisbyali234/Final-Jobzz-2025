const mongoose = require('mongoose');
const Job = require('./models/Job');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkJobTypes() {
  try {
    const jobs = await Job.find({}).select('title jobType employmentType location status');
    console.log('Job Types and Locations:');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} - Type: ${job.jobType || job.employmentType || 'Not set'} - Location: ${job.location || 'Not set'} - Status: ${job.status}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkJobTypes();