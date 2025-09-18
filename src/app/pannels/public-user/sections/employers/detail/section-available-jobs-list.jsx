// import { NavLink } from "react-router-dom";
// import JobZImage from "../../../../../common/jobz-img";
// import { publicUser } from "../../../../../../globals/route-names";

// function SectionAvailableJobsList() {
//     return (
//         <>
//             <h4 className="twm-s-title">Available Jobs</h4>
//             <div className="twm-jobs-list-wrap">
//                 <ul>
//                     <li>
//                         <div className="twm-jobs-list-style1 mb-5">
//                              {/* <div className="twm-media">
//                                  <JobZImage src="images/jobs-company/pic1.jpg" alt="#" /> 
//                             </div>  */}
//                             <div className="twm-mid-content">
//                                 <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
//                                     <h4>Senior Web Designer<span className="twm-job-post-duration">/ 1 days ago</span></h4>
//                                 </NavLink>
//                                 <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
//                                 {/* <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a> */}
//                             </div>
//                             <div className="twm-right-content">
//                                 <div className="twm-jobs-category green"><span className="twm-bg-green">New</span></div>
//                                 <div className="twm-jobs-amount">₹1000 <span>/ Month</span></div>
//                                 <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
//                             </div>
//                         </div>
//                     </li>
//                     <li>
//                         <div className="twm-jobs-list-style1 mb-5">
//                             {/* <div className="twm-media">
//                                 <JobZImage src="images/jobs-company/pic2.jpg" alt="#" />
//                             </div> */}
//                             <div className="twm-mid-content">
//                                 <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
//                                     <h4>Senior Stock Technician<span className="twm-job-post-duration">/ 15 days ago</span></h4>
//                                 </NavLink>
//                                 <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
//                                 {/* <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a> */}
//                             </div>
//                             <div className="twm-right-content">
//                                 <div className="twm-jobs-category green"><span className="twm-bg-brown">Intership</span></div>
//                                 <div className="twm-jobs-amount">₹1000 <span>/ Month</span></div>
//                                 <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
//                             </div>
//                         </div>
//                     </li>
//                     <li>
//                         <div className="twm-jobs-list-style1 mb-5">
//                             {/* <div className="twm-media">
//                                 <JobZImage src="images/jobs-company/pic3.jpg" alt="#" />
//                             </div> */}
//                             <div className="twm-mid-content">
//                                 <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
//                                     <h4 className="twm-job-title">IT Department Manager<span className="twm-job-post-duration">/ 6 Month ago</span></h4>
//                                 </NavLink>
//                                 <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
//                                 {/* <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a> */}
//                             </div>
//                             <div className="twm-right-content">
//                                 <div className="twm-jobs-category green"><span className="twm-bg-purple">Fulltime</span></div>
//                                 <div className="twm-jobs-amount">₹1000 <span>/ Month</span></div>
//                                 <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
//                             </div>
//                         </div>
//                     </li>
//                 </ul>
//             </div>
//         </>
//     )
// }

// export default SectionAvailableJobsList;

import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { publicUser } from "../../../../../../globals/route-names";

function SectionAvailableJobsList({ employerId }) {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (employerId) {
			fetchEmployerJobs();
		}
	}, [employerId]);

	const fetchEmployerJobs = async () => {
		try {
			const response = await fetch(`http://localhost:5000/api/public/jobs?employerId=${employerId}`);
			const data = await response.json();
			if (data.success) {
				setJobs(data.jobs || []);
			}
		} catch (error) {
			console.error('Error fetching employer jobs:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Loading jobs...</div>;
	}
	return (
		<>
			<h4 className="twm-s-title">Available Jobs</h4>
			<div className="twm-jobs-list-wrap">
				{jobs.length > 0 ? (
					<ul>
						{jobs.map((job) => (
							<li key={job._id}>
								<div className="twm-jobs-list-style1 mb-5">
									<div className="">
										<NavLink to={`/job-detail/${job._id}`} className="twm-job-title">
											<h4>
												{job.title}
												<span className="twm-job-post-duration">/ {new Date(job.createdAt).toLocaleDateString()}</span>
											</h4>
										</NavLink>

										<p className="twm-job-desc">
											{job.description?.substring(0, 100)}...
										</p>
									</div>

									<div className="twm-right-content">
										<div className="twm-jobs-category">
											<span className={`twm-bg-${job.status === 'active' ? 'green' : 'gray'}`}>{job.status}</span>
										</div>

										<div className="twm-jobs-amount">
											<span>{typeof job.salary === 'object' && job.salary ?
													(job.salary.min && job.salary.max ?
														`₹${job.salary.min} - ₹${job.salary.max}` :
														job.salary.currency ? `${job.salary.currency === 'USD' ? '$' : '₹'}${job.salary.min || job.salary.max || ''}` : 'Not specified') :
													job.salary || 'Not specified'}</span>
										</div>

										<NavLink
											to={`/job-detail/${job._id}`}
											className="twm-jobs-browse site-text-primary"
										>
											Browse Job
										</NavLink>
									</div>
								</div>
							</li>
						))}
					</ul>
				) : (
					<p>No jobs available from this employer.</p>
				)}
			</div>
		</>
	);
}

export default SectionAvailableJobsList;
