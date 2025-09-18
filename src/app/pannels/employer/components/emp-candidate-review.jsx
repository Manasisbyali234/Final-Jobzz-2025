import { useEffect, useState } from "react";
import JobZImage from "../../../common/jobz-img";
import { loadScript } from "../../../../globals/constants";
import { NavLink, useNavigate, useParams } from "react-router-dom";

function EmpCandidateReviewPage () {
	const navigate = useNavigate();
	const { applicationId } = useParams();
	const [application, setApplication] = useState(null);
	const [candidate, setCandidate] = useState(null);
	const [loading, setLoading] = useState(true);
	const [interviewRounds, setInterviewRounds] = useState([]);
	const [remarks, setRemarks] = useState('');
	const [isSelected, setIsSelected] = useState(false);

	useEffect(() => {
		loadScript("js/custom.js");
		fetchApplicationDetails();
	}, [applicationId]);

	const fetchApplicationDetails = async () => {
		try {
			const token = localStorage.getItem('employerToken');
			if (!token) return;

			const response = await fetch(`http://localhost:5000/api/employer/applications/${applicationId}`, {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			
			if (response.ok) {
				const data = await response.json();
				setApplication(data.application);
				setCandidate(data.application.candidateId);
				
				// Load existing review data if available
				if (data.application.interviewRounds) {
					setInterviewRounds(data.application.interviewRounds);
				}
				if (data.application.employerRemarks) {
					setRemarks(data.application.employerRemarks);
				}
				if (data.application.isSelectedForProcess) {
					setIsSelected(data.application.isSelectedForProcess);
				}
				
				// Initialize interview rounds
				const job = data.application.jobId;
				console.log('Full application data:', data.application);
				console.log('Job data:', job);
				
				let roundsCount = 1; // Default to 1 round
				if (job && job.interviewRoundsCount) {
					roundsCount = job.interviewRoundsCount;
				}
				
				console.log('Interview rounds count:', roundsCount);
				
				const rounds = [];
				const roundNames = [];
				
				// Get actual round names from job data
				console.log('interviewRoundTypes:', job?.interviewRoundTypes);
				if (job && job.interviewRoundTypes) {
					if (job.interviewRoundTypes.technical) roundNames.push('Technical Round');
					if (job.interviewRoundTypes.managerial) roundNames.push('Managerial Round');
					if (job.interviewRoundTypes.nonTechnical) roundNames.push('Non-Technical Round');
					if (job.interviewRoundTypes.hr) roundNames.push('HR Round');
					if (job.interviewRoundTypes.final) roundNames.push('Final Round');
				}
				console.log('Round names found:', roundNames);
				
				// If no specific round types, use common round names as fallback
				if (roundNames.length === 0) {
					const defaultRounds = ['Technical Round', 'HR Round', 'Final Round', 'Managerial Round', 'Non-Technical Round'];
					for (let i = 0; i < roundsCount; i++) {
						roundNames.push(defaultRounds[i] || `Round ${i + 1}`);
					}
				}
				
				// Create rounds with actual names
				for (let i = 0; i < Math.min(roundsCount, roundNames.length); i++) {
					rounds.push({ round: i + 1, name: roundNames[i], status: 'pending', feedback: '' });
				}
				
				setInterviewRounds(rounds);
				console.log('Interview rounds set:', rounds);
			}
		} catch (error) {
			console.error('Error fetching application details:', error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadge = (status) => {
		switch (status) {
			case 'pending': return 'twm-bg-yellow';
			case 'shortlisted': return 'twm-bg-purple';
			case 'interviewed': return 'twm-bg-orange';
			case 'hired': return 'twm-bg-green';
			case 'rejected': return 'twm-bg-red';
			default: return 'twm-bg-light-blue';
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric'
		});
	};

	const saveReview = async () => {
		try {
			const token = localStorage.getItem('employerToken');
			const response = await fetch(`http://localhost:5000/api/employer/applications/${applicationId}/review`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					interviewRounds,
					remarks,
					isSelected
				})
			});
			
			if (response.ok) {
				alert('Interview review saved successfully!');
			} else {
				alert('Failed to save review');
			}
		} catch (error) {
			console.error('Error saving review:', error);
			alert('Error saving review');
		}
	};

	const shortlistCandidate = async () => {
		try {
			const token = localStorage.getItem('employerToken');
			const response = await fetch(`http://localhost:5000/api/employer/applications/${applicationId}/status`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ status: 'shortlisted' })
			});
			
			if (response.ok) {
				alert('Candidate shortlisted successfully!');
				setApplication(prev => ({ ...prev, status: 'shortlisted' }));
			} else {
				alert('Failed to shortlist candidate');
			}
		} catch (error) {
			console.error('Error shortlisting candidate:', error);
			alert('Error shortlisting candidate');
		}
	};

	const downloadDocument = (fileData, fileName) => {
		if (!fileData) return;
		
		// Handle Base64 encoded files
		if (fileData.startsWith('data:')) {
			const link = document.createElement('a');
			link.href = fileData;
			link.download = fileName || 'document';
			link.click();
		} else {
			// Handle file paths
			const link = document.createElement('a');
			link.href = `http://localhost:5000/${fileData}`;
			link.download = fileName || 'document';
			link.click();
		}
	};

	const viewDocument = (fileData) => {
		if (!fileData) return;
		
		// Handle Base64 encoded files
		if (fileData.startsWith('data:')) {
			// Create a blob URL for better viewing
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
			// Handle file paths
			window.open(`http://localhost:5000/${fileData}`, '_blank');
		}
	};

	if (loading) {
		return <div className="text-center p-4">Loading candidate details...</div>;
	}

	if (!application || !candidate) {
		return <div className="text-center p-4">Candidate not found</div>;
	}

	return (
		<>
            <div className="panel panel-default site-bg-white p-3">
                <div className="panel-heading d-flex justify-content-between align-items-center">
                    <h4 className="panel-tittle">
                        <i className="far fa-user-circle" /> Applicant Details
                    </h4>

                    <span className={`badge ${getStatusBadge(application.status)} text-capitalize`}>
                        {application.status}
                    </span>
                </div>

                <div className="panel-body">
                    <button
                        className="btn btn-outline-secondary mb-3"
                        onClick={() => navigate(-1)}
                    >
                        ← Back to Applicants List
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
                                        <h6>Percentage / CGPA / SGPA <p className="mb-0 text-muted">{candidate.education[0].percentage || 'Not provided'}</p></h6>
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
                                        <h6>Percentage / CGPA / SGPA <p className="mb-0 text-muted">{candidate.education[1].percentage || 'Not provided'}</p></h6>
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
                                        <h6>Percentage / CGPA / SGPA <p className="mb-0 text-muted">{candidate.education[2].percentage || 'Not provided'}</p></h6>
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
                            <h6>Application Details</h6>
                            <p><strong>Applied for:</strong> {application.jobId?.title || 'Unknown Job'}</p>
                            <p><strong>Applied on:</strong> {formatDate(application.createdAt)}</p>
                        </div>

                        {/* Interview Rounds Section */}
                        {true && interviewRounds.length >= 0 && (
                            <>
                                <hr />
                                <h5 className="mb-3">Interview Rounds ({interviewRounds.length})</h5>
                                {interviewRounds.map((round, index) => (
                                    <div key={index} className="border rounded p-3 mb-3">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <h6>{round.name || `Round ${round.round}`}</h6>
                                            </div>
                                            <div className="col-md-3">
                                                <select 
                                                    className="form-control"
                                                    value={round.status}
                                                    onChange={(e) => {
                                                        const updated = [...interviewRounds];
                                                        updated[index].status = e.target.value;
                                                        setInterviewRounds(updated);
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="passed">Passed</option>
                                                    <option value="failed">Failed</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Feedback/Comments"
                                                    value={round.feedback}
                                                    onChange={(e) => {
                                                        const updated = [...interviewRounds];
                                                        updated[index].feedback = e.target.value;
                                                        setInterviewRounds(updated);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Remarks Section */}
                        <hr />
                        <h5 className="mb-3">Overall Remarks</h5>
                        <textarea
                            className="form-control mb-3"
                            rows="4"
                            placeholder="Enter your overall remarks about the candidate..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />

                        {/* Selection Checkbox */}
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="candidateSelection"
                                checked={isSelected}
                                onChange={(e) => setIsSelected(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="candidateSelection">
                                Select this candidate for further process
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={saveReview}>
                                <i className="fa fa-save me-1" />Save Review
                            </button>
                            <button className="btn btn-primary" onClick={shortlistCandidate}>
                                <i className="fa fa-check me-1" />Shortlist
                            </button>
                            <button className="btn btn-danger" onClick={() => console.log('Reject candidate')}>
                                <i className="fa fa-times me-1" />Reject
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
	);
}

export default EmpCandidateReviewPage;