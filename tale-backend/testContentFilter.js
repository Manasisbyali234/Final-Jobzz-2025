const mongoose = require('mongoose');
const Job = require('./models/Job');
const Employer = require('./models/Employer');

mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testContentFilter() {
  try {
    console.log('Testing Content category filter...\n');
    
    // Test exact match
    const exactMatch = await Job.find({ category: 'Content', status: 'active' });
    console.log(`Exact match for 'Content': ${exactMatch.length} jobs`);
    exactMatch.forEach(job => {
      console.log(`- ${job.title} | Category: ${job.category} | Status: ${job.status}`);
    });
    
    // Test case-insensitive match
    const caseInsensitiveMatch = await Job.find({ 
      category: new RegExp('Content', 'i'), 
      status: 'active' 
    });
    console.log(`\nCase-insensitive match for 'Content': ${caseInsensitiveMatch.length} jobs`);
    caseInsensitiveMatch.forEach(job => {
      console.log(`- ${job.title} | Category: ${job.category} | Status: ${job.status}`);
    });
    
    // Test with populated employer data (like the API does)
    const jobsWithEmployer = await Job.find({ 
      category: new RegExp('Content', 'i'), 
      status: 'active' 
    }).populate({
      path: 'employerId',
      select: 'companyName status isApproved employerType',
      match: { status: 'active', isApproved: true }
    });
    
    const approvedJobs = jobsWithEmployer.filter(job => job.employerId);
    console.log(`\nWith employer filter (approved only): ${approvedJobs.length} jobs`);
    approvedJobs.forEach(job => {
      console.log(`- ${job.title} | Category: ${job.category} | Employer: ${job.employerId.companyName} | Approved: ${job.employerId.isApproved}`);
    });
    
    // Check all categories
    console.log('\nAll unique categories in database:');
    const categories = await Job.distinct('category');
    console.log(categories);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testContentFilter();