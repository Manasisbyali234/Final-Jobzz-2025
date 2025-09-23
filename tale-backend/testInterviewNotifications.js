const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');
const Candidate = require('./models/Candidate');
const Application = require('./models/Application');
const Notification = require('./models/Notification');
const { createNotification } = require('./controllers/notificationController');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');

async function testInterviewNotifications() {
  try {
    console.log('Testing interview notifications for candidates...\n');

    // 1. Create a test candidate
    let candidate = await Candidate.findOne({ email: 'testcandidate@example.com' });
    if (!candidate) {
      candidate = await Candidate.create({
        name: 'Test Candidate',
        email: 'testcandidate@example.com',
        password: 'password123',
        phone: '9876543210'
      });
      console.log('✓ Test candidate created:', candidate._id);
    } else {
      console.log('✓ Using existing test candidate:', candidate._id);
    }

    // 2. Create a job with scheduled interviews
    const testJob = await Job.create({
      title: 'Senior React Developer',
      description: 'Looking for an experienced React developer',
      employerId: new mongoose.Types.ObjectId(),
      location: 'Bangalore',
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
          description: 'Technical coding round with React and JavaScript questions',
          date: new Date('2025-01-25'),
          time: '10:00'
        },
        hr: {
          description: 'HR discussion about company culture and salary expectations',
          date: new Date('2025-01-26'),
          time: '14:30'
        },
        nonTechnical: { description: '', date: '', time: '' },
        managerial: { description: '', date: '', time: '' },
        final: { description: '', date: '', time: '' }
      },
      interviewScheduled: true
    });
    console.log('✓ Test job created with interviews:', testJob._id);

    // 3. Simulate candidate application
    const application = await Application.create({
      jobId: testJob._id,
      candidateId: candidate._id,
      employerId: testJob.employerId,
      coverLetter: 'I am interested in this position'
    });
    console.log('✓ Application created:', application._id);

    // 4. Create the detailed interview notification
    const scheduledRounds = [];
    Object.entries(testJob.interviewRoundTypes).forEach(([roundType, isSelected]) => {
      if (isSelected && testJob.interviewRoundDetails[roundType]) {
        const details = testJob.interviewRoundDetails[roundType];
        if (details.date && details.time) {
          const roundNames = {
            technical: 'Technical Round',
            nonTechnical: 'Non-Technical Round', 
            managerial: 'Managerial Round',
            final: 'Final Round',
            hr: 'HR Round'
          };
          scheduledRounds.push({
            name: roundNames[roundType],
            date: new Date(details.date).toLocaleDateString(),
            time: details.time,
            description: details.description
          });
        }
      }
    });

    let message = `Your application for ${testJob.title} has been received. Interview rounds scheduled:\n\n`;
    scheduledRounds.forEach((round, index) => {
      message += `${index + 1}. ${round.name}\n`;
      message += `   Date: ${round.date}\n`;
      message += `   Time: ${round.time}\n`;
      if (round.description) {
        message += `   Details: ${round.description}\n`;
      }
      message += '\n';
    });
    message += 'Please be prepared and arrive on time. Good luck!';

    const notification = await createNotification({
      title: 'Interview Schedule - Application Received',
      message: message,
      type: 'interview_scheduled',
      role: 'candidate',
      relatedId: application._id,
      createdBy: testJob.employerId,
      candidateId: candidate._id
    });

    console.log('✓ Interview notification created:', notification._id);
    console.log('\n📋 Notification details:');
    console.log('Title:', notification.title);
    console.log('Message preview:', notification.message.substring(0, 100) + '...');

    // 5. Test notification retrieval for candidate
    const candidateNotifications = await Notification.find({
      $or: [
        { role: 'candidate', candidateId: { $exists: false } },
        { role: 'candidate', candidateId: candidate._id }
      ]
    }).sort({ createdAt: -1 }).limit(5);

    console.log(`\n✓ Found ${candidateNotifications.length} notifications for candidate`);
    candidateNotifications.forEach((notif, i) => {
      console.log(`   ${i+1}. ${notif.title} - ${notif.type}`);
      if (notif.candidateId) {
        console.log(`      (Specific to candidate: ${notif.candidateId})`);
      } else {
        console.log('      (General notification)');
      }
    });

    // 6. Show the formatted message
    console.log('\n📝 Full notification message:');
    console.log('=' .repeat(50));
    console.log(notification.message);
    console.log('=' .repeat(50));

    console.log('\n✅ Test completed successfully!');
    console.log('\n🔍 To test in frontend:');
    console.log('   1. Login as candidate: testcandidate@example.com / password123');
    console.log('   2. Check notification bell for interview details');

    // Cleanup
    await Job.findByIdAndDelete(testJob._id);
    await Application.findByIdAndDelete(application._id);
    await Notification.findByIdAndDelete(notification._id);
    console.log('\n🧹 Test data cleaned up');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testInterviewNotifications();