// Route: /candidate/status

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadScript } from "../../../../globals/constants";
import { api } from "../../../../utils/api";
import CanPostedJobs from "./can-posted-jobs";

// Add CSS for hover effect
const styles = `
.hover-primary:hover {
	color: #0d6efd !important;
	cursor: pointer;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
	const styleSheet = document.createElement('style');
	styleSheet.type = 'text/css';
	styleSheet.innerText = styles;
	document.head.appendChild(styleSheet);
}

function CanStatusPage() {
	const navigate = useNavigate();
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('applications');

	useEffect(() => {
		loadScript("js/custom.js");
		fetchApplications();
		
		// Set up polling to refresh data every 30 seconds
		const interval = setInterval(() => {
			fetchApplications();
		}, 30000);
		
		return () => clearInterval(interval);
	}, []);

	const fetchApplications = async () => {
		setLoading(true);
		try {
			const response = await api.getCandidateApplicationsWithInterviews();
			if (response.success) {
				setApplications(response.applications || response.data || []);
				console.log('Fetched applications with interview data:', response.applications);
			}
		} catch (error) {
			console.error('Error fetching applications:', error);
			// Fallback to regular applications if new endpoint fails
			try {
				const fallbackResponse = await api.getCandidateApplications();
				if (fallbackResponse.success) {
					setApplications(fallbackResponse.applications || fallbackResponse.data || []);
				}
			} catch (fallbackError) {
				console.error('Fallback fetch also failed:', fallbackError);
			}
		} finally {
			setLoading(false);
		}
	};

	const getInterviewRounds = (job) => {
		// For testing - show default rounds if no specific types
		if (job?.interviewRoundTypes) {
			const rounds = [];
			const roundTypes = job.interviewRoundTypes;
			
			if (roundTypes.technical) rounds.push('Technical');
			if (roundTypes.hr) rounds.push('HR');
			if (roundTypes.managerial) rounds.push('Managerial');
			if (roundTypes.nonTechnical) rounds.push('Non-Technical');
			if (roundTypes.final) rounds.push('Final');
			
			if (rounds.length > 0) return rounds;
		}
		
		// Default rounds for testing
		return ['Technical', 'HR', 'Final'];
	};

	const getRoundStatus = (application, roundIndex) => {
		// Check if there are actual interview rounds data from employer review
		if (application.interviewRounds && application.interviewRounds.length > 0) {
			const round = application.interviewRounds.find(r => r.round === roundIndex + 1);
			if (round) {
				switch (round.status) {
					case 'passed':
						return { 
							text: 'Passed', 
							class: 'bg-success text-white',
							feedback: round.feedback || ''
						};
					case 'failed':
						return { 
							text: 'Failed', 
							class: 'bg-danger text-white',
							feedback: round.feedback || ''
						};
					case 'pending':
					default:
						return { 
							text: 'Pending', 
							class: 'bg-warning text-dark',
							feedback: round.feedback || ''
						};
				}
			}
		}
		
		// Fallback to application status logic
		const status = application.status;
		if (status === 'shortlisted' && roundIndex === 0) {
			return { text: 'Shortlisted', class: 'bg-success text-white', feedback: '' };
		} else if (status === 'interviewed') {
			if (roundIndex === 0) return { text: 'Completed', class: 'bg-success text-white', feedback: '' };
			if (roundIndex === 1) return { text: 'In Progress', class: 'bg-warning text-dark', feedback: '' };
		} else if (status === 'hired') {
			return { text: 'Completed', class: 'bg-success text-white', feedback: '' };
		} else if (status === 'rejected') {
			return { text: 'Rejected', class: 'bg-danger text-white', feedback: '' };
		}
		
		return { text: 'Not Started', class: 'bg-secondary text-white', feedback: '' };
	};

	return (
		<>
			<div className="wt-admin-right-page-header clearfix">
				<h2>Job Applications</h2>
				<div className="d-flex justify-content-between align-items-center">
					<small className="text-muted">Updates automatically every 30 seconds</small>
					<button 
						className="btn btn-sm btn-outline-primary"
						onClick={fetchApplications}
						disabled={loading}
					>
						<i className="fa fa-refresh me-1" />
						{loading ? 'Refreshing...' : 'Refresh Now'}
					</button>
				</div>
			</div>
			
			<div className="twm-pro-view-chart-wrap">
				<div className="col-lg-12 col-md-12 mb-4">
					<div className="card shadow-sm border-0">
						<div className="card-body p-0">
							<div className="table-responsive">
								<table className="table table-hover mb-0">
									<thead className="bg-light">
										<tr>
											<th className="border-0 px-4 py-3 text-muted fw-semibold">Applied Date</th>
											<th className="border-0 px-4 py-3 text-muted fw-semibold">Company</th>
											<th className="border-0 px-4 py-3 text-muted fw-semibold">Position</th>
											<th className="border-0 px-4 py-3 text-muted fw-semibold">Status</th>
											<th className="border-0 px-4 py-3 text-muted fw-semibold">Interview Progress</th>
										</tr>
									</thead>

									<tbody>
										{loading ? (
											<tr>
												<td colSpan="5" className="text-center py-5">
													<div className="spinner-border text-primary" role="status">
														<span className="visually-hidden">Loading...</span>
													</div>
													<p className="mt-2 text-muted">Loading applications...</p>
												</td>
											</tr>
										) : applications.length === 0 ? (
											<tr>
												<td colSpan="5" className="text-center py-5">
													<i className="fas fa-inbox fa-3x text-muted mb-3"></i>
													<p className="text-muted">No applications found</p>
												</td>
											</tr>
										) : (
											applications.map((app, index) => {
												const interviewRounds = getInterviewRounds(app.jobId);
												return (
													<tr key={index} className="border-bottom">
														<td className="px-4 py-3">
															<span className="text-dark fw-medium">
																{new Date(app.createdAt || app.appliedAt).toLocaleDateString('en-US', {
																	day: '2-digit',
																	month: 'short',
																	year: 'numeric'
																})}
															</span>
														</td>
														<td className="px-4 py-3">
															<div className="d-flex align-items-center">
																<div className="me-3">
																	<div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
																		<i className="fas fa-building text-primary"></i>
																	</div>
																</div>
																<div>
																	<a href={`/emp-detail/${app.employerId?._id}`} className="text-decoration-none">
																		<h6 className="mb-1 fw-semibold text-dark hover-primary">
																			{app.employerId?.companyName || 'Company'}
																		</h6>
																	</a>
																	<small className="text-muted">
																		<i className="fas fa-map-marker-alt me-1"></i>
																		{app.jobId?.location || 'Location'}
																	</small>
																</div>
															</div>
														</td>
														<td className="px-4 py-3">
															<span className="fw-medium text-dark">
																{app.jobId?.title || 'Position'}
															</span>
														</td>
														<td className="px-4 py-3">
															<span className={
																app.status === 'pending' ? 'badge bg-warning bg-opacity-10 text-warning border border-warning' :
																app.status === 'shortlisted' ? 'badge bg-info bg-opacity-10 text-info border border-info' :
																app.status === 'interviewed' ? 'badge bg-primary bg-opacity-10 text-primary border border-primary' :
																app.status === 'hired' ? 'badge bg-success bg-opacity-10 text-success border border-success' :
																app.status === 'rejected' ? 'badge bg-danger bg-opacity-10 text-danger border border-danger' : 'badge bg-secondary bg-opacity-10 text-secondary border border-secondary'
															} style={{fontSize: '12px', padding: '6px 12px'}}>
																{app.status?.charAt(0).toUpperCase() + app.status?.slice(1) || 'Pending'}
															</span>
														</td>
														<td className="px-4 py-3">
															<div className="d-flex flex-wrap gap-2">
																{interviewRounds.length > 0 ? (
																	interviewRounds.map((round, roundIndex) => {
																		const roundStatus = getRoundStatus(app, roundIndex);
																		return (
																			<div key={roundIndex} className="mb-2" style={{minWidth: '140px'}}>
																				<div className="card border-0 shadow-sm" style={{fontSize: '11px'}}>
																					<div className="card-body p-2">
																						<div className="text-muted fw-medium mb-1">{round}</div>
																						<span className={`badge ${roundStatus.class}`} style={{fontSize: '10px', padding: '4px 8px'}}>
																							{roundStatus?.text || 'Pending'}
																						</span>
																						{roundStatus.feedback && (
																							<div className="text-muted mt-1" style={{fontSize: '9px', lineHeight: '1.2'}}>
																								{roundStatus.feedback}
																							</div>
																						)}
																					</div>
																				</div>
																			</div>
																		);
																	})
																) : (
																	<span className="text-muted fst-italic">No rounds specified</span>
																)}
															</div>
														</td>
													</tr>
												);
											})
										)}

									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default CanStatusPage;
