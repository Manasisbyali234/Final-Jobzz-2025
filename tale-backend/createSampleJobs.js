const mongoose = require('mongoose');
const Job = require('./models/Job');

mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleJobs = [
  {
    title: 'React Developer',
    description: 'Looking for a skilled React developer to join our team.',
    employerId: new mongoose.Types.ObjectId(),
    location: 'Bangalore',
    category: 'Programming',
    jobType: 'full-time',
    status: 'active',
    requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS']
  },
  {
    title: 'Graphic Designer',
    description: 'Creative graphic designer needed for marketing materials.',
    employerId: new mongoose.Types.ObjectId(),
    location: 'Mumbai',
    category: 'Design',
    jobType: 'full-time',
    status: 'active',
    requiredSkills: ['Photoshop', 'Illustrator', 'Design']
  },
  {
    title: 'Digital Marketing Specialist',
    description: 'Experienced digital marketer for social media campaigns.',
    employerId: new mongoose.Types.ObjectId(),
    location: 'Delhi',
    category: 'Marketing',
    jobType: 'full-time',
    status: 'active',
    requiredSkills: ['SEO', 'Social Media', 'Google Ads']
  },
  {
    title: 'Content Writer',
    description: 'Content writer for blog posts and website content.',
    employerId: new mongoose.Types.ObjectId(),
    location: 'Pune',
    category: 'Content',
    jobType: 'part-time',
    status: 'active',
    requiredSkills: ['Writing', 'SEO', 'Research']
  },
  {
    title: 'Fitness Trainer',
    description: 'Personal fitness trainer for gym clients.',
    employerId: new mongoose.Types.ObjectId(),
    location: 'Chennai',
    category: 'Health',
    jobType: 'full-time',
    status: 'active',
    requiredSkills: ['Fitness', 'Training', 'Nutrition']
  }
];

async function createSampleJobs() {
  try {
    await Job.deleteMany({}); // Clear existing jobs
    const result = await Job.insertMany(sampleJobs);
    console.log(`Created ${result.length} sample jobs`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating jobs:', error);
    process.exit(1);
  }
}

createSampleJobs();