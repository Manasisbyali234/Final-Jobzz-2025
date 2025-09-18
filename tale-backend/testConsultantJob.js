const mongoose = require('mongoose');
const Job = require('./models/Job');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tale_jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createTestJob() {
  try {
    const testJob = await Job.create({
      title: 'Test Consultant Job',
      location: 'Bangalore',
      jobType: 'full-time',
      salary: '10 LPA',
      vacancies: 2,
      applicationLimit: 50,
      description: 'Test job for consultant',
      requiredSkills: ['JavaScript', 'React'],
      experienceLevel: 'freshers',
      education: 'B.Tech',
      backlogsAllowed: false,
      interviewRoundsCount: 3,
      employerId: '68caee28e25c831ffb6fc5b4', // Manoj (consultant)
      // Consultant fields
      companyName: 'Test Company Inc.',
      companyDescription: 'A test company for consultant job posting',
      companyLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzBGMTcyQSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UQzwvdGV4dD4KPC9zdmc+',
      category: 'IT'
    });
    
    console.log('Test job created successfully!');
    console.log('Job ID:', testJob._id);
    console.log('Company Name:', testJob.companyName);
    console.log('Company Logo:', testJob.companyLogo ? 'Present' : 'Not present');
    console.log('Company Description:', testJob.companyDescription ? 'Present' : 'Not present');
    
  } catch (error) {
    console.error('Error creating test job:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestJob();