import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './employer-details-styles.css';

function EmployerDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [jobCount, setJobCount] = useState(0);
    const [jobsLoading, setJobsLoading] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true
        });
        fetchEmployerProfile();
        fetchEmployerJobs();
    }, [id]);

    const fetchEmployerProfile = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/admin/employer-profile/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                console.log('Profile data:', data.profile);
                // Set default verification status for existing profiles
                const profileWithDefaults = {
                    ...data.profile,
                    panCardVerified: data.profile.panCardVerified || 'pending',
                    cinVerified: data.profile.cinVerified || 'pending',
                    gstVerified: data.profile.gstVerified || 'pending',
                    incorporationVerified: data.profile.incorporationVerified || 'pending',
                    authorizationVerified: data.profile.authorizationVerified || 'pending'
                };
                console.log('Profile with defaults:', profileWithDefaults);
                setProfile(profileWithDefaults);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString() : 'N/A';
    };

    const downloadDocument = async (employerId, documentType) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/admin/download-document/${employerId}/${documentType}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${documentType}_${employerId}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Failed to download document');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Error downloading document');
        }
    };

    const fetchEmployerJobs = async () => {
        try {
            setJobsLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/admin/employer-jobs/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setJobCount(data.jobCount);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setJobsLoading(false);
        }
    };

    const updateDocumentStatus = async (employerId, field, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/admin/employer-profile/${employerId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [field]: status })
            });
            
            if (response.ok) {
                setProfile(prev => ({ ...prev, [field]: status }));
                alert(`Document ${status} successfully`);
            } else {
                alert('Failed to update document status');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Error updating document status');
        }
    };

    if (loading) {
        return (
            <div className="employer-details-container">
                <div className="loading-container" data-aos="fade-up">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading employer details...</div>
                </div>
            </div>
        );
    }
    
    if (!profile) {
        return (
            <div className="employer-details-container">
                <div className="not-found-container" data-aos="fade-up">
                    <i className="fa fa-exclamation-triangle not-found-icon"></i>
                    <h3>Employer Profile Not Found</h3>
                    <p>The requested employer profile could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="employer-details-container">
            <div className="employer-details-header" data-aos="fade-down">
                <h2>
                    <i className="fa fa-building me-3"></i>
                    Employer Profile Details
                </h2>
                <p className="employer-details-subtitle mb-0">
                    <i className="fa fa-info-circle me-2"></i>
                    Complete employer information and document verification
                </p>
            </div>
            
            <button className="back-button" onClick={() => navigate(-1)} data-aos="fade-right">
                <i className="fa fa-arrow-left"></i>
                Back to Management
            </button>
            
            <div className="profile-info-card" data-aos="fade-up" data-aos-delay="100">
                <h4 className="profile-section-title">
                    <i className="fa fa-user-tie"></i>
                    Company Information
                </h4>
                
                <div className="row">
                    <div className="col-lg-6">
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="200">
                            <h6><i className="fa fa-building"></i>Company Name</h6>
                            <p>{profile.companyName || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="250">
                            <h6><i className="fa fa-user"></i>Contact Full Name</h6>
                            <p>{profile.contactFullName || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="300">
                            <h6><i className="fa fa-envelope"></i>Email</h6>
                            <p>{profile.email || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="350">
                            <h6><i className="fa fa-phone"></i>Phone</h6>
                            <p>{profile.phone || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="400">
                            <h6><i className="fa fa-envelope-open"></i>Official Email</h6>
                            <p>{profile.officialEmail || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="450">
                            <h6><i className="fa fa-mobile-alt"></i>Official Mobile</h6>
                            <p>{profile.officialMobile || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="500">
                            <h6><i className="fa fa-phone-alt"></i>Alternate Contact</h6>
                            <p>{profile.alternateContact || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="550">
                            <h6><i className="fa fa-id-badge"></i>Contact Designation</h6>
                            <p>{profile.contactDesignation || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="600">
                            <h6><i className="fa fa-mobile"></i>Contact Mobile</h6>
                            <p>{profile.contactMobile || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="650">
                            <h6><i className="fa fa-globe"></i>Website</h6>
                            <p>{profile.website || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="700">
                            <h6><i className="fa fa-calendar"></i>Established Since</h6>
                            <p>{profile.establishedSince || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-right" data-aos-delay="750">
                            <h6><i className="fa fa-users"></i>Team Size</h6>
                            <p>{profile.teamSize || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div className="col-lg-6">
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="200">
                            <h6><i className="fa fa-tag"></i>Employer Category</h6>
                            <p>{profile.employerCategory || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="250">
                            <h6><i className="fa fa-industry"></i>Company Type</h6>
                            <p>{profile.companyType || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="300">
                            <h6><i className="fa fa-cogs"></i>Industry Sector</h6>
                            <p>{profile.industrySector || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="350">
                            <h6><i className="fa fa-map-marker-alt"></i>Corporate Address</h6>
                            <p>{profile.corporateAddress || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="400">
                            <h6><i className="fa fa-map-marked"></i>Branch Locations</h6>
                            <p>{profile.branchLocations || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="450">
                            <h6><i className="fa fa-code"></i>Legal Entity Code</h6>
                            <p>{profile.legalEntityCode || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="500">
                            <h6><i className="fa fa-certificate"></i>CIN</h6>
                            <p>{profile.cin || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="550">
                            <h6><i className="fa fa-receipt"></i>GST Number</h6>
                            <p>{profile.gstNumber || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="600">
                            <h6><i className="fa fa-id-card"></i>PAN Number</h6>
                            <p>{profile.panNumber || 'N/A'}</p>
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="650">
                            <h6><i className="fa fa-image"></i>Logo</h6>
                            {profile.logo ? (
                                <button 
                                    className="action-btn btn-view-image"
                                    onClick={() => {
                                        const imageUrl = profile.logo.startsWith('data:') ? profile.logo : `data:image/jpeg;base64,${profile.logo}`;
                                        setCurrentImage(imageUrl);
                                        setShowImageModal(true);
                                    }}
                                >
                                    <i className="fa fa-eye"></i>
                                    View Image
                                </button>
                            ) : (
                                <p>N/A</p>
                            )}
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="700">
                            <h6><i className="fa fa-images"></i>Cover Image</h6>
                            {profile.coverImage ? (
                                <button 
                                    className="action-btn btn-view-image"
                                    onClick={() => {
                                        const imageUrl = profile.coverImage.startsWith('data:') ? profile.coverImage : `data:image/jpeg;base64,${profile.coverImage}`;
                                        setCurrentImage(imageUrl);
                                        setShowImageModal(true);
                                    }}
                                >
                                    <i className="fa fa-eye"></i>
                                    View Image
                                </button>
                            ) : (
                                <p>N/A</p>
                            )}
                        </div>
                        <div className="profile-field" data-aos="fade-left" data-aos-delay="750">
                            <h6><i className="fa fa-clock"></i>Created At</h6>
                            <p>{formatDate(profile.createdAt)}</p>
                        </div>
                    </div>
                </div>

                <div className="description-section" data-aos="fade-up" data-aos-delay="800">
                    <h6><i className="fa fa-align-left"></i>Company Description</h6>
                    <p className="description-text">{profile.description || 'No description provided'}</p>
                </div>
            </div>

            <div className="documents-section" data-aos="fade-up" data-aos-delay="300">
                <h4 className="profile-section-title">
                    <i className="fa fa-file-alt"></i>
                    Document Verification
                </h4>
                <div className="table-responsive">
                    <table className="table documents-table">
                        <thead>
                            <tr>
                                <th><i className="fa fa-file me-2"></i>Document Type</th>
                                <th><i className="fa fa-upload me-2"></i>Upload Status</th>
                                <th><i className="fa fa-check-circle me-2"></i>Verification Status</th>
                                <th><i className="fa fa-cogs me-2"></i>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr data-aos="fade-left" data-aos-delay="400">
                                <td><i className="fa fa-id-card me-2 text-muted"></i>PAN Card Image</td>
                                <td>
                                    {profile.panCardImage ? 
                                        <span className="status-badge badge-uploaded"><i className="fa fa-check"></i>Uploaded</span> : 
                                        <span className="status-badge badge-not-uploaded"><i className="fa fa-times"></i>Not Uploaded</span>
                                    }
                                </td>
                                <td>
                                    <span className={`status-badge ${
                                        profile.panCardVerified === 'approved' ? 'badge-approved' : 
                                        profile.panCardVerified === 'rejected' ? 'badge-rejected' : 'badge-pending'
                                    }`}>
                                        <i className={`fa ${
                                            profile.panCardVerified === 'approved' ? 'fa-check' :
                                            profile.panCardVerified === 'rejected' ? 'fa-times' : 'fa-clock'
                                        }`}></i>
                                        {profile.panCardVerified === 'approved' ? 'Approved' : profile.panCardVerified === 'rejected' ? 'Rejected' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    {profile.panCardImage && (
                                        <div className="action-buttons-container">
                                            <button className="action-btn btn-download" onClick={() => downloadDocument(id, 'panCardImage')}>
                                                <i className="fa fa-download"></i>Download
                                            </button>
                                            <button className="action-btn btn-approve" onClick={() => updateDocumentStatus(id, 'panCardVerified', 'approved')}>
                                                <i className="fa fa-check"></i>Approve
                                            </button>
                                            <button className="action-btn btn-reject" onClick={() => updateDocumentStatus(id, 'panCardVerified', 'rejected')}>
                                                <i className="fa fa-times"></i>Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <tr data-aos="fade-left" data-aos-delay="450">
                                <td><i className="fa fa-certificate me-2 text-muted"></i>CIN Document</td>
                                <td>
                                    {profile.cinImage ? 
                                        <span className="status-badge badge-uploaded"><i className="fa fa-check"></i>Uploaded</span> : 
                                        <span className="status-badge badge-not-uploaded"><i className="fa fa-times"></i>Not Uploaded</span>
                                    }
                                </td>
                                <td>
                                    <span className={`status-badge ${
                                        profile.cinVerified === 'approved' ? 'badge-approved' : 
                                        profile.cinVerified === 'rejected' ? 'badge-rejected' : 'badge-pending'
                                    }`}>
                                        <i className={`fa ${
                                            profile.cinVerified === 'approved' ? 'fa-check' :
                                            profile.cinVerified === 'rejected' ? 'fa-times' : 'fa-clock'
                                        }`}></i>
                                        {profile.cinVerified === 'approved' ? 'Approved' : profile.cinVerified === 'rejected' ? 'Rejected' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    {profile.cinImage && (
                                        <div className="action-buttons-container">
                                            <button className="action-btn btn-download" onClick={() => downloadDocument(id, 'cinImage')}>
                                                <i className="fa fa-download"></i>Download
                                            </button>
                                            <button className="action-btn btn-approve" onClick={() => updateDocumentStatus(id, 'cinVerified', 'approved')}>
                                                <i className="fa fa-check"></i>Approve
                                            </button>
                                            <button className="action-btn btn-reject" onClick={() => updateDocumentStatus(id, 'cinVerified', 'rejected')}>
                                                <i className="fa fa-times"></i>Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <tr data-aos="fade-left" data-aos-delay="500">
                                <td><i className="fa fa-receipt me-2 text-muted"></i>GST Certificate</td>
                                <td>
                                    {profile.gstImage ? 
                                        <span className="status-badge badge-uploaded"><i className="fa fa-check"></i>Uploaded</span> : 
                                        <span className="status-badge badge-not-uploaded"><i className="fa fa-times"></i>Not Uploaded</span>
                                    }
                                </td>
                                <td>
                                    <span className={`status-badge ${
                                        profile.gstVerified === 'approved' ? 'badge-approved' : 
                                        profile.gstVerified === 'rejected' ? 'badge-rejected' : 'badge-pending'
                                    }`}>
                                        <i className={`fa ${
                                            profile.gstVerified === 'approved' ? 'fa-check' :
                                            profile.gstVerified === 'rejected' ? 'fa-times' : 'fa-clock'
                                        }`}></i>
                                        {profile.gstVerified === 'approved' ? 'Approved' : profile.gstVerified === 'rejected' ? 'Rejected' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    {profile.gstImage && (
                                        <div className="action-buttons-container">
                                            <button className="action-btn btn-download" onClick={() => downloadDocument(id, 'gstImage')}>
                                                <i className="fa fa-download"></i>Download
                                            </button>
                                            <button className="action-btn btn-approve" onClick={() => updateDocumentStatus(id, 'gstVerified', 'approved')}>
                                                <i className="fa fa-check"></i>Approve
                                            </button>
                                            <button className="action-btn btn-reject" onClick={() => updateDocumentStatus(id, 'gstVerified', 'rejected')}>
                                                <i className="fa fa-times"></i>Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <tr data-aos="fade-left" data-aos-delay="550">
                                <td><i className="fa fa-file-contract me-2 text-muted"></i>Certificate of Incorporation</td>
                                <td>
                                    {profile.certificateOfIncorporation ? 
                                        <span className="status-badge badge-uploaded"><i className="fa fa-check"></i>Uploaded</span> : 
                                        <span className="status-badge badge-not-uploaded"><i className="fa fa-times"></i>Not Uploaded</span>
                                    }
                                </td>
                                <td>
                                    <span className={`status-badge ${
                                        profile.incorporationVerified === 'approved' ? 'badge-approved' : 
                                        profile.incorporationVerified === 'rejected' ? 'badge-rejected' : 'badge-pending'
                                    }`}>
                                        <i className={`fa ${
                                            profile.incorporationVerified === 'approved' ? 'fa-check' :
                                            profile.incorporationVerified === 'rejected' ? 'fa-times' : 'fa-clock'
                                        }`}></i>
                                        {profile.incorporationVerified === 'approved' ? 'Approved' : profile.incorporationVerified === 'rejected' ? 'Rejected' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    {profile.certificateOfIncorporation && (
                                        <div className="action-buttons-container">
                                            <button className="action-btn btn-download" onClick={() => downloadDocument(id, 'certificateOfIncorporation')}>
                                                <i className="fa fa-download"></i>Download
                                            </button>
                                            <button className="action-btn btn-approve" onClick={() => updateDocumentStatus(id, 'incorporationVerified', 'approved')}>
                                                <i className="fa fa-check"></i>Approve
                                            </button>
                                            <button className="action-btn btn-reject" onClick={() => updateDocumentStatus(id, 'incorporationVerified', 'rejected')}>
                                                <i className="fa fa-times"></i>Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <tr data-aos="fade-left" data-aos-delay="600">
                                <td><i className="fa fa-file-signature me-2 text-muted"></i>Authorization Letter (Legacy)</td>
                                <td>
                                    {profile.authorizationLetter ? 
                                        <span className="status-badge badge-uploaded"><i className="fa fa-check"></i>Uploaded</span> : 
                                        <span className="status-badge badge-not-uploaded"><i className="fa fa-times"></i>Not Uploaded</span>
                                    }
                                </td>
                                <td>
                                    <span className={`status-badge ${
                                        profile.authorizationVerified === 'approved' ? 'badge-approved' : 
                                        profile.authorizationVerified === 'rejected' ? 'badge-rejected' : 'badge-pending'
                                    }`}>
                                        <i className={`fa ${
                                            profile.authorizationVerified === 'approved' ? 'fa-check' :
                                            profile.authorizationVerified === 'rejected' ? 'fa-times' : 'fa-clock'
                                        }`}></i>
                                        {profile.authorizationVerified === 'approved' ? 'Approved' : profile.authorizationVerified === 'rejected' ? 'Rejected' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    {profile.authorizationLetter && (
                                        <div className="action-buttons-container">
                                            <button className="action-btn btn-download" onClick={() => downloadDocument(id, 'authorizationLetter')}>
                                                <i className="fa fa-download"></i>Download
                                            </button>
                                            <button className="action-btn btn-approve" onClick={() => updateDocumentStatus(id, 'authorizationVerified', 'approved')}>
                                                <i className="fa fa-check"></i>Approve
                                            </button>
                                            <button className="action-btn btn-reject" onClick={() => updateDocumentStatus(id, 'authorizationVerified', 'rejected')}>
                                                <i className="fa fa-times"></i>Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Posted Jobs Section */}
            <div className="documents-section" data-aos="fade-up" data-aos-delay="350">
                <h4 className="profile-section-title">
                    <i className="fa fa-briefcase"></i>
                    Posted Jobs
                </h4>
                <div className="job-count-container">
                    <div className="job-count-card">
                        <div className="job-count-info">
                            <div className="job-count-number">
                                {jobsLoading ? (
                                    <div className="loading-spinner-small"></div>
                                ) : (
                                    <span className="count-value">{jobCount}</span>
                                )}
                            </div>
                            <div className="job-count-label">
                                <i className="fa fa-briefcase me-2"></i>
                                Total Jobs Posted
                            </div>
                        </div>
                        <div className="job-count-actions">
                            <button 
                                className="action-btn btn-view-details"
                                onClick={() => navigate(`/emp-detail/${profile.employerId._id}`)}
                            >
                                <i className="fa fa-eye"></i>
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Multiple Authorization Letters Section */}
            {profile.authorizationLetters && profile.authorizationLetters.length > 0 && (
                <div className="documents-section" data-aos="fade-up" data-aos-delay="400">
                    <h4 className="profile-section-title">
                        <i className="fa fa-file-signature"></i>
                        Authorization Letters
                    </h4>
                    <div className="table-responsive">
                        <table className="table documents-table">
                            <thead>
                                <tr>
                                    <th><i className="fa fa-file me-2"></i>File Name</th>
                                    <th><i className="fa fa-calendar me-2"></i>Upload Date</th>
                                    <th><i className="fa fa-cogs me-2"></i>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profile.authorizationLetters.map((doc, index) => (
                                    <tr key={doc._id || index} data-aos="fade-left" data-aos-delay={500 + (index * 50)}>                                        <td><i className="fa fa-file-alt me-2 text-muted"></i>{doc.fileName}</td>
                                        <td><i className="fa fa-clock me-2 text-muted"></i>{formatDate(doc.uploadedAt)}</td>
                                        <td>
                                            <div className="action-buttons-container">
                                                <button 
                                                    className="action-btn btn-download" 
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = doc.fileData;
                                                        link.download = doc.fileName;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                >
                                                    <i className="fa fa-download"></i>
                                                    Download
                                                </button>
                                                {doc.fileData.startsWith('data:image') && (
                                                    <button 
                                                        className="action-btn btn-view-image"
                                                        onClick={() => {
                                                            setCurrentImage(doc.fileData);
                                                            setShowImageModal(true);
                                                        }}
                                                    >
                                                        <i className="fa fa-eye"></i>
                                                        View
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Image Modal */}
            {showImageModal && (
                <div className="image-modal" onClick={() => setShowImageModal(false)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="image-modal-header">
                            <h5 className="image-modal-title">
                                <i className="fa fa-image me-2"></i>
                                Image Preview
                            </h5>
                            <button className="modal-close-btn" onClick={() => setShowImageModal(false)}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="text-center">
                            <img src={currentImage} alt="Preview" className="modal-image" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployerDetails;