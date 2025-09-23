# Final-Jobzz-2025 API Documentation

## Base Information

**Base URL:** `http://localhost:5000/api`  
**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`

## Authentication

### Token Format
```
Authorization: Bearer <jwt_token>
```

### Token Storage
- Candidate: `localStorage.getItem('candidateToken')`
- Employer: `localStorage.getItem('employerToken')`
- Admin: `localStorage.getItem('adminToken')`

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "type": "ErrorType",
    "details": "Detailed error information"
  }
}
```

## Public Endpoints

### Jobs

#### Get All Jobs
```http
GET /api/public/jobs
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Job category filter
- `location` (string): Location filter
- `jobType` (string): Job type filter
- `search` (string): Search in title and description
- `minSalary` (number): Minimum salary filter
- `maxSalary` (number): Maximum salary filter
- `experienceLevel` (string): Experience level filter

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "job_id",
        "title": "Software Developer",
        "description": "Job description...",
        "location": "Mumbai",
        "category": "IT",
        "salary": {
          "min": 500000,
          "max": 800000,
          "currency": "INR"
        },
        "jobType": "full-time",
        "requiredSkills": ["JavaScript", "React"],
        "experienceLevel": "mid",
        "employerId": {
          "companyName": "Tech Corp",
          "employerType": "company"
        },
        "applicationCount": 25,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalJobs": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Job by ID
```http
GET /api/public/jobs/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "job_id",
    "title": "Software Developer",
    "description": "Detailed job description...",
    "location": "Mumbai",
    "category": "IT",
    "salary": {
      "min": 500000,
      "max": 800000,
      "currency": "INR"
    },
    "ctc": {
      "min": 600000,
      "max": 1000000
    },
    "jobType": "full-time",
    "vacancies": 3,
    "education": "Bachelor's degree",
    "requiredSkills": ["JavaScript", "React", "Node.js"],
    "experienceLevel": "mid",
    "minExperience": 2,
    "interviewRoundsCount": 3,
    "interviewRoundTypes": {
      "technical": true,
      "hr": true,
      "final": true
    },
    "transportation": {
      "twoWay": true
    },
    "employerId": {
      "_id": "employer_id",
      "companyName": "Tech Corp",
      "employerType": "company"
    },
    "applicationCount": 25,
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Companies

#### Get All Companies
```http
GET /api/public/companies
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search company names

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "_id": "employer_id",
        "companyName": "Tech Corp",
        "employerType": "company",
        "jobCount": 5,
        "location": "Mumbai"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCompanies": 25
    }
  }
}
```

### Statistics

#### Get Public Statistics
```http
GET /api/public/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 150,
    "totalCompanies": 45,
    "totalApplications": 1200,
    "activeJobs": 120
  }
}
```

### Contact

