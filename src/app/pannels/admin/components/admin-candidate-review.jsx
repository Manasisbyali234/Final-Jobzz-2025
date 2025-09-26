import { useEffect, useState } from "react";
import JobZImage from "../../../common/jobz-img";
import { useNavigate, useParams } from "react-router-dom";
import './admin-candidate-review.css';

function AdminCandidateReviewPage() {
    const navigate = useNavigate();
    const { candidateId } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        fetchCandidateDetails();
    }, [candidateId]);

    const fetchCandidateDetails = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            const response = await fetch(`http://localhost:5000/api/admin/candidates/${candidateId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setCandidate(data.candidate);
            }
        } catch (error) {
            console.error('Error fetching candidate details:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    const downloadDocument = (fileData, fileName) => {
        if (!fileData) return;
        
        if (fileData.startsWith('data:')) {
            const link = document.createElement('a');
            link.href = fileData;
            link.download = fileName || 'document';
            link.click();
        } else {
            const link = document.createElement('a');
            link.href = `http://localhost:5000/${fileData}`;
            link.download = fileName || 'document';
            link.click();
        }
    };

    const viewDocument = (fileData) => {
        if (!fileData) return;
        
        if (fileData.startsWith('data:')) {
            const byteCharacters = atob(fileData.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const mimeType = fileData.split(',')[0].split(':')[1].split(';')[0];
            const blob = new Blob([byteArray], { type: mimeType });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } else {
            window.open(`http://localhost:5000/${fileData}`, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="candidate-review-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading candidate details...</p>
                </div>
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="candidate-review-error">
                <div className="error-content">
                    <i className="fas fa-user-slash"></i>
                    <h3>Candidate not found</h3>
                    <p>The requested candidate could not be found.</p>
                    <button className="btn btn-primary" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="candidate-review-container">
            {/* Header Section */}
            <div className="candidate-review-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Candidates</span>
                </button>
                <div className="header-title">
                    <h2>Candidate Profile Review</h2>
                    <p>Comprehensive candidate information and documents</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {candidate.profilePicture ? (
                            <img src={candidate.profilePicture} alt={candidate.name} />
                        ) : (
                            <div className="avatar-placeholder">
                                <i className="fas fa-user"></i>
                            </div>
                        )}
                        <div className="status-indicator active"></div>
                    </div>
                    <div className="profile-info">
                        <h3>{candidate.name}</h3>
                        <p className="email">{candidate.email}</p>
                        <div className="profile-stats">
                            <div className="stat">
                                <span className="label">Registered</span>
                                <span className="value">{formatDate(candidate.createdAt)}</span>
                            </div>
                            <div className="stat">
                                <span className="label">Status</span>
                                <span className={`value status ${candidate.hasProfile ? 'complete' : 'incomplete'}`}>
                                    {candidate.hasProfile ? 'Complete' : 'Incomplete'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="tab-navigation">
                <button 
                    className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                >
                    <i className="fas fa-user"></i>
                    Personal Info
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                    onClick={() => setActiveTab('education')}
                >
                    <i className="fas fa-graduation-cap"></i>
                    Education
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                    onClick={() => setActiveTab('skills')}
                >
                    <i className="fas fa-cogs"></i>
                    Skills & Summary
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                    onClick={() => setActiveTab('documents')}
                >
                    <i className="fas fa-file-alt"></i>
                    Documents
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
                    onClick={() => setActiveTab('company')}
                >
                    <i className="fas fa-building"></i>
                    Company Details
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                    <div className="tab-panel personal-info">
                        <div className="info-grid">
                            <div className="info-card">
                                <div className="card-header">
                                    <i className="fas fa-id-card"></i>
                                    <h4>Basic Information</h4>
                                </div>
                                <div className="card-content">
                                    <div className="info-item">
                                        <label>Full Name</label>
                                        <span>{candidate.name}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Email Address</label>
                                        <span>{candidate.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Mobile Number</label>
                                        <span>{candidate.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Date of Birth</label>
                                        <span>{candidate.dateOfBirth ? formatDate(candidate.dateOfBirth) : 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Gender</label>
                                        <span>{candidate.gender || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="card-header">
                                    <i className="fas fa-users"></i>
                                    <h4>Family Information</h4>
                                </div>
                                <div className="card-content">
                                    <div className="info-item">
                                        <label>Father's/Husband's Name</label>
                                        <span>{candidate.fatherName || 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Mother's Name</label>
                                        <span>{candidate.motherName || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card full-width">
                                <div className="card-header">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <h4>Address Information</h4>
                                </div>
                                <div className="card-content">
                                    <div className="info-item">
                                        <label>Residential Address</label>
                                        <span>{candidate.residentialAddress || 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Permanent Address</label>
                                        <span>{candidate.permanentAddress || 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Correspondence Address</label>
                                        <span>{candidate.correspondenceAddress || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                    <div className="tab-panel education-info">
                        <div className="education-timeline">
                            {candidate.education && candidate.education.map((edu, index) => {
                                const levels = ['10th Standard', '12th Standard', 'Degree'];
                                return (
                                    <div key={index} className="education-item">
                                        <div className="education-icon">
                                            <i className="fas fa-graduation-cap"></i>
                                        </div>
                                        <div className="education-content">
                                            <div className="education-header">
                                                <h4>{levels[index] || 'Education'}</h4>
                                                <span className="year">{edu.passYear || 'N/A'}</span>
                                            </div>
                                            <div className="education-details">
                                                {edu.degreeName && (
                                                    <div className="detail-item">
                                                        <label>Degree:</label>
                                                        <span>{edu.degreeName}</span>
                                                    </div>
                                                )}
                                                <div className="detail-item">
                                                    <label>Institution:</label>
                                                    <span>{edu.collegeName || 'Not provided'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Score:</label>
                                                    <span>
                                                        {edu.scoreValue || edu.percentage || 'Not provided'}
                                                        {edu.scoreType === 'percentage' ? '%' : ''}
                                                        {edu.scoreType && edu.scoreType !== 'percentage' ? ` ${edu.scoreType.toUpperCase()}` : ''}
                                                    </span>
                                                </div>
                                                {edu.marksheet && (
                                                    <div className="document-actions">
                                                        <button
                                                            className="action-btn view"
                                                            onClick={() => viewDocument(edu.marksheet)}
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                            View Marksheet
                                                        </button>
                                                        <button
                                                            className="action-btn download"
                                                            onClick={() => downloadDocument(edu.marksheet, `marksheet_${levels[index].replace(' ', '_').toLowerCase()}.pdf`)}
                                                        >
                                                            <i className="fas fa-download"></i>
                                                            Download
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Skills & Summary Tab */}
                {activeTab === 'skills' && (
                    <div className="tab-panel skills-info">
                        {candidate.skills && candidate.skills.length > 0 && (
                            <div className="skills-section">
                                <div className="section-header">
                                    <i className="fas fa-cogs"></i>
                                    <h4>Technical Skills</h4>
                                </div>
                                <div className="skills-grid">
                                    {candidate.skills.map((skill, index) => (
                                        <div key={index} className="skill-tag">
                                            <span>{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {candidate.profileSummary && (
                            <div className="summary-section">
                                <div className="section-header">
                                    <i className="fas fa-user-edit"></i>
                                    <h4>Profile Summary</h4>
                                </div>
                                <div className="summary-content">
                                    <p>{candidate.profileSummary}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <div className="tab-panel documents-info">
                        <div className="documents-grid">
                            {candidate.resume && (
                                <div className="document-card">
                                    <div className="document-icon">
                                        <i className="fas fa-file-pdf"></i>
                                    </div>
                                    <div className="document-info">
                                        <h5>Resume</h5>
                                        <p>Candidate's complete resume</p>
                                    </div>
                                    <div className="document-actions">
                                        <button
                                            className="action-btn primary"
                                            onClick={() => downloadDocument(candidate.resume, 'resume.pdf')}
                                        >
                                            <i className="fas fa-download"></i>
                                            Download
                                        </button>
                                    </div>
                                </div>
                            )}

                            {candidate.education && candidate.education.map((edu, index) => {
                                if (!edu.marksheet) return null;
                                const levels = ['10th Standard', '12th Standard', 'Degree'];
                                return (
                                    <div key={index} className="document-card">
                                        <div className="document-icon">
                                            <i className="fas fa-certificate"></i>
                                        </div>
                                        <div className="document-info">
                                            <h5>{levels[index]} Marksheet</h5>
                                            <p>Academic certificate and marks</p>
                                        </div>
                                        <div className="document-actions">
                                            <button
                                                className="action-btn view"
                                                onClick={() => viewDocument(edu.marksheet)}
                                            >
                                                <i className="fas fa-eye"></i>
                                                View
                                            </button>
                                            <button
                                                className="action-btn download"
                                                onClick={() => downloadDocument(edu.marksheet, `marksheet_${levels[index].replace(' ', '_').toLowerCase()}.pdf`)}
                                            >
                                                <i className="fas fa-download"></i>
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Company Details Tab */}
                {activeTab === 'company' && (
                    <div className="tab-panel company-info">
                        <div className="section-header">
                            <i className="fas fa-building"></i>
                            <h4>Job Applications & Company Details</h4>
                        </div>
                        
                        {candidate.applications && candidate.applications.length > 0 ? (
                            <div className="company-table-container">
                                <table className="company-details-table">
                                    <thead>
                                        <tr>
                                            <th>Company Name</th>
                                            <th>Job Categories</th>
                                            <th>Shortlisted Status</th>
                                            <th>Current Round</th>
                                            <th>Selected</th>
                                            <th>Registered Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidate.applications.map((application, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="company-cell">
                                                        <i className="fas fa-building company-icon"></i>
                                                        <span>{application.companyName || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="job-category">
                                                        {application.jobCategory || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${application.shortlistedStatus ? 'shortlisted' : 'pending'}`}>
                                                        {application.shortlistedStatus ? 'Shortlisted' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="round-info">
                                                        {application.currentRound || 'Initial'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${application.selected ? 'selected' : 'not-selected'}`}>
                                                        {application.selected ? 'Selected' : 'Not Selected'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="date-info">
                                                        {formatDate(application.appliedDate || application.createdAt)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="no-applications">
                                <div className="no-data-content">
                                    <i className="fas fa-briefcase"></i>
                                    <h5>No Job Applications Found</h5>
                                    <p>This candidate hasn't applied to any jobs yet.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminCandidateReviewPage;