# Tale Backend - Job Portal API

## Overview
The Tale Backend is a comprehensive RESTful API built with Node.js and Express.js for the Final-Jobzz-2025 job portal platform. It provides secure endpoints for candidates, employers, and administrators to manage job-related operations.

## Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Admin Configuration
ADMIN_EMAIL=admin@jobportal.com
ADMIN_PASSWORD=admin123
```

### Running the Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start

# Create admin user
npm run create-admin

# Add sample data
npm run add-sample-data
```

## API Architecture

### Base URL
```
http://localhost:5000/api
```

### Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Response Format
All API responses follow this structure:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": {}, // Response data (if applicable)
  "error": {} // Error details (if applicable)
}
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Jobs
- `GET /api/public/jobs` - Get all active jobs with filtering
- `GET /api/public/jobs/:id` - Get job details by ID
- `GET /api/public/stats` - Get public statistics

#### Companies
- `GET /api/public/companies` - Get all companies with filtering

#### Contact
- `POST /api/public/contact` - Submit contact form

#### Blogs
- `GET /api/public/blogs` - Get all blogs

### Candidate Endpoints

#### Authentication
- `POST /api/candidate/register` - Register new candidate
- `POST /api/candidate/login` - Candidate login
- `POST /api/candidate/forgot-password` - Request password reset
- `POST /api/candidate/reset-password` - Reset password

#### Profile Management
- `GET /api/candidate/profile` - Get candidate profile
- `PUT /api/candidate/profile` - Update candidate profile
- `POST /api/candidate/upload-resume` - Upload resume file

#### Dashboard
- `GET /api/candidate/dashboard` - Get dashboard statistics

#### Job Applications
- `POST /api/candidate/apply/:jobId` - Apply for a job
- `GET /api/candidate/applications` - Get all applications
- `GET /api/candidate/applications/interviews` - Get applications with interview details
- `PUT /api/candidate/applications/:id/status` - Update application status

### Employer Endpoints

#### Authentication
- `POST /api/employer/register` - Register new employer
- `POST /api/employer/login` - Employer login
- `POST /api/employer/forgot-password` - Request password reset
- `POST /api/employer/reset-password` - Reset password

#### Profile Management
- `GET /api/employer/profile` - Get employer profile
- `PUT /api/employer/profile` - Update employer profile

#### Dashboard
- `GET /api/employer/dashboard/stats` - Get dashboard statistics

#### Job Management
- `POST /api/employer/jobs` - Create new job
- `GET /api/employer/jobs` - Get employer's jobs
- `GET /api/employer/jobs/:id` - Get specific job details
- `PUT /api/employer/jobs/:id` - Update job
- `DELETE /api/employer/jobs/:id` - Delete job

#### Application Management
- `GET /api/employer/jobs/:jobId/applications` - Get job applications
- `PUT /api/employer/applications/:id/status` - Update application status
- `GET /api/employer/candidates` - Get all candidates who applied

### Admin Endpoints

#### Authentication
- `POST /api/admin/login` - Admin login

#### Dashboard
- `GET /api/admin/dashboard/stats` - Get admin dashboard statistics

#### User Management
- `GET /api/admin/candidates` - Get all candidates
- `GET /api/admin/employers` - Get all employers
- `DELETE /api/admin/candidates/:id` - Delete candidate
- `DELETE /api/admin/employers/:id` - Delete employer
- `PUT /api/admin/employers/:id/status` - Update employer status

#### Job Management
- `GET /api/admin/jobs` - Get all jobs
- `DELETE /api/admin/jobs/:id` - Delete job

#### Applications
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/registered-candidates` - Get registered candidates

## Data Models

### Candidate Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  isVerified: Boolean (default: false),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  timestamps: true
}
```

