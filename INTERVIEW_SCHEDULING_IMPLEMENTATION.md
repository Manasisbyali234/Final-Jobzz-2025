# Interview Round Scheduling Implementation

## Overview
This implementation adds comprehensive interview round scheduling functionality to the job posting system. Employers can now set up detailed interview rounds with descriptions, dates, and times, and candidates receive notifications about scheduled interviews.

## Features Implemented

### 1. Interview Round Types
The system supports 5 types of interview rounds:
- **Technical Round** - For technical assessments and coding challenges
- **Non-Technical Round** - For general aptitude and soft skills
- **Managerial Round** - For leadership and management discussions
- **Final Round** - For final decision making
- **HR Round** - For HR discussions and company culture

### 2. Interview Round Details
For each selected round type, employers can specify:
- **Description** - Detailed description of what the round involves
- **Date** - Scheduled date for the interview round
- **Time** - Scheduled time for the interview round

### 3. Database Schema Updates

#### Job Model (`models/Job.js`)
Added new fields:
```javascript
interviewRoundDetails: {
  technical: {
    description: { type: String },
    date: { type: Date },
    time: { type: String }
  },
  nonTechnical: {
    description: { type: String },
    date: { type: Date },
    time: { type: String }
  },
  managerial: {
    description: { type: String },
    date: { type: Date },
    time: { type: String }
  },
  final: {
    description: { type: String },
    date: { type: Date },
    time: { type: String }
  },
  hr: {
    description: { type: String },
    date: { type: Date },
    time: { type: String }
  }
},
interviewScheduled: { type: Boolean, default: false }
```

#### Notification Model (`models/Notification.js`)
Added new notification types:
- `interview_scheduled` - When interview rounds are first scheduled
- `interview_updated` - When interview schedule is updated

### 4. Frontend Implementation

#### Job Posting Form (`emp-post-job.jsx`)
- Added interview round details state management
- Dynamic form fields that appear when interview round types are selected
- Each selected round type shows fields for description, date, and time
- Clean, organized UI with proper styling and validation

#### Key Features:
- **Dynamic Form Fields** - Only shows detail fields for selected round types
- **Real-time Updates** - Form updates immediately when rounds are selected/deselected
- **Validation** - Ensures proper data entry for scheduled rounds
- **Auto-save** - Maintains form state during editing

### 5. Backend Implementation

#### Enhanced Job Creation (`employerController.js`)
- Automatically detects when interview rounds are scheduled
- Sets `interviewScheduled` flag when rounds have complete details
- Creates appropriate notifications for candidates

#### Enhanced Job Updates
- Detects changes in interview scheduling
- Creates different notifications for new scheduling vs. updates
- Maintains interview scheduling state

#### Notification System
- Automatic notification creation when interviews are scheduled
- Separate notifications for new scheduling and updates
- Notifications sent to all candidates via the existing notification system

### 6. Notification System Integration

#### Candidate Notifications
Candidates receive notifications at `http://localhost:3000/candidate` through:
- **NotificationBell Component** - Shows unread count and notification dropdown
- **Real-time Updates** - Polls for new notifications every 30 seconds
- **Notification Types**:
  - "Interview Rounds Scheduled" - When rounds are first scheduled
  - "Interview Schedule Updated" - When existing schedule is modified

#### Notification Features:
- **Unread Count Badge** - Shows number of unread notifications
- **Mark as Read** - Individual and bulk mark as read functionality
- **Detailed Messages** - Clear information about job title and company
- **Timestamps** - Shows when notifications were created

### 7. API Endpoints

#### Existing Endpoints Enhanced:
- `POST /api/employer/jobs` - Now handles interview round details
- `PUT /api/employer/jobs/:jobId` - Now handles interview schedule updates
- `GET /api/notifications/candidate` - Delivers interview notifications to candidates

### 8. Testing

#### Comprehensive Test Suite (`testInterviewScheduling.js`)
- Tests job creation with interview details
- Verifies notification creation
- Validates data structure integrity
- Confirms candidate notification delivery
- All tests pass successfully ✅

## Usage Instructions

### For Employers (Job Posting):

1. **Navigate to Job Posting**
   - Go to `http://localhost:3000/employer/post-job`

2. **Select Interview Round Types**
   - Check the desired interview round types (Technical, HR, etc.)

3. **Fill Interview Details**
   - For each selected round, fill in:
     - Description of what the round involves
     - Date when the round will be conducted
     - Time for the interview round

4. **Submit Job**
   - Complete the job posting form and submit
   - System automatically creates notifications for candidates

### For Candidates (Receiving Notifications):

1. **View Notifications**
   - Go to `http://localhost:3000/candidate`
   - Check the notification bell in the header

2. **Notification Types**
   - "New Job Posted" - When a new job is available
   - "Interview Rounds Scheduled" - When interview rounds are scheduled
   - "Interview Schedule Updated" - When schedule is modified

3. **Manage Notifications**
   - Click individual notifications to mark as read
   - Use "Mark all as read" for bulk actions

## Technical Implementation Details

### State Management
```javascript
interviewRoundDetails: {
  technical: { description: '', date: '', time: '' },
  nonTechnical: { description: '', date: '', time: '' },
  managerial: { description: '', date: '', time: '' },
  final: { description: '', date: '', time: '' },
  hr: { description: '', date: '', time: '' }
}
```

### Notification Logic
```javascript
// Check if interview rounds are scheduled
const hasScheduledRounds = jobData.interviewRoundDetails && 
  Object.values(jobData.interviewRoundDetails).some(round => 
    round.date && round.time && round.description
  );

// Create appropriate notifications
if (hasScheduledRounds) {
  await createNotification({
    title: 'Interview Rounds Scheduled',
    message: `Interview rounds have been scheduled for ${job.title} position`,
    type: 'interview_scheduled',
    role: 'candidate',
    relatedId: job._id,
    createdBy: req.user._id
  });
}
```

## Files Modified/Created

### Backend Files:
- `models/Job.js` - Added interview round details schema
- `models/Notification.js` - Added new notification types
- `controllers/employerController.js` - Enhanced job creation/update logic
- `testInterviewScheduling.js` - Comprehensive test suite

### Frontend Files:
- `src/app/pannels/employer/components/jobs/emp-post-job.jsx` - Enhanced job posting form

### Existing Files Utilized:
- `components/NotificationBell.jsx` - Existing notification system
- `controllers/notificationController.js` - Existing notification logic
- `routes/notifications.js` - Existing notification routes

## Benefits

1. **Enhanced User Experience** - Candidates know exactly when interviews are scheduled
2. **Better Organization** - Employers can plan and communicate interview schedules clearly
3. **Real-time Communication** - Automatic notifications keep candidates informed
4. **Scalable Design** - Easy to add more round types or notification features
5. **Data Integrity** - Proper validation and error handling throughout

## Future Enhancements

1. **Email Notifications** - Send email alerts for interview scheduling
2. **Calendar Integration** - Allow candidates to add interviews to their calendars
3. **Interview Reminders** - Send reminder notifications before interviews
4. **Interview Feedback** - Allow post-interview feedback collection
5. **Video Call Integration** - Direct links to video interview platforms

## Conclusion

The interview scheduling functionality has been successfully implemented with comprehensive features for both employers and candidates. The system provides a seamless experience for scheduling, managing, and communicating interview rounds while maintaining data integrity and providing real-time notifications.