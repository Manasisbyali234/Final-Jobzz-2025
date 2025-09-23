# Final-Jobzz-2025 - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Setup & Installation](#setup--installation)
8. [Deployment](#deployment)
9. [Contributing](#contributing)

## Project Overview

Final-Jobzz-2025 is a comprehensive job portal application built with React.js frontend and Node.js/Express backend. The platform serves three main user types: Candidates, Employers, and Administrators.

### Key Features
- **Multi-role Authentication**: Separate dashboards for candidates, employers, and admins
- **Job Management**: Post, search, and apply for jobs
- **Profile Management**: Detailed profiles for candidates and employers
- **Application Tracking**: Track job applications and interview processes
- **Admin Panel**: Complete administrative control over users and jobs
- **Real-time Notifications**: Email notifications for various events
- **File Upload**: Resume and document management with Base64 storage

### Technology Stack
- **Frontend**: React.js 18, React Router, Bootstrap, Chart.js
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Base64 encoding (database storage)
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

## Architecture

```
Final-Jobzz-2025/
├── src/                    # React Frontend
├── tale-backend/           # Node.js Backend API
├── public/                 # Static assets
└── documentation files
```

### System Architecture
- **Frontend**: Single Page Application (SPA) with React
- **Backend**: RESTful API with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based stateless authentication
- **File Storage**: Base64 encoded files stored in MongoDB

## Backend Documentation

### Project Structure
```
tale-backend/
├── config/
│   └── database.js         # MongoDB connection
├── controllers/            # Business logic
│   ├── adminController.js
│   ├── candidateController.js
│   ├── employerController.js
│   └── publicController.js
├── middlewares/           # Custom middleware
│   ├── auth.js           # JWT authentication
│   ├── errorHandler.js   # Error handling
│   ├── upload.js         # File upload handling
│   └── validation.js     # Input validation
├── models/               # MongoDB schemas
│   ├── Admin.js
│   ├── Application.js
│   ├── Candidate.js
│   ├── Employer.js
│   ├── Job.js
│   └── ...
├── routes/               # API routes
│   ├── admin.js
│   ├── candidate.js
│   ├── employer.js
│   └── public.js
├── scripts/              # Utility scripts
├── utils/                # Helper functions
└── server.js            # Main server file
```

### Key Backend Features

#### Authentication System
- JWT-based authentication for all user types
- Password hashing with bcryptjs
- Role-based access control
- Password reset functionality

#### API Endpoints Structure
- `/api/public/*` - Public endpoints (no auth required)
- `/api/candidate/*` - Candidate-specific endpoints
- `/api/employer/*` - Employer-specific endpoints
- `/api/admin/*` - Admin-only endpoints

#### Security Features
- Helmet for security headers
- CORS configuration
- Rate limiting (10,000 requests per 15 minutes)
- Input validation and sanitization
- Error handling middleware

#### Database Models

**Job Model Features:**
- Complete job information with salary ranges
- Interview round management
- Application tracking
- Consultant-specific fields
- Transportation options

**User Models:**
- Separate models for Candidates, Employers, and Admins
- Profile completion tracking
- Status management (active/inactive)
- Email verification system

## Frontend Documentation

### Project Structure
```
src/
├── app/                   # Main application components
│   ├── common/           # Shared components
│   ├── pannels/          # User-specific dashboards
│   │   ├── admin/        # Admin panel components
│   │   ├── candidate/    # Candidate dashboard
│   │   ├── employer/     # Employer dashboard
│   │   └── public-user/  # Public pages
├── components/           # Reusable components
├── contexts/            # React contexts
├── globals/             # Global configurations
├── layouts/             # Layout components
├── routing/             # Route configurations
├── utils/               # Utility functions
└── App.js              # Main app component
```

### Key Frontend Features

#### Multi-Layout System
- **Public Layout**: For non-authenticated users
- **Candidate Layout**: Dashboard for job seekers
- **Employer Layout**: Dashboard for job posters
- **Admin Layout**: Administrative interface

#### Authentication Context
- Centralized authentication state management
- Automatic token refresh
- Role-based route protection
- Persistent login sessions

#### Component Architecture
- Modular component design
- Reusable UI components
- Responsive design with Bootstrap
- AOS animations for better UX

#### Dashboard Features
- **Candidate Dashboard**: Profile management, job applications, resume builder
- **Employer Dashboard**: Job posting, candidate management, analytics
- **Admin Dashboard**: User management, system statistics, content moderation

## API Documentation

### Authentication Endpoints

#### POST /api/candidate/register
Register a new candidate
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

#### POST /api/candidate/login
Authenticate candidate
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Job Management Endpoints

#### GET /api/public/jobs
Get all jobs with filtering
Query Parameters:
- `category`: Job category
- `location`: Job location
- `jobType`: Employment type
- `page`: Page number
- `limit`: Results per page

#### POST /api/employer/jobs
Create a new job (Employer only)
```json
{
  "title": "Software Developer",
  "description": "Job description...",
  "location": "Mumbai",
  "category": "IT",
  "jobType": "full-time",
  "salary": {
    "min": 500000,
    "max": 800000
  },
  "requiredSkills": ["JavaScript", "React", "Node.js"],
  "experienceLevel": "mid"
}
```

### Application Endpoints

#### POST /api/candidate/apply/:jobId
Apply for a job
```json
{
  "coverLetter": "I am interested in this position...",
  "resume": "base64_encoded_resume_data"
}
```

#### GET /api/employer/jobs/:jobId/applications
Get applications for a specific job (Employer only)

### Admin Endpoints

#### GET /api/admin/dashboard/stats
Get system statistics
```json
{
  "totalCandidates": 150,
  "totalEmployers": 25,
  "totalJobs": 75,
  "totalApplications": 300
}
```

## Database Schema

### Collections Overview

#### Candidates Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  isVerified: Boolean,
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

#### Employers Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  companyName: String,
  employerType: String (company/consultant),
  isVerified: Boolean,
  isApproved: Boolean,
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

#### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  employerId: ObjectId (ref: Employer),
  location: String,
  category: String,
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  jobType: String,
  requiredSkills: [String],
  experienceLevel: String,
  status: String (active/closed/draft),
  applicationCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Applications Collection
```javascript
{
  _id: ObjectId,
  candidateId: ObjectId (ref: Candidate),
  jobId: ObjectId (ref: Job),
  employerId: ObjectId (ref: Employer),
  status: String (applied/shortlisted/rejected/hired),
  coverLetter: String,
  resume: String (base64),
  appliedAt: Date,
  updatedAt: Date
}
```

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd tale-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jobportal
   JWT_SECRET=your_jwt_secret_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to project root:
   ```bash
   cd Final-Jobzz-2025
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Database Setup
1. Start MongoDB service
2. Create admin user (optional):
   ```bash
   cd tale-backend
   npm run create-admin
   ```

3. Add sample data (optional):
   ```bash
   npm run add-sample-data
   ```

## Deployment

### Backend Deployment
1. **Environment Configuration**:
   - Set production environment variables
   - Configure MongoDB Atlas or production database
   - Set up email service credentials

2. **Build and Deploy**:
   ```bash
   npm install --production
   npm start
   ```

### Frontend Deployment
1. **Build for Production**:
   ```bash
   npm run build
   ```

2. **Deploy to Static Hosting**:
   - Upload build folder to hosting service
   - Configure routing for SPA
   - Set up environment variables

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Database**: MongoDB Atlas

## Contributing

### Development Guidelines
1. Follow existing code structure and naming conventions
2. Write meaningful commit messages
3. Test all changes thoroughly
4. Update documentation for new features
5. Follow security best practices

### Code Style
- Use consistent indentation (2 spaces)
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request with detailed description

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support and questions, please contact the development team or create an issue in the repository.