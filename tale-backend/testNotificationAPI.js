const mongoose = require('mongoose');
require('dotenv').config();

const Candidate = require('./models/Candidate');
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');

async function testNotificationAPI() {
  try {
    console.log('Testing notification API...\n');

    // 1. Find or create a test candidate
    let candidate = await Candidate.findOne({ email: 'test@candidate.com' });
    
    if (!candidate) {
      console.log('Creating test candidate...');
      candidate = await Candidate.create({
        name: 'Test Candidate',
        email: 'test@candidate.com',
        password: 'password123',
        phone: '9876543210'
      });
      console.log('✓ Test candidate created:', candidate._id);
    } else {
      console.log('✓ Using existing test candidate:', candidate._id);
    }

    // 2. Generate a token for the candidate
    const token = jwt.sign(
      { id: candidate._id, role: 'candidate' }, 
      process.env.JWT_SECRET || 'your-secret-key', 
      { expiresIn: '1h' }
    );
    console.log('✓ Generated token for candidate');

    // 3. Test the notification API endpoint
    const fetch = require('node-fetch');
    
    console.log('\n🔍 Testing GET /api/notifications/candidate');
    const response = await fetch('http://localhost:5000/api/notifications/candidate', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log(`\n✅ API working! Found ${data.notifications.length} notifications`);
      console.log(`   Unread count: ${data.unreadCount}`);
      
      if (data.notifications.length > 0) {
        console.log('\n📋 Recent notifications:');
        data.notifications.slice(0, 3).forEach((notif, i) => {
          console.log(`   ${i+1}. ${notif.title} - ${notif.type} (Read: ${notif.isRead})`);
        });
      }
    } else {
      console.log('❌ API failed:', data.message);
    }

    // 4. Test credentials for frontend
    console.log('\n🔑 Test credentials for frontend:');
    console.log('   Email: test@candidate.com');
    console.log('   Password: password123');
    console.log('   Token (for manual testing):', token.substring(0, 50) + '...');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testNotificationAPI();