import { ArrowLeft, Award, Briefcase, Calendar, Check, Download, Eye, FileText, GraduationCap, Mail, MapPin, Phone, Save, User, UserCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadScript } from "../../../../globals/constants";


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
				if (data.application.employerRemarks) {
					setRemarks(data.application.employerRemarks);
				}
				if (data.application.isSelectedForProcess) {
					setIsSelected(data.application.isSelectedForProcess);
				}
				
				// Initialize interview rounds based on job configuration
				const job = data.application.jobId;
				let roundsCount = 2;
				if (job && job.interviewRoundsCount) {
					roundsCount = job.interviewRoundsCount;
				}
				
				const roundNames = [];
				if (job && job.interviewRoundTypes) {
					if (job.interviewRoundTypes.technical) roundNames.push('Technical Round');
					if (job.interviewRoundTypes.managerial) roundNames.push('Managerial Round');
					if (job.interviewRoundTypes.nonTechnical) roundNames.push('Non-Technical Round');
					if (job.interviewRoundTypes.hr) roundNames.push('HR Round');
					if (job.interviewRoundTypes.final) roundNames.push('Final Round');
				}
				
				if (roundNames.length === 0) {
					const defaultRounds = ['Technical Round', 'HR Round', 'Final Round', 'Managerial Round', 'Non-Technical Round'];
					for (let i = 0; i < roundsCount; i++) {
						roundNames.push(defaultRounds[i] || `Round ${i + 1}`);
					}
				}
				
				// Create all rounds and merge with existing data
				const allRounds = [];
				for (let i = 0; i < roundsCount; i++) {
					const existingRound = data.application.interviewRounds?.find(r => r.round === i + 1);
					allRounds.push({
						round: i + 1,
						name: roundNames[i] || `Round ${i + 1}`,
						status: existingRound?.status || 'pending',
						feedback: existingRound?.feedback || ''
					});
				}
				
				setInterviewRounds(allRounds);

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
				const result = await response.json();
				alert('Interview review saved successfully! Candidate will see the updated status.');
				console.log('Review saved:', result);
			} else {
				const errorData = await response.json();
				alert(`Failed to save review: ${errorData.message || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error saving review:', error);
			alert('Error saving review. Please try again.');
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
				alert('Candidate shortlisted successfully! Status updated for candidate.');
				setApplication(prev => ({ ...prev, status: 'shortlisted' }));
			} else {
				const errorData = await response.json();
				alert(`Failed to shortlist candidate: ${errorData.message || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error shortlisting candidate:', error);
			alert('Error shortlisting candidate. Please try again.');
		}
	};

	const rejectCandidate = async () => {
		try {
			const token = localStorage.getItem('employerToken');
			const response = await fetch(`http://localhost:5000/api/employer/applications/${applicationId}/status`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ status: 'rejected' })
			});
			
			if (response.ok) {
				alert('Candidate rejected. Status updated for candidate.');
				setApplication(prev => ({ ...prev, status: 'rejected' }));
			} else {
				const errorData = await response.json();
				alert(`Failed to reject candidate: ${errorData.message || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error rejecting candidate:', error);
			alert('Error rejecting candidate. Please try again.');
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
		<div className="container-fluid py-3 emp-candidate-review">
			{/* Header Section */}
			<div className="row mb-4">
				<div className="col-12">
					<div className="d-flex justify-content-between align-items-center bg-white p-4 rounded shadow-sm">
						<div className="d-flex align-items-center gap-3">
							<button
								className="btn btn-outline-secondary"
								onClick={() => navigate(-1)}
							>
								<ArrowLeft size={16} />
							</button>
							<div>
								<h3 className="mb-0 d-flex align-items-center gap-2">
									<UserCircle2 size={24} style={{ color: "#f97316" }} />
									Candidate Review
								</h3>
								<p className="text-muted mb-0">Comprehensive candidate evaluation</p>
							</div>
						</div>
						<span className={`badge ${getStatusBadge(application.status)} text-capitalize fs-6 px-3 py-2`}>
							{application.status}
						</span>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="row">
				{/* Left Column - Candidate Profile */}
				<div className="col-lg-8">
					{/* Personal Information Card */}
					<div className="card shadow-sm mb-4">
						<div className="card-header bg-light">
							<h5 className="mb-0 d-flex align-items-center gap-2">
								<User size={20} style={{ color: "#f97316" }} />
								Personal Information
							</h5>
						</div>
						<div className="card-body">
							<div className="row align-items-center mb-4">
								<div className="col-auto">
									<div
										className="rounded-circle overflow-hidden border"
										style={{ width: "80px", height: "80px" }}
									>
										{candidate.profilePicture ? (
											<img
												src={candidate.profilePicture}
												alt={candidate.name}
												style={{ width: "80px", height: "80px", objectFit: "cover" }}
											/>
										) : (
											<div className="d-flex align-items-center justify-content-center h-100 bg-light">
												<User size={40} className="text-muted" />
											</div>
										)}
									</div>
								</div>
								<div className="col">
									<h4 className="mb-1">{candidate.name}</h4>
									<p className="text-muted mb-2 d-flex align-items-center gap-1">
										<Briefcase size={16} />
										Applied for: {application.jobId?.title || 'Unknown Job'}
									</p>
									<p className="text-muted mb-0 d-flex align-items-center gap-1">
										<Calendar size={16} />
										Applied on: {formatDate(application.createdAt)}
									</p>
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<div className="info-item mb-3">
										<div className="d-flex align-items-center gap-2 mb-1">
											<Mail size={16} style={{ color: "#f97316" }} />
											<strong>Email</strong>
										</div>
										<p className="text-muted mb-0 ms-4">{candidate.email}</p>
									</div>
									<div className="info-item mb-3">
										<div className="d-flex align-items-center gap-2 mb-1">
											<Phone size={16} style={{ color: "#f97316" }} />
											<strong>Mobile</strong>
										</div>
										<p className="text-muted mb-0 ms-4">{candidate.phone || 'Not provided'}</p>
									</div>
									<div className="info-item mb-3">
										<div className="d-flex align-items-center gap-2 mb-1">
											<Calendar size={16} style={{ color: "#f97316" }} />
											<strong>Date of Birth</strong>
										</div>
										<p className="text-muted mb-0 ms-4">{candidate.dateOfBirth ? formatDate(candidate.dateOfBirth) : 'Not provided'}</p>
									</div>
								</div>
								<div className="col-md-6">
									<div className="info-item mb-3">
										<div className="d-flex align-items-center gap-2 mb-1">
											<User size={16} style={{ color: "#f97316" }} />
											<strong>Gender</strong>
										</div>
										<p className="text-muted mb-0 ms-4">{candidate.gender || 'Not provided'}</p>
									</div>
									<div className="info-item mb-3">
										<div className="d-flex align-items-center gap-2 mb-1">
											<User size={16} style={{ color: "#f97316" }} />
											<strong>Father's Name</strong>
										</div>
										<p className="text-muted mb-0 ms-4">{candidate.fatherName || 'Not provided'}</p>
									</div>
									<div className="info-item mb-3">
										<div className="d-flex align-items-center gap-2 mb-1">
											<MapPin size={16} style={{ color: "#f97316" }} />
											<strong>Address</strong>
										</div>
										<p className="text-muted mb-0 ms-4">{candidate.residentialAddress || 'Not provided'}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Education Card */}
					{candidate.education && candidate.education.length > 0 && (
						<div className="card shadow-sm mb-4">
							<div className="card-header bg-light">
								<h5 className="mb-0 d-flex align-items-center gap-2">
									<GraduationCap size={20} style={{ color: "#f97316" }} />
									Education Details
								</h5>
							</div>
							<div className="card-body">
								<div className="row">
									{candidate.education.map((edu, index) => (
										<div key={index} className="col-md-6 mb-3">
											<div className="border rounded p-3">
												<h6 className="text-primary mb-2">
													{index === 0 ? '10th Grade' : index === 1 ? '12th Grade' : 'Degree'}
												</h6>
												<p className="mb-1"><strong>Institution:</strong> {edu.collegeName || 'Not provided'}</p>
												<p className="mb-1"><strong>Year:</strong> {edu.passYear || 'Not provided'}</p>
												<p className="mb-2"><strong>Score:</strong> {edu.scoreValue || edu.percentage || 'Not provided'}{edu.scoreType === 'percentage' ? '%' : ''}</p>
												{edu.marksheet && (
													<div className="d-flex gap-2">
														<button
															className="btn btn-outline-primary btn-sm"
															onClick={() => viewDocument(edu.marksheet)}
														>
															<Eye size={14} className="me-1" />View
														</button>
														<button
															className="btn btn-outline-secondary btn-sm"
															onClick={() => downloadDocument(edu.marksheet, `marksheet_${index}.pdf`)}
														>
															<Download size={14} className="me-1" />Download
														</button>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Skills & Summary */}
					{(candidate.skills?.length > 0 || candidate.profileSummary) && (
						<div className="card shadow-sm mb-4">
							<div className="card-header bg-light">
								<h5 className="mb-0 d-flex align-items-center gap-2">
									<Award size={20} style={{ color: "#f97316" }} />
									Skills & Summary
								</h5>
							</div>
							<div className="card-body">
								{candidate.skills && candidate.skills.length > 0 && (
									<div className="mb-3">
										<h6>Key Skills</h6>
										<div className="d-flex flex-wrap gap-2">
											{candidate.skills.map((skill, index) => (
												<span key={index} className="badge bg-secondary">{skill}</span>
											))}
										</div>
									</div>
								)}
								{candidate.profileSummary && (
									<div>
										<h6>Profile Summary</h6>
										<p className="text-muted" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{candidate.profileSummary}</p>
									</div>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Right Column - Actions & Review */}
				<div className="col-lg-4">
					{/* Resume Card */}
					{candidate.resume && (
						<div className="card shadow-sm mb-4">
							<div className="card-header bg-light">
								<h5 className="mb-0 d-flex align-items-center gap-2">
									<FileText size={20} style={{ color: "#f97316" }} />
									Resume
								</h5>
							</div>
							<div className="card-body text-center">
								<button
									className="btn btn-primary"
									onClick={() => downloadDocument(candidate.resume, 'resume.pdf')}
								>
									<Download size={16} className="me-1" />Download Resume
								</button>
							</div>
						</div>
					)}

					{/* Interview Rounds */}
					{interviewRounds.length > 0 && (
						<div className="card shadow-sm mb-4">
							<div className="card-header bg-light">
								<h5 className="mb-0">Interview Rounds ({interviewRounds.length})</h5>
							</div>
							<div className="card-body">
								{interviewRounds.map((round, index) => (
									<div key={index} className="mb-3 p-2 border rounded">
										<h6 className="mb-2">{round.name}</h6>
										<select 
											className="form-select form-select-sm mb-2"
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
										<input
											type="text"
											className="form-control form-control-sm"
											placeholder="Feedback"
											value={round.feedback}
											onChange={(e) => {
												const updated = [...interviewRounds];
												updated[index].feedback = e.target.value;
												setInterviewRounds(updated);
											}}
										/>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Review & Actions */}
					<div className="card shadow-sm">
						<div className="card-header bg-light">
							<h5 className="mb-0">Review & Actions</h5>
						</div>
						<div className="card-body">
							<div className="mb-3">
								<label className="form-label">Overall Remarks</label>
								<textarea
									className="form-control"
									rows="3"
									placeholder="Enter your remarks..."
									value={remarks}
									onChange={(e) => setRemarks(e.target.value)}
								/>
							</div>

							<div className="form-check mb-3">
								<input
									className="form-check-input"
									type="checkbox"
									id="candidateSelection"
									checked={isSelected}
									onChange={(e) => setIsSelected(e.target.checked)}
								/>
								<label className="form-check-label" htmlFor="candidateSelection">
									Select for further process
								</label>
							</div>

							<div className="d-grid gap-2">
								<button className="btn btn-success" onClick={saveReview}>
									<Save size={16} className="me-1" />Save Review
								</button>
								<button className="btn btn-primary" onClick={shortlistCandidate}>
									<Check size={16} className="me-1" />Shortlist
								</button>
								<button className="btn btn-danger" onClick={rejectCandidate}>
									<X size={16} className="me-1" />Reject
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EmpCandidateReviewPage;