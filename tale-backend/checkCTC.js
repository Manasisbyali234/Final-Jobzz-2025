const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkCTC() {
  try {
    const Job = require('./models/Job');
    const jobs = await Job.find({}).limit(3);
    
    console.log('Sample jobs with CTC:');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   CTC: ${job.ctc ? `₹${(job.ctc.min/100000).toFixed(1)}L - ₹${(job.ctc.max/100000).toFixed(1)}L` : 'Not set'}`);
      console.log(`   Category: ${job.category}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

setTimeout(checkCTC, 1000);