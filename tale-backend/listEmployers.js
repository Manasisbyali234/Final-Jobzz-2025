const mongoose = require('mongoose');
const Employer = require('./models/Employer');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function listEmployers() {
  try {
    const employers = await Employer.find({}).limit(10);
    console.log('Found', employers.length, 'employers:');
    employers.forEach((emp, index) => {
      console.log(`\n${index + 1}. Employer ID: ${emp._id}`);
      console.log('   Name:', emp.name);
      console.log('   Email:', emp.email);
      console.log('   Company Name:', emp.companyName);
      console.log('   Employer Type:', emp.employerType || 'Not set');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

listEmployers();