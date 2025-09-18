const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB using the same connection string from .env
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkDatabase() {
  try {
    console.log('Connected to:', mongoUri);
    
    // Wait for connection to be ready
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('open', resolve);
      }
    });
    
    // Check jobs collection
    const Job = require('./models/Job');
    const jobCount = await Job.countDocuments();
    console.log(`\nTotal jobs in database: ${jobCount}`);
    
    if (jobCount > 0) {
      const jobs = await Job.find({}).limit(3);
      console.log('\nSample jobs:');
      jobs.forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} - Company: ${job.companyName || 'N/A'}`);
        console.log(`   Logo: ${job.companyLogo ? 'EXISTS' : 'N/A'}`);
        console.log(`   Description: ${job.companyDescription ? 'EXISTS' : 'N/A'}`);
      });
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

// Wait a bit for connection then run check
setTimeout(checkDatabase, 1000);