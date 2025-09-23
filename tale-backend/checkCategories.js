const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB using the same connection string from .env
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkCategories() {
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
      // Get all unique categories
      const categories = await Job.distinct('category');
      console.log('\nUnique categories in database:');
      categories.forEach((category, index) => {
        console.log(`${index + 1}. "${category}"`);
      });
      
      // Count jobs per category
      console.log('\nJob count per category:');
      for (const category of categories) {
        const count = await Job.countDocuments({ category: category });
        console.log(`${category}: ${count} jobs`);
      }
      
      // Also check for null/undefined categories
      const nullCategoryCount = await Job.countDocuments({ 
        $or: [
          { category: null }, 
          { category: undefined }, 
          { category: '' },
          { category: { $exists: false } }
        ] 
      });
      console.log(`Jobs without category: ${nullCategoryCount}`);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

// Wait a bit for connection then run check
setTimeout(checkCategories, 1000);