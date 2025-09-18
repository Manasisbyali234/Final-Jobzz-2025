const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');
const Employer = require('./models/Employer');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateExistingJobs() {
  try {
    console.log('=== UPDATING EXISTING JOBS ===');
    
    // Find all jobs without company information
    const jobsWithoutCompanyInfo = await Job.find({
      $or: [
        { companyName: { $exists: false } },
        { companyName: null },
        { companyName: '' }
      ]
    }).populate('employerId');
    
    console.log(`Found ${jobsWithoutCompanyInfo.length} jobs without company information`);
    
    for (let job of jobsWithoutCompanyInfo) {
      if (job.employerId) {
        // Check if employer is a consultant
        const employer = await Employer.findById(job.employerId._id);
        
        if (employer && employer.employerType === 'consultant') {
          // Update with sample consultant company data
          await Job.findByIdAndUpdate(job._id, {
            companyName: `Client Company ${Math.floor(Math.random() * 100)}`,
            companyDescription: 'A leading technology company focused on innovation and growth.',
            companyLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzMzNzNkYyIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DPC90ZXh0Pgo8L3N2Zz4K'
          });
          console.log(`Updated consultant job: ${job.title}`);
        } else {
          // Update with employer's company data
          await Job.findByIdAndUpdate(job._id, {
            companyName: employer?.companyName || 'Company Name',
            companyDescription: 'A professional organization committed to excellence.',
            companyLogo: null // Companies don't need logos in job posts
          });
          console.log(`Updated company job: ${job.title}`);
        }
      }
    }
    
    console.log('=== UPDATE COMPLETE ===');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating jobs:', error);
    mongoose.connection.close();
  }
}

// Wait for connection then run update
setTimeout(updateExistingJobs, 1000);