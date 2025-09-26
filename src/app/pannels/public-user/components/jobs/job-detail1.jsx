
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
    const [scrollProgress, setScrollProgress] = useState(0);
    const [candidateCredits, setCandidateCredits] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('candidateToken');
        const storedCandidateId = localStorage.getItem('candidateId');
        setIsLoggedIn(!!token);
        setCandidateId(storedCandidateId);
        
        if (token && storedCandidateId && jobId) {
            checkApplicationStatus();
            fetchCandidateCredits();
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
        
        // Scroll progress tracking
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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

    const fetchCandidateCredits = async () => {
        try {
            const token = localStorage.getItem('candidateToken');
            const response = await fetch('http://localhost:5000/api/candidate/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setCandidateCredits(data.candidate.credits || 0);
            }
        } catch (error) {
            console.error('Error fetching candidate credits:', error);
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
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{marginLeft: '16px', color: '#6c757d'}}>Loading job details...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center p-5" style={{animation: 'fadeInUp 0.6s ease-out'}}>
                <h3 style={{color: '#6c757d'}}>Job not found</h3>
                <p style={{color: '#9ca3af'}}>The job you're looking for doesn't exist or has been removed.</p>
            </div>
        );
    }

    const limitReached = typeof job?.applicationLimit === 'number' && job.applicationLimit > 0 && (job?.applicationCount || 0) >= job.applicationLimit;
    const isEnded = (job?.status && job.status !== 'active') || limitReached;

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
                
                // Check candidate credits first
                const statsResponse = await fetch('http://localhost:5000/api/candidate/dashboard/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const statsData = await statsResponse.json();
                
                if (statsData.success && statsData.candidate.registrationMethod === 'placement') {
                    const credits = statsData.candidate.credits || 0;
                    if (credits <= 0) {
                        alert('You have insufficient credits to apply for jobs. Please contact your placement coordinator to get more credits.');
                        return;
                    }
                    
                    // Show credit deduction warning
                    const confirmApply = window.confirm(`You have ${credits} credits remaining. Applying for this job will deduct 1 credit. Do you want to continue?`);
                    if (!confirmApply) {
                        return;
                    }
                }
                
                // Check if candidate has uploaded resume
                const profileResponse = await fetch('http://localhost:5000/api/candidate/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const profileData = await profileResponse.json();
                
                if (!profileData.success || !profileData.profile?.resume) {
                    alert('Please upload your resume first before applying for jobs. Go to My Resume section to upload.');
                    navigate('/candidate/my-resume');
                    return;
                }
                
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
				{/* Scroll Progress Indicator */}
				<div className="scroll-progress" style={{width: `${scrollProgress}%`}}></div>
				
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
														
														{((typeof job.salary === 'string' || typeof job.salary === 'number') || job.minSalary || job.maxSalary) && (
															<div className="salary-info">
																<span className="salary-amount">
																	{typeof job.salary === 'string' || typeof job.salary === 'number' ? `₹${job.salary}` : 
																	 (job.minSalary && job.maxSalary) ? `₹${job.minSalary} - ₹${job.maxSalary}` :
																	 job.minSalary ? `₹${job.minSalary}+` :
																	 `₹${job.maxSalary}`}
																</span>
															</div>
														)}

														<div className="twm-job-self-bottom">
															<button
																className={`site-button ${(hasApplied || isEnded) ? 'disabled' : ''}`}
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

										{job.postedBy === 'Consultant' && job.employerProfile && (
											<>
												<h4 className="twm-s-title">About Consultant:</h4>
												<div className="consultant-info" style={{background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
													<div className="row">
														<div className="col-md-3">
															{job.employerProfile.logo && (
																<img 
																	src={job.employerProfile.logo.startsWith('data:') ? job.employerProfile.logo : `data:image/jpeg;base64,${job.employerProfile.logo}`} 
																	alt="Consultant Logo" 
																	style={{width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px'}}
																/>
															)}
														</div>
														<div className="col-md-9">
															<h5>{job.employerId?.companyName || 'Consultant'}</h5>
															{job.employerProfile.description && <p>{job.employerProfile.description}</p>}
															{job.employerProfile.website && (
																<p><strong>Website:</strong> <a href={job.employerProfile.website} target="_blank" rel="noopener noreferrer">{job.employerProfile.website}</a></p>
															)}
															{job.employerProfile.location && (
																<p><strong>Location:</strong> {job.employerProfile.location}</p>
															)}
														</div>
													</div>
												</div>
											</>
										)}
										<h4 className="twm-s-title">Job Description:</h4>
										<p>{job.description}</p>
										
										<div className="job-details-grid" style={{background: '#f8f9fa', padding: '24px', borderRadius: '12px', marginBottom: '24px'}}>
											<div className="row">
												<div className="col-md-6">
													<div className="detail-item">
														<h5><i className="feather-briefcase" style={{marginRight: '8px'}}></i>Job Type:</h5>
														<p>{job.jobType}</p>
													</div>
													<div className="detail-item">
														<h5><i className="feather-users" style={{marginRight: '8px'}}></i>Vacancies:</h5>
														<p>{job.vacancies || 'Not specified'}</p>
													</div>
													<div className="detail-item">
														<h5><i className="feather-book" style={{marginRight: '8px'}}></i>Education:</h5>
														<p>{job.education || 'Not specified'}</p>
													</div>
												</div>
												<div className="col-md-6">
													<div className="detail-item">
														<h5><i className="feather-trending-up" style={{marginRight: '8px'}}></i>Experience Level:</h5>
														<p>{job.experienceLevel || 'Not specified'}</p>
													</div>
													<div className="detail-item">
														<h5><i className="feather-clock" style={{marginRight: '8px'}}></i>Min Experience:</h5>
														<p>{job.minExperience || 0} years</p>
													</div>
													<div className="detail-item">
														<h5><i className="feather-check-circle" style={{marginRight: '8px'}}></i>Backlogs Allowed:</h5>
														<p><span className={`badge ${job.backlogsAllowed ? 'badge-success' : 'badge-danger'}`}>{job.backlogsAllowed ? 'Yes' : 'No'}</span></p>
													</div>
												</div>
											</div>
										</div>

										<h4 className="twm-s-title">Required Skills:</h4>
										{job.requiredSkills && job.requiredSkills.length > 0 ? (
											<div className="skills-container">
												{job.requiredSkills.map((skill, index) => (
													<span key={index} className="skill-tag">
														<i className="feather-check"></i>
														{skill}
													</span>
												))}
											</div>
										) : (
											<p style={{color: '#6c757d', fontStyle: 'italic'}}>No specific skills mentioned</p>
										)}

										<h4 className="twm-s-title">Responsibilities:</h4>
										<ul className="description-list-2">
											<li>Establish and promote design guidelines, best practices and standards.</li>
											<li>Accurately estimate design tickets during planning sessions.</li>
											<li>Present and defend designs and key deliverables to peers and executive level stakeholders.</li>
											<li>Execute all visual design stages from concept to final hand-off to engineering.</li>
										</ul>

										<h4 className="twm-s-title">Benefits:</h4>
										<ul className="description-list-2">
											<li>Transportation Provided</li>
											<li>Flexible Working</li>
											<li>Health Insurance</li>
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
				
				{/* Floating Apply Button */}
				{!hasApplied && !isEnded && (
					<div className="floating-apply-btn" onClick={handleApplyClick}>
						<i className="feather-send"></i>
						<span>Quick Apply</span>
					</div>
				)}
				
				{/* Back to top button */}
				<div className="back-to-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
					<i className="feather-arrow-up"></i>
				</div>

			</>
		);
}

export default JobDetail1Page;