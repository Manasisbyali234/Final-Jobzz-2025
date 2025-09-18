// Route: /candidate/status

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadScript } from "../../../../globals/constants";
import { api } from "../../../../utils/api";
import CanPostedJobs from "./can-posted-jobs";

function CanStatusPage() {
	const navigate = useNavigate();
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('applications');

	useEffect(() => {
		loadScript("js/custom.js");
		fetchApplications();
	}, []);

	const fetchApplications = async () => {
		try {
			const response = await api.getCandidateApplications();
			if (response.success) {
				setApplications(response.applications || response.data || []);
			}
		} catch (error) {
			console.error('Error fetching applications:', error);
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
		const status = application.status;
		
		if (status === 'pending' && roundIndex === 0) {
			return { text: 'Pending', class: 'bg-warning text-dark' };
		} else if (status === 'shortlisted' && roundIndex === 0) {
			return { text: 'Shortlisted', class: 'bg-success text-white' };
		} else if (status === 'interviewed') {
			if (roundIndex === 0) return { text: 'Completed', class: 'bg-success text-white' };
			if (roundIndex === 1) return { text: 'In Progress', class: 'bg-warning text-dark' };
			return { text: 'Pending', class: 'bg-secondary text-white' };
		} else if (status === 'hired') {
			return { text: 'Completed', class: 'bg-success text-white' };
		} else if (status === 'rejected') {
			return { text: 'Rejected', class: 'bg-danger text-white' };
		}
		
		return { text: 'Not Started', class: 'bg-secondary text-white' };
	};

	return (
		<>
			<div className="wt-admin-right-page-header clearfix">
				<h2>Job Applications</h2>

			</div>
			
			<div className="twm-pro-view-chart-wrap">
						<div className="col-lg-12 col-md-12 mb-4">
							<div className="panel panel-default site-bg-white">
								<div className="panel-body wt-panel-body">
									<div className="twm-D_table p-a20 table-responsive">
										<table className="table table-bordered">
											<thead>
												<tr>
													<th>Date</th>
													<th>Company</th>
													<th>Position</th>
													<th>Status</th>
													<th>Interview Rounds</th>
												</tr>
											</thead>

											<tbody>
												{loading ? (
													<tr>
														<td colSpan="5" className="text-center">Loading applications...</td>
													</tr>
												) : applications.length === 0 ? (
													<tr>
														<td colSpan="5" className="text-center">No applications found</td>
													</tr>
												) : (
													applications.map((app, index) => {
														const interviewRounds = getInterviewRounds(app.jobId);
														return (
															<tr key={index}>
																<td>{new Date(app.createdAt || app.appliedAt).toLocaleDateString()}</td>
																<td>
																	<div className="twm-DT-candidates-list">
																		<div className="twm-mid-content">
																			<a href={`/emp-detail/${app.employerId?._id}`} className="twm-job-title">
																				<h4>{app.employerId?.companyName || app.job?.company?.name || 'Company'}</h4>
																				<p className="twm-candidate-address">
																					<i className="feather-map-pin" /> {app.jobId?.location || app.job?.location || 'Location'}
																				</p>
																			</a>
																		</div>
																	</div>
																</td>
																<td>{app.jobId?.title || app.job?.title || 'Position'}</td>
																<td>
																	<div className="twm-jobs-category">
																		<span className={
																		app.status === 'pending' ? 'badge bg-warning text-dark' :
																		app.status === 'shortlisted' ? 'badge bg-success text-white' :
																		app.status === 'interviewed' ? 'badge bg-primary text-white' :
																		app.status === 'hired' ? 'badge bg-success text-white' :
																		app.status === 'rejected' ? 'badge bg-danger text-white' : 'badge bg-secondary text-white'
																	}>
																			{app.status?.charAt(0).toUpperCase() + app.status?.slice(1) || 'Pending'}
																		</span>
																	</div>
																</td>
																<td>
																	<div className="d-flex flex-wrap gap-2">
																		{interviewRounds.length > 0 ? (
																			interviewRounds.map((round, roundIndex) => {
																				const roundStatus = getRoundStatus(app, roundIndex);
																				return (
																					<div key={roundIndex} className="mb-1">
																						<small className="d-block text-muted">{round}</small>
																						<span className={`badge ${roundStatus.class}`} style={{fontSize: '10px', padding: '2px 6px'}}>
																						{roundStatus?.text || 'Pending'}
																					</span>
																					</div>
																				);
																			})
																		) : app.jobId?.interviewRoundsCount ? (
																			Array.from({length: app.jobId.interviewRoundsCount}, (_, i) => (
																				<div key={i} className="mb-1">
																					<small className="d-block text-muted">Round {i + 1}</small>
																					<span className={`badge ${getRoundStatus(app, i).class}`} style={{fontSize: '10px'}}>
																						{getRoundStatus(app, i)?.text || 'Pending'}
																					</span>
																				</div>
																			))
																		) : (
																			<span className="text-muted">No rounds specified</span>
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