### Employer Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  companyName: String (required),
  employerType: String (enum: ['company', 'consultant'], default: 'company'),
  isVerified: Boolean (default: false),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  isApproved: Boolean (default: false),
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  timestamps: true
}
```

### Job Model
```javascript
{
  title: String (required),
  description: String (required),
  employerId: ObjectId (ref: 'Employer', required),
  location: String (required),
  companyLogo: String, // Base64 encoded (for consultants)
  companyName: String, // For consultants
  companyDescription: String, // For consultants
  category: String,
  salary: {
    min: Number,
    max: Number,
    currency: String (default: 'INR')
  },
  ctc: {
    min: Number,
    max: Number
  },
  netSalary: {
    min: Number,
    max: Number
  },
  jobType: String (enum: ['full-time', 'part-time', 'contract', 'internship', 'internship-(paid)', 'internship-(unpaid)', 'work-from-home'], required),
  vacancies: Number,
  applicationLimit: Number,
  education: String,
  backlogsAllowed: Boolean (default: false),
  requiredSkills: [String],
  experienceLevel: String (enum: ['freshers', 'minimum', 'both', 'entry', 'mid', 'senior', 'executive']),
  minExperience: Number (default: 0),
  interviewRoundsCount: Number,
  interviewRoundTypes: {
    technical: Boolean (default: false),
    managerial: Boolean (default: false),
    nonTechnical: Boolean (default: false),
    final: Boolean (default: false),
    hr: Boolean (default: false)
  },
  interviewRoundDetails: {
    technical: { description: String, date: Date, time: String },
    nonTechnical: { description: String, date: Date, time: String },
    managerial: { description: String, date: Date, time: String },
    final: { description: String, date: Date, time: String },
    hr: { description: String, date: Date, time: String }
  },
  offerLetterDate: Date,
  transportation: {
    oneWay: Boolean (default: false),
    twoWay: Boolean (default: false),
    noCab: Boolean (default: false)
  },
  status: String (enum: ['active', 'closed', 'draft', 'pending'], default: 'active'),
  applicationCount: Number (default: 0),
  interviewScheduled: Boolean (default: false),
  timestamps: true
}
```

### Application Model
```javascript
{
  candidateId: ObjectId (ref: 'Candidate', required),
  jobId: ObjectId (ref: 'Job', required),
  employerId: ObjectId (ref: 'Employer', required),
  status: String (enum: ['applied', 'shortlisted', 'rejected', 'hired'], default: 'applied'),
  coverLetter: String,
  resume: String, // Base64 encoded
  appliedAt: Date (default: Date.now),
  timestamps: true
}
```

## Middleware

### Authentication Middleware (`middlewares/auth.js`)
Validates JWT tokens and sets user information in request object.

### Error Handler (`middlewares/errorHandler.js`)
Centralized error handling for consistent error responses.

### Upload Middleware (`middlewares/upload.js`)
Handles file uploads and converts to Base64 for database storage.

### Validation Middleware (`middlewares/validation.js`)
Input validation using express-validator.

## Security Features

### Password Security
- Passwords hashed using bcryptjs with salt rounds
- Password reset tokens with expiration
- Secure password validation

### JWT Security
- Secure JWT secret key
- Token expiration (7 days default)
- Role-based access control

### API Security
- Helmet for security headers
- CORS configuration
- Rate limiting (10,000 requests per 15 minutes)
- Input sanitization and validation

### Database Security
- MongoDB connection with authentication
- Mongoose schema validation
- Indexed fields for performance

## File Storage

The API uses Base64 encoding to store files directly in MongoDB:
- Resume files converted to Base64 strings
- Company logos stored as Base64
- No external file storage dependencies

## Email Service

Email notifications are sent using Nodemailer:
- Welcome emails for new registrations
- Password reset emails
- Job application notifications
- Interview scheduling notifications

## Error Handling

### Error Types
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "type": "ValidationError",
    "details": "Specific error details"
  }
}
```

## Database Configuration

### Connection
MongoDB connection is configured in `config/database.js`:
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
```

### Indexes
- Text indexes on job titles and descriptions for search
- Unique indexes on email fields
- Compound indexes for efficient queries

## Scripts

### Available Scripts
- `npm run create-admin` - Creates admin user
- `npm run add-sample-data` - Adds sample jobs and users
- `node checkCTC.js` - Checks CTC data in jobs
- `node createSampleJobs.js` - Creates sample job data

## Testing

### API Testing
Use tools like Postman or curl to test endpoints:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test candidate registration
curl -X POST http://localhost:5000/api/candidate/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## Performance Optimization

### Database Optimization
- Proper indexing on frequently queried fields
- Pagination for large datasets
- Aggregation pipelines for complex queries

### API Optimization
- Response compression
- Efficient query patterns
- Caching strategies (can be implemented)

## Monitoring and Logging

### Health Check
- `/health` endpoint for server status monitoring
- Database connection status

### Logging
- Console logging for development
- Error logging for production debugging
- Request logging (can be implemented)

## Deployment

### Environment Variables
Ensure all required environment variables are set in production:
- `MONGODB_URI` - Production database URL
- `JWT_SECRET` - Strong secret key
- Email configuration for notifications

### Production Considerations
- Use process manager (PM2)
- Set up reverse proxy (Nginx)
- Configure SSL certificates
- Set up monitoring and logging
- Database backups and security

## Contributing

### Code Style
- Use consistent indentation (2 spaces)
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions

### Adding New Endpoints
1. Create route in appropriate route file
2. Add controller function
3. Add validation middleware if needed
4. Update documentation
5. Test thoroughly

### Database Changes
1. Update model schema
2. Create migration script if needed
3. Update API documentation
4. Test with existing data

## Troubleshooting

### Common Issues
1. **Database Connection Error**: Check MongoDB service and connection string
2. **JWT Token Error**: Verify JWT_SECRET and token format
3. **Email Service Error**: Check email credentials and SMTP settings
4. **File Upload Error**: Verify file size limits and encoding

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## License
This project is licensed under the MIT License.