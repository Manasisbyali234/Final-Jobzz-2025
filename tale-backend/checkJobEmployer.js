const mongoose = require('mongoose');
const Job = require('./models/Job');
const Employer = require('./models/Employer');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkJobEmployer() {
  try {
    const job = await Job.findById('68caf4eae25c831ffb6fc6be').populate('employerId');
    console.log('Job details:');
    console.log('Job ID:', job._id);
    console.log('Title:', job.title);
    console.log('Employer ID:', job.employerId._id);
    console.log('Employer Name:', job.employerId.name);
    console.log('Employer Type:', job.employerId.employerType);
    console.log('Company Name in Job:', job.companyName);
    console.log('Company Logo in Job:', job.companyLogo ? 'Present' : 'Not present');
    console.log('Company Description in Job:', job.companyDescription ? 'Present' : 'Not present');
    console.log('Location:', job.location);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkJobEmployer();