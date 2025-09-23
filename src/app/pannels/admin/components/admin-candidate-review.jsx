import { useEffect, useState } from "react";
import JobZImage from "../../../common/jobz-img";
import { useNavigate, useParams } from "react-router-dom";

function AdminCandidateReviewPage() {
    const navigate = useNavigate();
    const { candidateId } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

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
        return <div className="text-center p-4">Loading candidate details...</div>;
    }

    if (!candidate) {
        return <div className="text-center p-4">Candidate not found</div>;
    }

    return (
        <>
            <div className="panel panel-default site-bg-white p-3">
                <div className="panel-heading d-flex justify-content-between align-items-center">
                    <h4 className="panel-tittle">
                        <i className="far fa-user-circle" /> Candidate Details
                    </h4>
                </div>

                <div className="panel-body">
                    <button
                        className="btn btn-outline-secondary mb-3"
                        onClick={() => navigate(-1)}
                    >
                        ← Back to Candidates List
                    </button>

                    <div className="border rounded p-4 shadow-sm">
                        <div className="row">
                            <div className="col-lg-6 col-12">
                                <div
                                    className="twm-media-pic rounded-circle overflow-hidden"
                                    style={{ width: "50px", height: "50px" }}
                                >
                                    {candidate.profilePicture ? (
                                        <img
                                            src={candidate.profilePicture}
                                            alt={candidate.name}
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <JobZImage
                                            src="images/candidates/pic1.jpg"
                                            alt={candidate.name}
                                        />
                                    )}
                                </div>

                                <div className="mt-2">
                                    <h5 className="mb-1">Full Name</h5>
                                    <p className="mb-0 text-muted">{candidate.name}</p>
                                </div>

                                <div className="mt-2">
                                    <h5 className="mb-1">Email</h5>
                                    <p className="mb-0 text-muted">{candidate.email}</p>
                                </div>

                                <div className="mt-2">
                                    <h5 className="mb-1">Mobile No.</h5>
                                    <p className="mb-0 text-muted">{candidate.phone || 'Not provided'}</p>
                                </div>

                                <div className="mt-2">
                                    <h5 className="mb-1">Father's / Husband's Name</h5>
                                    <p className="mb-0 text-muted">{candidate.fatherName || 'Not provided'}</p>
                                </div>

                                <div className="mt-2">
                                    <h5 className="mb-1">Residential Address</h5>
                                    <p className="mb-0 text-muted">{candidate.residentialAddress || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="mt-2">
                                    <h5 className="mb-1">Date of Birth</h5>
                                    <p className="mb-0 text-muted">{candidate.dateOfBirth ? formatDate(candidate.dateOfBirth) : 'Not provided'}</p>
                                </div>

                                <div className="mt-2">
                                    <h5 className="mb-1">Gender</h5>
                                    <p className="mb-0 text-muted">{candidate.gender || 'Not provided'}</p>
                                </div>

                                <div className="mt-2">
                                    <h5 className="mb-1">Mother's Name</h5>
                                    <p className="mb-0 text-muted">{candidate.motherName || 'Not provided'}</p>
                                </div>

                                <div className="mt-2">
                                    <h5 className="mb-1">Permanent Address</h5>
                                    <p className="mb-0 text-muted">{candidate.permanentAddress || 'Not provided'}</p>
                                </div>

                                <div className="mt-2">
                                    <h5 className="mb-1">Correspondence Address</h5>
                                    <p className="mb-0 text-muted">{candidate.correspondenceAddress || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                       
                        <hr />

                        <div className="row">
                            {candidate.education && candidate.education[0] && (
                                <div className="col-lg-6 col-12">
                                    <div className="mt-2">
                                        <h5 className="mb-1">10th Educational Details</h5>
                                        <h6>School Name <p className="mb-0 text-muted">{candidate.education[0].collegeName || 'Not provided'}</p></h6>
                                        <h6>Passout Year <p className="mb-0 text-muted">{candidate.education[0].passYear || 'Not provided'}</p></h6>
                                        <h6>{candidate.education[0].scoreType?.toUpperCase() || 'Score'} <p className="mb-0 text-muted">{candidate.education[0].scoreValue || candidate.education[0].percentage || 'Not provided'}{candidate.education[0].scoreType === 'percentage' ? '%' : ''}</p></h6>
                                        {candidate.education[0].marksheet && (
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => viewDocument(candidate.education[0].marksheet)}
                                                >
                                                    <i className="fa fa-eye me-1" />View Marksheet
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => downloadDocument(candidate.education[0].marksheet, 'marksheet_10th.pdf')}
                                                >
                                                    <i className="fa fa-download me-1" />Download
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {candidate.education && candidate.education[1] && (
                                <div className="col-lg-6 col-12">
                                    <div className="mt-2">
                                        <h5 className="mb-1">12th Educational Details</h5>
                                        <h6>School Name <p className="mb-0 text-muted">{candidate.education[1].collegeName || 'Not provided'}</p></h6>
                                        <h6>Passout Year <p className="mb-0 text-muted">{candidate.education[1].passYear || 'Not provided'}</p></h6>
                                        <h6>{candidate.education[1].scoreType?.toUpperCase() || 'Score'} <p className="mb-0 text-muted">{candidate.education[1].scoreValue || candidate.education[1].percentage || 'Not provided'}{candidate.education[1].scoreType === 'percentage' ? '%' : ''}</p></h6>
                                        {candidate.education[1].marksheet && (
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => viewDocument(candidate.education[1].marksheet)}
                                                >
                                                    <i className="fa fa-eye me-1" />View Marksheet
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => downloadDocument(candidate.education[1].marksheet, 'marksheet_12th.pdf')}
                                                >
                                                    <i className="fa fa-download me-1" />Download
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {candidate.education && candidate.education[2] && (
                                <div className="col-lg-6 col-12">
                                    <div className="mt-2">
                                        <h5 className="mb-1">Degree Educational Details</h5>
                                        <h6>Degree Name <p className="mb-0 text-muted">{candidate.education[2].degreeName || 'Not provided'}</p></h6>
                                        <h6>School Name <p className="mb-0 text-muted">{candidate.education[2].collegeName || 'Not provided'}</p></h6>
                                        <h6>Passout Year <p className="mb-0 text-muted">{candidate.education[2].passYear || 'Not provided'}</p></h6>
                                        <h6>{candidate.education[2].scoreType?.toUpperCase() || 'Score'} <p className="mb-0 text-muted">{candidate.education[2].scoreValue || candidate.education[2].percentage || 'Not provided'}{candidate.education[2].scoreType === 'percentage' ? '%' : ''}</p></h6>
                                        {candidate.education[2].marksheet && (
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => viewDocument(candidate.education[2].marksheet)}
                                                >
                                                    <i className="fa fa-eye me-1" />View Marksheet
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => downloadDocument(candidate.education[2].marksheet, 'marksheet_degree.pdf')}
                                                >
                                                    <i className="fa fa-download me-1" />Download
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {candidate.skills && candidate.skills.length > 0 && (
                            <>
                                <hr />
                                <h5 className="mb-3">Key Skills</h5>
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {candidate.skills.map((skill, index) => (
                                        <span key={index} className="badge bg-secondary">{skill}</span>
                                    ))}
                                </div>
                            </>
                        )}

                        {candidate.profileSummary && (
                            <>
                                <hr />
                                <h5 className="mb-3">Profile Summary</h5>
                                <p className="text-muted">{candidate.profileSummary}</p>
                            </>
                        )}

                        {candidate.resume && (
                            <>
                                <hr />
                                <h5 className="mb-3">Resume</h5>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => downloadDocument(candidate.resume, 'resume.pdf')}
                                >
                                    <i className="fa fa-download me-1" />Download Resume
                                </button>
                            </>
                        )}

                        <hr />
                        <div className="mt-3">
                            <h6>Registration Details</h6>
                            <p><strong>Registered on:</strong> {formatDate(candidate.createdAt)}</p>
                            <p><strong>Profile Status:</strong> {candidate.hasProfile ? 'Completed' : 'Incomplete'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminCandidateReviewPage;