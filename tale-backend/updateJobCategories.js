const mongoose = require('mongoose');
const Job = require('./models/Job');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

async function updateJobCategories() {
  try {
    // Check existing categories
    const totalJobs = await Job.countDocuments();
    console.log(`Total jobs in database: ${totalJobs}`);
    
    const jobs = await Job.find({}, 'title category').limit(10);
    console.log('Current jobs and categories:');
    jobs.forEach(job => {
      console.log(`${job.title} - Category: ${job.category || 'NOT SET'}`);
    });

    // Update jobs based on title keywords
    const updates = [
      { keywords: ['developer', 'programming', 'software', 'web', 'app', 'frontend', 'backend', 'fullstack', 'react', 'node', 'javascript', 'python', 'java'], category: 'Programming' },
      { keywords: ['designer', 'design', 'ui', 'ux', 'graphic', 'creative'], category: 'Design' },
      { keywords: ['marketing', 'digital marketing', 'seo', 'social media'], category: 'Marketing' },
      { keywords: ['content', 'writer', 'copywriter', 'blogger'], category: 'Content' },
      { keywords: ['health', 'fitness', 'medical', 'healthcare'], category: 'Health' },
    ];

    for (const update of updates) {
      const regex = new RegExp(update.keywords.join('|'), 'i');
      const result = await Job.updateMany(
        { title: regex },
        { $set: { category: update.category } }
      );
      console.log(`Updated ${result.modifiedCount} jobs to category: ${update.category}`);
    }

    console.log('Job categories updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating categories:', error);
    process.exit(1);
  }
}

updateJobCategories();