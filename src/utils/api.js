const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = (userType = 'candidate') => {
  const token = localStorage.getItem(`${userType}Token`);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Public APIs
  getJobs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/public/jobs?${queryString}`).then((res) => res.json());
  },

  getJobById: (id) => {
    return fetch(`${API_BASE_URL}/public/jobs/${id}`).then((res) => res.json());
  },

  getCompanies: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/public/companies?${queryString}`).then((res) => res.json());
  },

  getBlogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/public/blogs?${queryString}`).then((res) => res.json());
  },

  submitContact: (data) => {
    return fetch(`${API_BASE_URL}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },

  getPublicStats: () => {
    return fetch(`${API_BASE_URL}/public/stats`).then((res) => res.json());
  },

  // Candidate APIs
  candidateRegister: (data) => {
    return fetch(`${API_BASE_URL}/candidate/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },

  candidateLogin: (data) => {
    return fetch(`${API_BASE_URL}/candidate/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },

  getCandidateProfile: () => {
    return fetch(`${API_BASE_URL}/candidate/profile`, {
      headers: getAuthHeaders('candidate'),
    }).then((res) => res.json());
  },

  updateCandidateProfile: (data) => {
    const token = localStorage.getItem('candidateToken');
    const isFormData = data instanceof FormData;
    
    return fetch(`${API_BASE_URL}/candidate/profile`, {
      method: 'PUT',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
      body: isFormData ? data : JSON.stringify(data),
    }).then((res) => res.json());
  },

  getCandidateDashboard: () => {
    return fetch(`${API_BASE_URL}/candidate/dashboard`, {
      headers: getAuthHeaders('candidate'),
    }).then((res) => res.json());
  },

  applyForJob: (jobId, applicationData) => {
    return fetch(`${API_BASE_URL}/candidate/apply/${jobId}`, {
      method: 'POST',
      headers: getAuthHeaders('candidate'),
      body: JSON.stringify(applicationData),
    }).then((res) => res.json());
  },

  getCandidateApplications: () => {
    return fetch(`${API_BASE_URL}/candidate/applications`, {
      headers: getAuthHeaders('candidate'),
    }).then((res) => res.json());
  },

  getCandidateApplicationsWithInterviews: () => {
    return fetch(`${API_BASE_URL}/candidate/applications/interviews`, {
      headers: getAuthHeaders('candidate'),
    }).then((res) => res.json());
  },

  uploadResume: (formData) => {
    const token = localStorage.getItem('candidateToken');
    return fetch(`${API_BASE_URL}/candidate/upload-resume`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }).then((res) => res.json());
  },

  // Employer APIs
  employerRegister: (data) => {
    return fetch(`${API_BASE_URL}/employer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },

  employerLogin: (data) => {
    return fetch(`${API_BASE_URL}/employer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },

  getEmployerProfile: () => {
    return fetch(`${API_BASE_URL}/employer/profile`, {
      headers: getAuthHeaders('employer'),
    }).then((res) => res.json());
  },

  updateEmployerProfile: (data) => {
    return fetch(`${API_BASE_URL}/employer/profile`, {
      method: 'PUT',
      headers: getAuthHeaders('employer'),
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },

  getEmployerDashboard: () => {
    return fetch(`${API_BASE_URL}/employer/dashboard/stats`, {
      headers: getAuthHeaders('employer'),
    }).then((res) => res.json());
  },

  postJob: (jobData) => {
    return fetch(`${API_BASE_URL}/employer/jobs`, {
      method: 'POST',
      headers: getAuthHeaders('employer'),
      body: JSON.stringify(jobData),
    }).then((res) => res.json());
  },

  getEmployerJobs: () => {
    return fetch(`${API_BASE_URL}/employer/jobs`, {
      headers: getAuthHeaders('employer'),
    }).then((res) => res.json());
  },

  updateJob: (jobId, jobData) => {
    return fetch(`${API_BASE_URL}/employer/jobs/${jobId}`, {
      method: 'PUT',
      headers: getAuthHeaders('employer'),
      body: JSON.stringify(jobData),
    }).then((res) => res.json());
  },

  deleteJob: (jobId) => {
    return fetch(`${API_BASE_URL}/employer/jobs/${jobId}`, {
      method: 'DELETE',
      headers: getAuthHeaders('employer'),
    }).then((res) => res.json());
  },

  getJobApplications: (jobId) => {
    return fetch(`${API_BASE_URL}/employer/jobs/${jobId}/applications`, {
      headers: getAuthHeaders('employer'),
    }).then((res) => res.json());
  },

  // Placement APIs
  placementLogin: (data) => {
    return fetch(`${API_BASE_URL}/placement/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },

  // Admin APIs
  adminLogin: (data) => {
    return fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },

  getAdminStats: () => {
    return fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  getAdminUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/admin/users?${queryString}`, {
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  getAllCandidates: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/admin/candidates?${queryString}`, {
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  getAllEmployers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/admin/employers?${queryString}`, {
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  getAllJobs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/admin/jobs?${queryString}`, {
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  deleteCandidate: (candidateId) => {
    return fetch(`${API_BASE_URL}/admin/candidates/${candidateId}`, {
      method: 'DELETE',
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  updateEmployerStatus: (employerId, status) => {
    const isApproved = status === 'approved';
    return fetch(`${API_BASE_URL}/admin/employers/${employerId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders('admin'),
      body: JSON.stringify({ status, isApproved }),
    }).then((res) => res.json());
  },

  deleteEmployer: (employerId) => {
    return fetch(`${API_BASE_URL}/admin/employers/${employerId}`, {
      method: 'DELETE',
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  adminDeleteJob: (jobId) => {
    return fetch(`${API_BASE_URL}/admin/jobs/${jobId}`, {
      method: 'DELETE',
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  getRegisteredCandidates: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/admin/registered-candidates?${queryString}`, {
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  getShortlistedApplications: () => {
    return fetch(`${API_BASE_URL}/admin/applications?status=shortlisted`, {
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  getAllPlacements: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/admin/placements?${queryString}`, {
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  updatePlacementStatus: (placementId, status) => {
    const isApproved = status === 'approved';
    return fetch(`${API_BASE_URL}/admin/placements/${placementId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders('admin'),
      body: JSON.stringify({ status, isApproved }),
    }).then((res) => res.json());
  },

  getPlacementDetails: (placementId) => {
    return fetch(`${API_BASE_URL}/admin/placements/${placementId}`, {
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },

  assignPlacementCredits: (placementId, credits) => {
    return fetch(`${API_BASE_URL}/admin/placements/${placementId}/credits`, {
      method: 'PUT',
      headers: getAuthHeaders('admin'),
      body: JSON.stringify({ credits }),
    }).then((res) => res.json());
  },

  processPlacementData: (placementId) => {
    return fetch(`${API_BASE_URL}/admin/placements/${placementId}/process`, {
      method: 'POST',
      headers: getAuthHeaders('admin'),
    }).then((res) => res.json());
  },
};

export default api;