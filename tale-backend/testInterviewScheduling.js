const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');
const Notification = require('./models/Notification');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testInterviewScheduling() {
  try {
    console.log('Testing Interview Scheduling Functionality...\n');

    // Test 1: Create a job with interview round details
    console.log('1. Creating a job with interview round details...');
    
    const testJob = {
      title: 'Senior Software Engineer',
      description: 'Test job for interview scheduling',
      employerId: new mongoose.Types.ObjectId(),
      location: 'Bangalore',
      jobType: 'full-time',
      salary: { min: 800000, max: 1200000 },
      interviewRoundTypes: {
        technical: true,
        hr: true,
        managerial: false,
        nonTechnical: false,
        final: false
      },
      interviewRoundDetails: {
        technical: {
          description: 'Technical coding round with data structures and algorithms',
          date: new Date('2025-01-20'),
          time: '10:00'
        },
        hr: {
          description: 'HR discussion about company culture and expectations',
          date: new Date('2025-01-22'),
          time: '14:00'
        },
        nonTechnical: {
          description: '',
          date: '',
          time: ''
        },
        managerial: {
          description: '',
          date: '',
          time: ''
        },
        final: {
          description: '',
          date: '',
          time: ''
        }
      },
      interviewScheduled: true
    };

    const job = await Job.create(testJob);
    console.log('✓ Job created successfully with ID:', job._id);
    console.log('✓ Interview scheduled flag:', job.interviewScheduled);
    console.log('✓ Technical round details:', job.interviewRoundDetails.technical);
    console.log('✓ HR round details:', job.interviewRoundDetails.hr);

    // Test 2: Create notifications for interview scheduling
    console.log('\n2. Creating interview scheduling notifications...');
    
    const jobPostedNotification = await Notification.create({
      title: 'New Job Posted',
      message: `New ${job.title} position available`,
      type: 'job_posted',
      role: 'candidate',
      relatedId: job._id,
      createdBy: job.employerId
    });
    console.log('✓ Job posted notification created:', jobPostedNotification._id);

    const interviewScheduledNotification = await Notification.create({
      title: 'Interview Rounds Scheduled',
      message: `Interview rounds have been scheduled for ${job.title} position`,
      type: 'interview_scheduled',
      role: 'candidate',
      relatedId: job._id,
      createdBy: job.employerId
    });
    console.log('✓ Interview scheduled notification created:', interviewScheduledNotification._id);

    // Test 3: Query jobs with scheduled interviews
    console.log('\n3. Querying jobs with scheduled interviews...');
    
    const scheduledJobs = await Job.find({ interviewScheduled: true });
    console.log('✓ Found', scheduledJobs.length, 'jobs with scheduled interviews');

    // Test 4: Query notifications for candidates
    console.log('\n4. Querying notifications for candidates...');
    
    const candidateNotifications = await Notification.find({ role: 'candidate' })
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log('✓ Found', candidateNotifications.length, 'candidate notifications:');
    candidateNotifications.forEach((notif, index) => {
      console.log(`   ${index + 1}. ${notif.title} - ${notif.type}`);
    });

    // Test 5: Test interview round details structure
    console.log('\n5. Testing interview round details structure...');
    
    const jobWithDetails = await Job.findById(job._id);
    const technicalRound = jobWithDetails.interviewRoundDetails.technical;
    const hrRound = jobWithDetails.interviewRoundDetails.hr;
    
    console.log('✓ Technical Round:');
    console.log('   Description:', technicalRound.description);
    console.log('   Date:', technicalRound.date);
    console.log('   Time:', technicalRound.time);
    
    console.log('✓ HR Round:');
    console.log('   Description:', hrRound.description);
    console.log('   Date:', hrRound.date);
    console.log('   Time:', hrRound.time);

    console.log('\n✅ All tests passed! Interview scheduling functionality is working correctly.');

    // Cleanup
    console.log('\n6. Cleaning up test data...');
    await Job.findByIdAndDelete(job._id);
    await Notification.deleteMany({ relatedId: job._id });
    console.log('✓ Test data cleaned up');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testInterviewScheduling();