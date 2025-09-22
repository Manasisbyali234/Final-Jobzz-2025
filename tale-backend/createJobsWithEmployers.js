const mongoose = require('mongoose');
const Job = require('./models/Job');
const Employer = require('./models/Employer');
const EmployerProfile = require('./models/EmployerProfile');

mongoose.connect('mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createJobsWithEmployers() {
  try {
    // First, create sample employers
    const employers = [
      {
        name: 'Tech Solutions Inc',
        email: 'hr@techsolutions.com',
        password: 'password123',
        companyName: 'Tech Solutions Inc',
        phone: '9876543210',
        status: 'active',
        isApproved: true,
        employerType: 'company'
      },
      {
        name: 'Creative Agency',
        email: 'jobs@creativeagency.com',
        password: 'password123',
        companyName: 'Creative Agency',
        phone: '9876543211',
        status: 'active',
        isApproved: true,
        employerType: 'company'
      },
      {
        name: 'Marketing Pro',
        email: 'contact@marketingpro.com',
        password: 'password123',
        companyName: 'Marketing Pro',
        phone: '9876543212',
        status: 'active',
        isApproved: true,
        employerType: 'company'
      }
    ];

    // Clear existing data
    await Job.deleteMany({});
    await Employer.deleteMany({});
    await EmployerProfile.deleteMany({});

    // Create employers
    const createdEmployers = await Employer.insertMany(employers);
    console.log(`Created ${createdEmployers.length} employers`);

    // Create employer profiles
    const employerProfiles = createdEmployers.map(employer => ({
      employerId: employer._id,
      companyName: employer.companyName,
      description: `${employer.companyName} is a leading company in its field.`,
      website: `https://${employer.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      industry: 'Technology',
      companySize: '51-200',
      foundedYear: 2020,
      location: 'Bangalore, India'
    }));

    await EmployerProfile.insertMany(employerProfiles);
    console.log(`Created ${employerProfiles.length} employer profiles`);

    // Create sample jobs
    const sampleJobs = [
      {
        title: 'React Developer',
        description: 'Looking for a skilled React developer to join our team. You will be responsible for developing user interface components and implementing them following well-known React.js workflows.',
        employerId: createdEmployers[0]._id,
        location: 'Bangalore',
        category: 'IT',
        jobType: 'full-time',
        status: 'active',
        requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
        experience: '2-4 years',
        salary: { min: 600000, max: 1000000, currency: 'INR' },
        ctc: { min: 600000, max: 1000000 },
        netSalary: { min: 480000, max: 800000 },
        vacancies: 3,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Frontend Developer',
        description: 'We are looking for a Frontend Developer responsible for the client side of our service. You will be working on creating user-friendly web pages.',
        employerId: createdEmployers[0]._id,
        location: 'Mumbai',
        category: 'IT',
        jobType: 'full-time',
        status: 'active',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
        experience: '1-3 years',
        salary: { min: 500000, max: 800000, currency: 'INR' },
        ctc: { min: 500000, max: 800000 },
        netSalary: { min: 400000, max: 640000 },
        vacancies: 2,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Graphic Designer',
        description: 'Creative graphic designer needed for marketing materials. You will create visual concepts to communicate ideas that inspire, inform, and captivate consumers.',
        employerId: createdEmployers[1]._id,
        location: 'Delhi',
        category: 'Design',
        jobType: 'full-time',
        status: 'active',
        requiredSkills: ['Photoshop', 'Illustrator', 'Design', 'Creativity'],
        experience: '2-5 years',
        salary: { min: 400000, max: 700000, currency: 'INR' },
        ctc: { min: 400000, max: 700000 },
        netSalary: { min: 320000, max: 560000 },
        vacancies: 1,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Digital Marketing Specialist',
        description: 'Experienced digital marketer for social media campaigns. You will develop, implement and manage marketing campaigns promoting the organization.',
        employerId: createdEmployers[2]._id,
        location: 'Pune',
        category: 'Marketing',
        jobType: 'full-time',
        status: 'active',
        requiredSkills: ['SEO', 'Social Media', 'Google Ads', 'Analytics'],
        experience: '3-6 years',
        salary: { min: 550000, max: 900000, currency: 'INR' },
        ctc: { min: 550000, max: 900000 },
        netSalary: { min: 440000, max: 720000 },
        vacancies: 2,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Content Writer',
        description: 'Content writer for blog posts and website content. You will research industry-related topics and write clear marketing copy to promote our products/services.',
        employerId: createdEmployers[1]._id,
        location: 'Chennai',
        category: 'Content',
        jobType: 'part-time',
        status: 'active',
        requiredSkills: ['Writing', 'SEO', 'Research', 'Communication'],
        experience: '1-3 years',
        salary: { min: 300000, max: 500000, currency: 'INR' },
        ctc: { min: 300000, max: 500000 },
        netSalary: { min: 240000, max: 400000 },
        vacancies: 1,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Full Stack Developer',
        description: 'Full stack developer with experience in both frontend and backend technologies. You will work on complete web applications from conception to deployment.',
        employerId: createdEmployers[0]._id,
        location: 'Hyderabad',
        category: 'IT',
        jobType: 'full-time',
        status: 'active',
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express'],
        experience: '3-7 years',
        salary: { min: 800000, max: 1500000, currency: 'INR' },
        ctc: { min: 800000, max: 1500000 },
        netSalary: { min: 640000, max: 1200000 },
        vacancies: 2,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'UI/UX Designer',
        description: 'UI/UX Designer to create amazing user experiences. You will gather user requirements, design graphic elements and build navigation components.',
        employerId: createdEmployers[1]._id,
        location: 'Bangalore',
        category: 'Design',
        jobType: 'full-time',
        status: 'active',
        requiredSkills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
        experience: '2-5 years',
        salary: { min: 600000, max: 1100000, currency: 'INR' },
        ctc: { min: 600000, max: 1100000 },
        netSalary: { min: 480000, max: 880000 },
        vacancies: 1,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Data Scientist',
        description: 'Data Scientist to analyze large amounts of raw information to find patterns that will help improve our company. You will interpret data and analyze results using statistical techniques.',
        employerId: createdEmployers[0]._id,
        location: 'Mumbai',
        category: 'IT',
        jobType: 'full-time',
        status: 'active',
        requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
        experience: '3-6 years',
        salary: { min: 1000000, max: 1800000, currency: 'INR' },
        ctc: { min: 1000000, max: 1800000 },
        netSalary: { min: 800000, max: 1440000 },
        vacancies: 1,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`Created ${createdJobs.length} sample jobs`);

    console.log('\nJobs created:');
    createdJobs.forEach(job => {
      console.log(`- ${job.title} | Category: ${job.category} | Location: ${job.location} | Type: ${job.jobType}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating jobs and employers:', error);
    process.exit(1);
  }
}

createJobsWithEmployers();