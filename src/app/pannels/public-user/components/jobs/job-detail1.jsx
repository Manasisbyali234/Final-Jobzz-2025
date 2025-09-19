
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadScript } from "../../../../../globals/constants";
import JobZImage from "../../../../common/jobz-img";
import ApplyJobPopup from "../../../../common/popups/popup-apply-job";
import SectionJobLocation from "../../sections/jobs/detail/section-job-location";
import SectionOfficePhotos1 from "../../sections/common/section-office-photos1";
import SectionOfficeVideo1 from "../../sections/common/section-office-video1";
import SectionShareProfile from "../../sections/common/section-share-profile";
import SectionJobsSidebar2 from "../../sections/jobs/sidebar/section-jobs-sidebar2";
import "./job-detail.css";

function JobDetail1Page() {
    const { id, param1 } = useParams();
    // Use 'id' if it exists, otherwise use 'param1' (for backward compatibility)
    const jobId = id || param1;
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [hasApplied, setHasApplied] = useState(false);
    const [candidateId, setCandidateId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('candidateToken');
        const storedCandidateId = localStorage.getItem('candidateId');
        setIsLoggedIn(!!token);
        setCandidateId(storedCandidateId);
        
        if (token && storedCandidateId && jobId) {
            checkApplicationStatus();
        }
    }, [jobId]);

    const sidebarConfig = {
        showJobInfo: true
    }

    useEffect(()=>{
        loadScript("js/custom.js");
        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId]);

    const checkApplicationStatus = async () => {
        try {
            const token = localStorage.getItem('candidateToken');
            const response = await fetch(`http://localhost:5000/api/candidate/applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                const applied = data.applications.some(app => app.jobId._id === jobId);
                setHasApplied(applied);
            }
        } catch (error) {
            console.error('Error checking application status:', error);
        }
    };

    const fetchJobDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/public/jobs/${jobId}`);
            const data = await response.json();
            if (data.success) {
                setJob(data.job);
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5">Loading job details...</div>;
    }

    if (!job) {
        return <div className="text-center p-5">Job not found</div>;
    }

    const isEnded = (job?.status && job.status !== 'active') || (typeof job?.applicationLimit === 'number' && job.applicationLimit > 0 && (job?.applicationCount || 0) >= job.applicationLimit);

    const handleApplyClick = async () => {
        if (isEnded) return; // Guard
        if (!isLoggedIn) {
            alert('Please login first to apply for jobs!');
            return;
        } else if (hasApplied) {
            alert('You have already applied for this job!');
        } else {
            try {
                const token = localStorage.getItem('candidateToken');
                const response = await fetch('http://localhost:5000/api/candidate/applications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ jobId: jobId })
                });
                const data = await response.json();
                if (data.success) {
                    setHasApplied(true);
                    alert('Application submitted successfully!');
                } else {
                    alert(data.message || 'Failed to submit application');
                }
            } catch (error) {
                console.error('Error applying for job:', error);
                alert('Failed to submit application');
            }
        }
    };



    return (
			<>
				<div className="section-full  p-t120 p-b90 bg-white">
					<div className="container">
						{/* BLOG SECTION START */}
						<div className="section-content">
							<div className="row d-flex justify-content-center">
								<div className="col-lg-8 col-md-12">
									{/* Candidate detail START */}
									<div className="cabdidate-de-info">
										<div className="twm-job-self-wrap">
											<div className="twm-job-self-info">
												<div className="twm-job-self-top">
													<div className="twm-media-bg">
														{job.employerProfile?.coverImage ? (
															<img src={job.employerProfile.coverImage.startsWith('data:') ? job.employerProfile.coverImage : `data:image/jpeg;base64,${job.employerProfile.coverImage}`} alt="Company Cover" />
														) : (
															<JobZImage src="images/job-detail-bg.jpg" alt="#" />
														)}
														<div className="twm-jobs-category green">
															<span className="twm-bg-green">New</span>
														</div>
													</div>

													<div className="twm-mid-content">
														<div className="twm-media">
															{job.companyLogo ? (
																<img src={job.companyLogo} alt="Company Logo" />
															) : job.employerProfile?.logo ? (
																<img src={job.employerProfile.logo.startsWith('data:') ? job.employerProfile.logo : `data:image/jpeg;base64,${job.employerProfile.logo}`} alt="Company Logo" />
															) : (
																<JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
															)}
														</div>

														<h4 className="twm-job-title">
															{job.title}
															<span className="twm-job-post-duration">
																/ {new Date(job.createdAt).toLocaleDateString()}
															</span>
														</h4>
														{job.companyName && (
															<p className="twm-job-company"><strong>Company: {job.companyName}</strong></p>
														)}
														<p className="twm-job-address"><i className="feather-map-pin" />{job.location}</p>
														{/* <p className="twm-job-address"><i className="feather-map-pin" />#56 Sunset Blvd Sahakar Nagar, Bengaluru, 560902</p> */}
														{/* <div className="twm-job-self-mid">
                                                        <div className="twm-job-self-mid-left">
                                                            <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a>
                                                            <div className="twm-jobs-amount">₹ 3.5 Lacs <span>P.A.</span></div>
                                                        </div>
                                                        <div className="twm-job-apllication-area">Application ends:
                                                            <span className="twm-job-apllication-date">October 1, 2025</span>
                                                        </div>
                                                    </div> */}
														<div className="twm-job-self-bottom">
															<button
																className={`site-button ${hasApplied ? 'disabled' : ''}`}
																onClick={handleApplyClick}
																disabled={hasApplied}
															>
																{hasApplied ? 'Already Applied' : 'Apply Now'}
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>

										{job.companyDescription && (
											<>
												<h4 className="twm-s-title">About Company:</h4>
												<p>{job.companyDescription}</p>
											</>
										)}
										<h4 className="twm-s-title">Job Description:</h4>
										<p>{job.description}</p>
										
										<div className="row">
											<div className="col-md-6">
												<h5>Job Type:</h5> <p>{job.jobType}</p>
												<h5>Vacancies:</h5> <p>{job.vacancies || 'Not specified'}</p>
												<h5>Education:</h5> <p>{job.education || 'Not specified'}</p>
											</div>
											<div className="col-md-6">
												<h5>Experience Level:</h5> <p>{job.experienceLevel || 'Not specified'}</p>
												<h5>Min Experience:</h5> <p>{job.minExperience || 0} years</p>
												<h5>Backlogs Allowed:</h5> <p>{job.backlogsAllowed ? 'Yes' : 'No'}</p>
											</div>
										</div>

										<h4 className="twm-s-title">Required Skills:</h4>
										<ul className="description-list-2">
											{job.requiredSkills && job.requiredSkills.length > 0 ? (
												job.requiredSkills.map((skill, index) => (
													<li key={index}>
														<i className="feather-check" />
														{skill}
													</li>
												))
											) : (
												<li><i className="feather-check" />No specific skills mentioned</li>
											)}
										</ul>

										<h4 className="twm-s-title">Responsibilities:</h4>
										<ul className="description-list-2">
											<li>
												<i className="feather-check" />
												Establish and promote design guidelines, best practices
												and standards.
											</li>

											<li>
												<i className="feather-check" />
												Accurately estimate design tickets during planning
												sessions.
											</li>
											
											<li>
												<i className="feather-check" />
												Present and defend designs and key deliverables to peers
												and executive level stakeholders.
											</li>

											<li>
												<i className="feather-check" />
												Execute all visual design stages from concept to final
												hand-off to engineering.
											</li>
										</ul>

										<h4 className="twm-s-title">Benefits:</h4>
										<ul className="description-list-2">
											<li>
												<i className="feather-check" />
												Transportation Provided
											</li>

											<li>
												<i className="feather-check" />
												Flexible Working
											</li>
											
											<li>
												<i className="feather-check" />
												Health Insurance
											</li>
											
										</ul>

										<SectionShareProfile />
										{/* <SectionJobLocation /> */}

										<div className="twm-two-part-section">
											<div className="row">
												<div className="col-lg-6 col-md-12">
													{/* <SectionOfficePhotos1 /> */}
												</div>
												
												<div className="col-lg-6 col-md-12">
													{/* <SectionOfficeVideo1 /> */}
												</div>
											</div>
										</div>
									</div>
								</div>
								
								<div className="col-lg-4 col-md-12 rightSidebar">
									<SectionJobsSidebar2 _config={sidebarConfig} job={job} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<ApplyJobPopup />
				

			</>
		);
}

export default JobDetail1Page;