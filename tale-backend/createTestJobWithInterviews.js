const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');
const Employer = require('./models/Employer');
const { createNotification } = require('./controllers/notificationController');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');

async function createTestJobWithInterviews() {
  try {
    console.log('Creating test job with interview schedule...\n');

    // Find or create an employer
    let employer = await Employer.findOne({ isApproved: true, status: 'active' });
    if (!employer) {
      employer = await Employer.create({
        name: 'Tech Solutions',
        email: 'hr@techsolutions.com',
        password: 'password123',
        companyName: 'Tech Solutions Inc.',
        phone: '9876543210',
        status: 'active',
        isApproved: true,
        employerType: 'company'
      });
      console.log('✓ Test employer created:', employer._id);
    } else {
      console.log('✓ Using existing employer:', employer.companyName);
    }

    // Create job with detailed interview schedule
    const job = await Job.create({
      title: 'Full Stack Developer',
      description: 'We are looking for a skilled Full Stack Developer to join our dynamic team. You will work on both frontend and backend technologies.',
      employerId: employer._id,
      location: 'Bangalore',
      category: 'IT',
      jobType: 'full-time',
      status: 'active',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      experienceLevel: 'minimum',
      minExperience: 2,
      salary: { min: 600000, max: 1000000, currency: 'INR' },
      vacancies: 3,
      applicationLimit: 100,
      education: 'B.Tech',
      backlogsAllowed: false,
      interviewRoundsCount: 3,
      interviewRoundTypes: {
        technical: true,
        hr: true,
        managerial: true,
        nonTechnical: false,
        final: false
      },
      interviewRoundDetails: {
        technical: {
          description: 'Technical coding round covering React, Node.js, and database concepts. Duration: 90 minutes.',
          date: new Date('2025-01-28'),
          time: '10:00'
        },
        hr: {
          description: 'HR discussion about your background, expectations, and company culture. Duration: 30 minutes.',
          date: new Date('2025-01-29'),
          time: '15:00'
        },
        managerial: {
          description: 'Discussion with team lead about project experience and technical leadership. Duration: 45 minutes.',
          date: new Date('2025-01-30'),
          time: '11:00'
        },
        nonTechnical: { description: '', date: '', time: '' },
        final: { description: '', date: '', time: '' }
      },
      interviewScheduled: true,
      transportation: {
        oneWay: false,
        twoWay: true,
        noCab: false
      }
    });

    console.log('✓ Job created successfully!');
    console.log('Job ID:', job._id);
    console.log('Title:', job.title);
    console.log('Interview Scheduled:', job.interviewScheduled);
    
    console.log('\n📋 Interview Schedule:');
    Object.entries(job.interviewRoundTypes).forEach(([roundType, isSelected]) => {
      if (isSelected) {
        const details = job.interviewRoundDetails[roundType];
        const roundNames = {
          technical: 'Technical Round',
          hr: 'HR Round',
          managerial: 'Managerial Round'
        };
        console.log(`\n${roundNames[roundType]}:`);
        console.log(`  Date: ${new Date(details.date).toLocaleDateString()}`);
        console.log(`  Time: ${details.time}`);
        console.log(`  Details: ${details.description}`);
      }
    });

    // Create general notification for all candidates
    await createNotification({
      title: 'New Job with Interview Schedule',
      message: `New ${job.title} position available at ${employer.companyName} with pre-scheduled interview rounds. Apply now to get your interview schedule!`,
      type: 'job_posted',
      role: 'candidate',
      relatedId: job._id,
      createdBy: employer._id
    });

    console.log('\n✅ Test job created successfully!');
    console.log('\n🔍 To test the interview notification system:');
    console.log('1. Go to http://localhost:3000/candidate');
    console.log('2. Login as a candidate');
    console.log('3. Apply for the "Full Stack Developer" job');
    console.log('4. Check notifications for detailed interview schedule');
    console.log('\nJob will remain active for testing purposes.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestJobWithInterviews();