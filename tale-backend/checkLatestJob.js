const mongoose = require('mongoose');
const Job = require('./models/Job');
const Employer = require('./models/Employer');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkLatestJob() {
  try {
    const job = await Job.findOne().sort({ createdAt: -1 }).populate('employerId');
    console.log('Latest job:');
    console.log('ID:', job._id);
    console.log('Title:', job.title);
    console.log('Employer:', job.employerId.name, '(Type:', job.employerId.employerType + ')');
    console.log('Company Name:', job.companyName || 'NOT SET');
    console.log('Company Logo:', job.companyLogo ? 'PRESENT' : 'NOT SET');
    console.log('Company Description:', job.companyDescription || 'NOT SET');
    console.log('Category:', job.category || 'NOT SET');
    console.log('Created:', job.createdAt);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkLatestJob();