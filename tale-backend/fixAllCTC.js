const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixAllCTC() {
  try {
    const Job = require('./models/Job');
    const jobs = await Job.find({});
    
    for (const job of jobs) {
      // Generate random CTC between 3L to 15L
      const minCTC = Math.floor(Math.random() * 200000) + 300000; // 3L to 5L
      const maxCTC = Math.floor(Math.random() * 700000) + 800000; // 8L to 15L
      
      const updateData = {
        ctc: { min: minCTC, max: maxCTC },
        netSalary: { 
          min: Math.round(minCTC * 0.8), 
          max: Math.round(maxCTC * 0.8) 
        }
      };
      
      await Job.findByIdAndUpdate(job._id, updateData);
      console.log(`Updated job: ${job.title} with CTC: ${(minCTC/100000).toFixed(1)}L - ${(maxCTC/100000).toFixed(1)}L`);
    }
    
    console.log('All jobs updated successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

setTimeout(fixAllCTC, 1000);