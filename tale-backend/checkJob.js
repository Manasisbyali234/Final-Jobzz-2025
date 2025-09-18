const mongoose = require('mongoose');
const Job = require('./models/Job');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkJob() {
  try {
    const job = await Job.findById('68caf4eae25c831ffb6fc6be');
    console.log('Job data:');
    console.log('Title:', job?.title);
    console.log('Company Name:', job?.companyName);
    console.log('Company Logo:', job?.companyLogo ? 'Present' : 'Not present');
    console.log('Company Description:', job?.companyDescription ? 'Present' : 'Not present');
    console.log('Category:', job?.category);
    console.log('Full job object:', JSON.stringify(job, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkJob();