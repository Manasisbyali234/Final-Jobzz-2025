import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EmployerDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployerProfile();
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

    if (loading) return <div className="p-3">Loading...</div>;
    if (!profile) return <div className="p-3">Employer profile not found</div>;

    return (
        <div className="panel panel-default site-bg-white p-3">
            <div className="panel-body">
                <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h4>Employer Profile Details</h4>
                
                <div className="row">
                    <div className="col-lg-6">
                        <div className="mt-2"><h6>Company Name</h6><p>{profile.companyName || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Contact Full Name</h6><p>{profile.contactFullName || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Email</h6><p>{profile.email || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Phone</h6><p>{profile.phone || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Official Email</h6><p>{profile.officialEmail || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Official Mobile</h6><p>{profile.officialMobile || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Alternate Contact</h6><p>{profile.alternateContact || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Contact Designation</h6><p>{profile.contactDesignation || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Contact Mobile</h6><p>{profile.contactMobile || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Website</h6><p>{profile.website || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Established Since</h6><p>{profile.establishedSince || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Team Size</h6><p>{profile.teamSize || 'N/A'}</p></div>
                    </div>
                    
                    <div className="col-lg-6">
                        <div className="mt-2"><h6>Employer Category</h6><p>{profile.employerCategory || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Company Type</h6><p>{profile.companyType || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Industry Sector</h6><p>{profile.industrySector || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Corporate Address</h6><p>{profile.corporateAddress || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Branch Locations</h6><p>{profile.branchLocations || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Legal Entity Code</h6><p>{profile.legalEntityCode || 'N/A'}</p></div>
                        <div className="mt-2"><h6>CIN</h6><p>{profile.cin || 'N/A'}</p></div>
                        <div className="mt-2"><h6>GST Number</h6><p>{profile.gstNumber || 'N/A'}</p></div>
                        <div className="mt-2"><h6>PAN Number</h6><p>{profile.panNumber || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Logo</h6><p>{profile.logo || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Cover Image</h6><p>{profile.coverImage || 'N/A'}</p></div>
                        <div className="mt-2"><h6>Created At</h6><p>{formatDate(profile.createdAt)}</p></div>
                    </div>
                </div>

                <div className="mt-3">
                    <h6>Description</h6>
                    <p>{profile.description || 'N/A'}</p>
                </div>

                <div className="mt-4">
                    <h5>Uploaded Documents</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Document Type</th>
                                    <th>Upload Status</th>
                                    <th>Verification Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>PAN Card Image</td>
                                    <td>{profile.panCardImage ? <span className="badge bg-success">Uploaded</span> : <span className="badge bg-warning">Not Uploaded</span>}</td>
                                    <td>
                                        <span className={`badge ${profile.panCardVerified === 'approved' ? 'bg-success' : profile.panCardVerified === 'rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                                            {profile.panCardVerified === 'approved' ? 'Approved' : profile.panCardVerified === 'rejected' ? 'Rejected' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {profile.panCardImage && (
                                            <>
                                                <button className="btn btn-sm btn-primary me-1" onClick={() => downloadDocument(id, 'panCardImage')}>Download</button>
                                                <button className="btn btn-sm btn-success me-1" onClick={() => updateDocumentStatus(id, 'panCardVerified', 'approved')}>Approve</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => updateDocumentStatus(id, 'panCardVerified', 'rejected')}>Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>CIN Document</td>
                                    <td>{profile.cinImage ? <span className="badge bg-success">Uploaded</span> : <span className="badge bg-warning">Not Uploaded</span>}</td>
                                    <td>
                                        <span className={`badge ${profile.cinVerified === 'approved' ? 'bg-success' : profile.cinVerified === 'rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                                            {profile.cinVerified === 'approved' ? 'Approved' : profile.cinVerified === 'rejected' ? 'Rejected' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {profile.cinImage && (
                                            <>
                                                <button className="btn btn-sm btn-primary me-1" onClick={() => downloadDocument(id, 'cinImage')}>Download</button>
                                                <button className="btn btn-sm btn-success me-1" onClick={() => updateDocumentStatus(id, 'cinVerified', 'approved')}>Approve</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => updateDocumentStatus(id, 'cinVerified', 'rejected')}>Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>GST Certificate</td>
                                    <td>{profile.gstImage ? <span className="badge bg-success">Uploaded</span> : <span className="badge bg-warning">Not Uploaded</span>}</td>
                                    <td>
                                        <span className={`badge ${profile.gstVerified === 'approved' ? 'bg-success' : profile.gstVerified === 'rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                                            {profile.gstVerified === 'approved' ? 'Approved' : profile.gstVerified === 'rejected' ? 'Rejected' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {profile.gstImage && (
                                            <>
                                                <button className="btn btn-sm btn-primary me-1" onClick={() => downloadDocument(id, 'gstImage')}>Download</button>
                                                <button className="btn btn-sm btn-success me-1" onClick={() => updateDocumentStatus(id, 'gstVerified', 'approved')}>Approve</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => updateDocumentStatus(id, 'gstVerified', 'rejected')}>Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Certificate of Incorporation</td>
                                    <td>{profile.certificateOfIncorporation ? <span className="badge bg-success">Uploaded</span> : <span className="badge bg-warning">Not Uploaded</span>}</td>
                                    <td>
                                        <span className={`badge ${profile.incorporationVerified === 'approved' ? 'bg-success' : profile.incorporationVerified === 'rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                                            {profile.incorporationVerified === 'approved' ? 'Approved' : profile.incorporationVerified === 'rejected' ? 'Rejected' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {profile.certificateOfIncorporation && (
                                            <>
                                                <button className="btn btn-sm btn-primary me-1" onClick={() => downloadDocument(id, 'certificateOfIncorporation')}>Download</button>
                                                <button className="btn btn-sm btn-success me-1" onClick={() => updateDocumentStatus(id, 'incorporationVerified', 'approved')}>Approve</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => updateDocumentStatus(id, 'incorporationVerified', 'rejected')}>Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Authorization Letter</td>
                                    <td>{profile.authorizationLetter ? <span className="badge bg-success">Uploaded</span> : <span className="badge bg-warning">Not Uploaded</span>}</td>
                                    <td>
                                        <span className={`badge ${profile.authorizationVerified === 'approved' ? 'bg-success' : profile.authorizationVerified === 'rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                                            {profile.authorizationVerified === 'approved' ? 'Approved' : profile.authorizationVerified === 'rejected' ? 'Rejected' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {profile.authorizationLetter && (
                                            <>
                                                <button className="btn btn-sm btn-primary me-1" onClick={() => downloadDocument(id, 'authorizationLetter')}>Download</button>
                                                <button className="btn btn-sm btn-success me-1" onClick={() => updateDocumentStatus(id, 'authorizationVerified', 'approved')}>Approve</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => updateDocumentStatus(id, 'authorizationVerified', 'rejected')}>Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployerDetails;