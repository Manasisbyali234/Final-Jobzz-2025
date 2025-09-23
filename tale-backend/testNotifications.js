const mongoose = require('mongoose');
require('dotenv').config();

const Notification = require('./models/Notification');
const Job = require('./models/Job');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');

async function testNotifications() {
  try {
    console.log('Testing notification system...\n');

    // 1. Create a test notification
    const testNotif = await Notification.create({
      title: 'Test Interview Notification',
      message: 'Interview rounds have been scheduled for Software Engineer position',
      type: 'interview_scheduled',
      role: 'candidate',
      createdBy: new mongoose.Types.ObjectId()
    });
    console.log('✓ Test notification created:', testNotif._id);

    // 2. Check all candidate notifications
    const candidateNotifs = await Notification.find({ role: 'candidate' })
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log(`\n✓ Found ${candidateNotifs.length} candidate notifications:`);
    candidateNotifs.forEach((notif, i) => {
      console.log(`   ${i+1}. ${notif.title} - ${notif.type} (${notif.createdAt.toISOString()})`);
    });

    // 3. Test the notification controller function
    const { createNotification } = require('./controllers/notificationController');
    const jobNotif = await createNotification({
      title: 'New Job Posted',
      message: 'New Software Engineer position available',
      type: 'job_posted',
      role: 'candidate',
      createdBy: new mongoose.Types.ObjectId()
    });
    console.log('\n✓ Notification created via controller:', jobNotif._id);

    // 4. Check if there are any jobs with interview details
    const jobsWithInterviews = await Job.find({ 
      interviewScheduled: true 
    }).limit(3);
    
    console.log(`\n✓ Found ${jobsWithInterviews.length} jobs with scheduled interviews`);
    
    // 5. Simulate job creation with interview scheduling
    if (jobsWithInterviews.length === 0) {
      console.log('\n⚠ No jobs with scheduled interviews found. Creating test job...');
      
      const testJob = await Job.create({
        title: 'Test Software Engineer',
        description: 'Test job for notification testing',
        employerId: new mongoose.Types.ObjectId(),
        location: 'Test City',
        jobType: 'full-time',
        interviewRoundTypes: {
          technical: true,
          hr: true,
          managerial: false,
          nonTechnical: false,
          final: false
        },
        interviewRoundDetails: {
          technical: {
            description: 'Technical coding round',
            date: new Date('2025-01-25'),
            time: '10:00'
          },
          hr: {
            description: 'HR discussion',
            date: new Date('2025-01-26'),
            time: '14:00'
          },
          nonTechnical: { description: '', date: '', time: '' },
          managerial: { description: '', date: '', time: '' },
          final: { description: '', date: '', time: '' }
        },
        interviewScheduled: true
      });
      
      console.log('✓ Test job created with interviews:', testJob._id);
      
      // Create notifications for this job
      await createNotification({
        title: 'New Job Posted',
        message: `New ${testJob.title} position available`,
        type: 'job_posted',
        role: 'candidate',
        relatedId: testJob._id,
        createdBy: testJob.employerId
      });
      
      await createNotification({
        title: 'Interview Rounds Scheduled',
        message: `Interview rounds have been scheduled for ${testJob.title} position`,
        type: 'interview_scheduled',
        role: 'candidate',
        relatedId: testJob._id,
        createdBy: testJob.employerId
      });
      
      console.log('✓ Job and interview notifications created');
    }

    // 6. Final count
    const finalCount = await Notification.countDocuments({ role: 'candidate' });
    console.log(`\n✅ Total candidate notifications in database: ${finalCount}`);
    
    console.log('\n🔍 To check notifications in frontend:');
    console.log('   1. Go to http://localhost:3000/candidate');
    console.log('   2. Login as a candidate');
    console.log('   3. Check the notification bell in the header');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testNotifications();