#### Submit Contact Form
```http
POST /api/public/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Hello, I have a question..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

## Candidate Endpoints

### Authentication

#### Register Candidate
```http
POST /api/candidate/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "candidate_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "isVerified": false,
      "status": "active"
    }
  }
}
```

#### Login Candidate
```http
POST /api/candidate/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "candidate_id",
      "name": "John Doe",
      "email": "john@example.com",
      "isVerified": true,
      "status": "active"
    }
  }
}
```

### Profile Management

#### Get Candidate Profile
```http
GET /api/candidate/profile
Authorization: Bearer <candidate_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate": {
      "_id": "candidate_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "profile": {
      "personalInfo": {
        "dateOfBirth": "1995-05-15",
        "gender": "male",
        "address": "Mumbai, India"
      },
      "education": [
        {
          "degree": "Bachelor of Engineering",
          "institution": "Mumbai University",
          "year": 2018,
          "percentage": 85
        }
      ],
      "experience": [
        {
          "company": "Previous Corp",
          "position": "Junior Developer",
          "duration": "2 years",
          "description": "Worked on web applications"
        }
      ],
      "skills": ["JavaScript", "React", "Node.js"],
      "resume": "base64_encoded_resume"
    }
  }
}
```

#### Update Candidate Profile
```http
PUT /api/candidate/profile
Authorization: Bearer <candidate_token>
```

**Request Body:**
```json
{
  "personalInfo": {
    "dateOfBirth": "1995-05-15",
    "gender": "male",
    "address": "Mumbai, India"
  },
  "education": [
    {
      "degree": "Bachelor of Engineering",
      "institution": "Mumbai University",
      "year": 2018,
      "percentage": 85
    }
  ],
  "skills": ["JavaScript", "React", "Node.js", "Python"]
}
```

### Job Applications

#### Apply for Job
```http
POST /api/candidate/apply/:jobId
Authorization: Bearer <candidate_token>
```

**Request Body:**
```json
{
  "coverLetter": "I am very interested in this position...",
  "resume": "base64_encoded_resume_data"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "applicationId": "application_id",
    "status": "applied",
    "appliedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Candidate Applications
```http
GET /api/candidate/applications
Authorization: Bearer <candidate_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "application_id",
        "jobId": {
          "title": "Software Developer",
          "companyName": "Tech Corp",
          "location": "Mumbai"
        },
        "status": "shortlisted",
        "appliedAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-16T14:20:00Z"
      }
    ]
  }
}
```

### Dashboard

#### Get Candidate Dashboard
```http
GET /api/candidate/dashboard
Authorization: Bearer <candidate_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalApplications": 15,
      "shortlisted": 3,
      "rejected": 8,
      "pending": 4
    },
    "recentApplications": [
      {
        "_id": "application_id",
        "jobTitle": "Software Developer",
        "companyName": "Tech Corp",
        "status": "shortlisted",
        "appliedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "profileCompletion": 75
  }
}
```

## Employer Endpoints

### Authentication

#### Register Employer
```http
POST /api/employer/register
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@techcorp.com",
  "password": "password123",
  "phone": "9876543210",
  "companyName": "Tech Corp",
  "employerType": "company"
}
```

#### Login Employer
```http
POST /api/employer/login
```

**Request Body:**
```json
{
  "email": "jane@techcorp.com",
  "password": "password123"
}
```

### Job Management

#### Create Job
```http
POST /api/employer/jobs
Authorization: Bearer <employer_token>
```

**Request Body:**
```json
{
  "title": "Senior Software Developer",
  "description": "We are looking for an experienced developer...",
  "location": "Mumbai",
  "category": "IT",
  "salary": {
    "min": 800000,
    "max": 1200000,
    "currency": "INR"
  },
  "ctc": {
    "min": 1000000,
    "max": 1500000
  },
  "jobType": "full-time",
  "vacancies": 2,
  "education": "Bachelor's degree in Computer Science",
  "requiredSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "experienceLevel": "senior",
  "minExperience": 5,
  "interviewRoundsCount": 4,
  "interviewRoundTypes": {
    "technical": true,
    "managerial": true,
    "hr": true,
    "final": true
  },
  "transportation": {
    "twoWay": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "_id": "job_id",
    "title": "Senior Software Developer",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Employer Jobs
```http
GET /api/employer/jobs
Authorization: Bearer <employer_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "job_id",
        "title": "Senior Software Developer",
        "location": "Mumbai",
        "status": "active",
        "applicationCount": 12,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### Update Job
```http
PUT /api/employer/jobs/:jobId
Authorization: Bearer <employer_token>
```

#### Delete Job
```http
DELETE /api/employer/jobs/:jobId
Authorization: Bearer <employer_token>
```

### Application Management

#### Get Job Applications
```http
GET /api/employer/jobs/:jobId/applications
Authorization: Bearer <employer_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "application_id",
        "candidateId": {
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "9876543210"
        },
        "status": "applied",
        "coverLetter": "I am interested...",
        "resume": "base64_encoded_resume",
        "appliedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Dashboard

#### Get Employer Dashboard
```http
GET /api/employer/dashboard/stats
Authorization: Bearer <employer_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalJobs": 8,
      "activeJobs": 6,
      "totalApplications": 45,
      "shortlistedCandidates": 12
    },
    "recentApplications": [
      {
        "_id": "application_id",
        "candidateName": "John Doe",
        "jobTitle": "Software Developer",
        "status": "applied",
        "appliedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## Admin Endpoints

### Authentication

#### Admin Login
```http
POST /api/admin/login
```

**Request Body:**
```json
{
  "email": "admin@jobportal.com",
  "password": "admin123"
}
```

### Dashboard

#### Get Admin Statistics
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalCandidates": 250,
      "totalEmployers": 45,
      "totalJobs": 120,
      "totalApplications": 800,
      "pendingEmployers": 5,
      "activeJobs": 95
    },
    "recentActivity": [
      {
        "type": "new_registration",
        "userType": "candidate",
        "userName": "John Doe",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### User Management

#### Get All Candidates
```http
GET /api/admin/candidates
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by name or email
- `status` (string): Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "_id": "candidate_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "status": "active",
        "isVerified": true,
        "applicationCount": 5,
        "createdAt": "2024-01-10T08:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalCandidates": 250
    }
  }
}
```

#### Get All Employers
```http
GET /api/admin/employers
Authorization: Bearer <admin_token>
```

#### Delete Candidate
```http
DELETE /api/admin/candidates/:candidateId
Authorization: Bearer <admin_token>
```

#### Update Employer Status
```http
PUT /api/admin/employers/:employerId/status
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "approved",
  "isApproved": true
}
```

### Job Management

#### Get All Jobs (Admin)
```http
GET /api/admin/jobs
Authorization: Bearer <admin_token>
```

#### Delete Job (Admin)
```http
DELETE /api/admin/jobs/:jobId
Authorization: Bearer <admin_token>
```

## Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### Custom Error Types
- `ValidationError` - Input validation failed
- `AuthenticationError` - Invalid credentials
- `AuthorizationError` - Insufficient permissions
- `NotFoundError` - Resource not found
- `ConflictError` - Resource already exists
- `ServerError` - Internal server error

## Rate Limiting

- **Limit**: 10,000 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

## File Upload

### Resume Upload
```http
POST /api/candidate/upload-resume
Authorization: Bearer <candidate_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `resume`: File (PDF, DOC, DOCX)

**Response:**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resumeBase64": "base64_encoded_file_data",
    "fileName": "resume.pdf",
    "fileSize": 1024000
  }
}
```

## Pagination

### Standard Pagination Response
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Search and Filtering

### Job Search Parameters
- `search`: Text search in title and description
- `category`: Job category filter
- `location`: Location filter
- `jobType`: Employment type filter
- `experienceLevel`: Experience level filter
- `minSalary`: Minimum salary filter
- `maxSalary`: Maximum salary filter
- `skills`: Required skills filter (comma-separated)

### Example Search Query
```http
GET /api/public/jobs?search=developer&category=IT&location=Mumbai&minSalary=500000&skills=JavaScript,React
```

## Webhooks (Future Implementation)

### Application Status Update
```json
{
  "event": "application.status_changed",
  "data": {
    "applicationId": "app_id",
    "candidateId": "candidate_id",
    "jobId": "job_id",
    "oldStatus": "applied",
    "newStatus": "shortlisted",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## SDK Examples

### JavaScript/Node.js
```javascript
const API_BASE = 'http://localhost:5000/api';

class JobPortalAPI {
  constructor(token = null) {
    this.token = token;
  }
  
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      ...options
    };
    
    const response = await fetch(url, config);
    return response.json();
  }
  
  async getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/public/jobs?${query}`);
  }
  
  async candidateLogin(credentials) {
    return this.request('/candidate/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }
}

// Usage
const api = new JobPortalAPI();
const jobs = await api.getJobs({ category: 'IT', location: 'Mumbai' });
```

This API documentation provides comprehensive information about all available endpoints, request/response formats, authentication requirements, and usage examples for the Final-Jobzz-2025 job portal platform.