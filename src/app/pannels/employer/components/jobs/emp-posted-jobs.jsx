
import React, { useEffect, useState } from "react";
import { loadScript } from "../../../../../globals/constants";
import { NavLink, useNavigate } from "react-router-dom";
import { employer, empRoute } from "../../../../../globals/route-names";

export default function EmpPostedJobs() {
	const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isApproved, setIsApproved] = useState(false);
    const [employerType, setEmployerType] = useState('company');
    
    useEffect(() => {
        loadScript("js/custom.js");
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('employerToken');
            if (!token) return;

            // Fetch employer profile to check approval status
            const profileResponse = await fetch('http://localhost:5000/api/employer/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                const employerData = profileData.profile?.employerId;
                setIsApproved(employerData?.isApproved || false);
                setEmployerType(employerData?.employerType || 'company');
            }

            const response = await fetch('http://localhost:5000/api/employer/jobs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
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

    const getStatusBadge = (status) => {
        return status === 'active' ? 'twm-bg-green' : 'twm-bg-red';
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        
        try {
            const token = localStorage.getItem('employerToken');
            const response = await fetch(`http://localhost:5000/api/employer/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                alert('Job deleted successfully!');
                fetchJobs(); // Refresh the list
            } else {
                alert('Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job');
        }
    };

    const handleStatusToggle = async (jobId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';
        
        try {
            const token = localStorage.getItem('employerToken');
            const response = await fetch(`http://localhost:5000/api/employer/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (response.ok) {
                alert(`Job ${newStatus === 'active' ? 'activated' : 'closed'} successfully!`);
                fetchJobs(); // Refresh the list
            } else {
                alert('Failed to update job status');
            }
        } catch (error) {
            console.error('Error updating job status:', error);
            alert('Failed to update job status');
        }
    };

	return (
		<>
			<div className="wt-admin-right-page-header clearfix">
				<h2>Jobs Posted</h2>
			</div>

			<div className="panel panel-default site-bg-white p-3">
				<div className="panel-heading wt-panel-heading mb-3 d-flex justify-content-between">
                    <div>
                        <h4 className="panel-tittle">
                            <i className="far fa-list-alt" /> Job Details
                        </h4>

                        <p className="text-muted">Review and manage jobs details</p>
                    </div>
					
                    <div className="text-left">
                        {isApproved ? (
                            <NavLink to={empRoute(employer.POST_A_JOB)}>
                                <button type="submit" className="site-button">
                                    Post Job
                                </button>
                            </NavLink>
                        ) : (
                            <div>
                                <button type="button" className="site-button" disabled>
                                    Post Job
                                </button>
                                <p className="text-warning mt-2 mb-0">Account pending admin approval</p>
                            </div>
                        )}
                    </div>
				</div>

				<div className="panel-body wt-panel-body">
					<div className="mb-3 d-flex justify-content-between align-items-center">
						<input
							type="text"
							className="form-control w-25"
							placeholder="Search jobs..."
						/>
						<div className="dropdown">
							<button
								className="btn btn-outline-secondary dropdown-toggle"
								type="button"
								data-bs-toggle="dropdown"
							>
								Job Post Status
							</button>

							<ul className="dropdown-menu">
								<li>
									<a className="dropdown-item" href="#">
										Active
									</a>
								</li>

								<li>
									<a className="dropdown-item" href="#">
										Inactive
									</a>
								</li>
							</ul>
						</div>
					</div>

					{loading ? (
						<div className="text-center py-4">
							<div className="spinner-border" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : (
						<div className="row">
							{jobs.length === 0 ? (
								<div className="col-12 text-center py-4">
									<p className="text-muted">No jobs posted yet.</p>
									{isApproved ? (
										<NavLink to={empRoute(employer.POST_A_JOB)}>
											<button className="site-button">Post Your First Job</button>
										</NavLink>
									) : (
										<div>
											<button className="site-button" disabled>Post Your First Job</button>
											<p className="text-warning mt-2">Your account is pending admin approval before you can post jobs.</p>
										</div>
									)}
								</div>
							) : (
								jobs.map((job) => (
									<div className="col-lg-6 col-12" key={job._id}>
										<div className="d-flex justify-content-between align-items-center p-3 border rounded mb-3 shadow-sm">
											<div className="d-flex align-items-center gap-3">
												<div>
													<h5 className="mb-1">{job.title}</h5>
													<p className="mb-0 text-muted">{job.location}</p>
													<small className="text-muted">
														{job.salary ? 
															(typeof job.salary === 'object' ? 
																`₹ ${job.salary.min || 0} - ${job.salary.max || 0}` : 
																`₹ ${job.salary}`
															) : 'Salary not specified'
														}
													</small><br/>
													<small className="text-muted">
														Posted {formatDate(job.createdAt)}
													</small>
												</div>
											</div>
											<div className="d-flex align-items-center gap-2">
												<span className={`badge ${getStatusBadge(job.status)} text-capitalize`}>
													{job.status}
												</span>
												<div className="btn-group" role="group">
													<button
														className="btn btn-outline-primary btn-sm"
														onClick={() => navigate(`/employer/emp-job-review/${job._id}`)}
														title="View Details"
													>
														<i className="fa fa-eye" />
													</button>
													<button
														className="btn btn-outline-success btn-sm"
														onClick={() => navigate(`/employer/edit-job/${job._id}`)}
														title="Edit Job"
													>
														<i className="fa fa-edit" />
													</button>
													<button
														className={`btn btn-outline-${job.status === 'active' ? 'warning' : 'info'} btn-sm`}
														onClick={() => handleStatusToggle(job._id, job.status)}
														title={job.status === 'active' ? 'Close Job' : 'Activate Job'}
													>
														<i className={`fa fa-${job.status === 'active' ? 'pause' : 'play'}`} />
													</button>

												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}

