const mongoose = require('mongoose');
const Job = require('./models/Job');

mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testFilters() {
  try {
    console.log('Testing filters...\n');
    
    // Test 1: Get all jobs
    const allJobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });
    console.log(`Total active jobs: ${allJobs.length}`);
    
    // Test 2: Filter by category
    const itJobs = await Job.find({ status: 'active', category: 'IT' });
    console.log(`IT jobs: ${itJobs.length}`);
    
    // Test 3: Filter by job type
    const fullTimeJobs = await Job.find({ status: 'active', jobType: 'full-time' });
    console.log(`Full-time jobs: ${fullTimeJobs.length}`);
    
    // Test 4: Sort by title A-Z
    const sortedJobs = await Job.find({ status: 'active' }).sort({ title: 1 });
    console.log('\nJobs sorted A-Z:');
    sortedJobs.forEach(job => console.log(`- ${job.title}`));
    
    // Test 5: Categories available
    const categories = await Job.distinct('category', { status: 'active' });
    console.log('\nAvailable categories:', categories);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testFilters();