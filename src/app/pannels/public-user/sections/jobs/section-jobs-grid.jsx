import JobZImage from "../../../../common/jobz-img";
import { NavLink, useNavigate } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import SectionPagination from "../common/section-pagination";
import { useState, useEffect } from "react";
import { isAuthenticated, redirectToLogin } from "../../../../../utils/auth";

function SectionJobsGrid({ filters }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, [filters]);

    const fetchJobs = async () => {
        try {
            const params = new URLSearchParams();
            if (filters?.keyword) params.append('search', filters.keyword);
            if (filters?.location) params.append('location', filters.location);
            if (filters?.jobTitle) params.append('title', filters.jobTitle);
            if (filters?.employmentType) params.append('employmentType', filters.employmentType);
            if (filters?.jobType?.length > 0) {
                filters.jobType.forEach(type => params.append('jobType', type));
            }
            if (filters?.skills?.length > 0) {
                filters.skills.forEach(skill => params.append('skills', skill));
            }
            if (filters?.category) {
                params.append('category', filters.category);
                console.log('Category filter being sent:', filters.category);
            }
            
            const url = `http://localhost:5000/api/public/jobs?${params.toString()}`;
            console.log('API URL:', url);
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setJobs(data.jobs || data.data || []);
            } else {
                setJobs([]);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5">Loading jobs...</div>;
    }

    return (
        <>
            <div className="row">
                {jobs.length > 0 ? jobs.map((job) => (
                    <div key={job._id} className="col-lg-6 col-md-12 m-b30">
                        <div className="twm-jobs-grid-style1">
                            <div className="twm-media">
                                {job.employerProfile?.logo ? (
                                    <img src={job.employerProfile.logo} alt="Company Logo" />
                                ) : (
                                    <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                                )}
                            </div>

                            <div className="twm-jobs-category green">
                                <span className={`twm-bg-${job.jobType === 'Full-time' ? 'green' : job.jobType === 'Part-time' ? 'brown' : job.jobType === 'Contract' ? 'purple' : job.jobType === 'Internship' ? 'sky' : 'golden'}`}>
                                    {job.jobType || job.employmentType || 'Full-time'}
                                </span>
                            </div>

                            <div className="twm-mid-content">
                                <NavLink to={`${publicUser.jobs.DETAIL1}/${job._id}`} className="twm-job-title">
                                    <h4>{job.title}</h4>
                                </NavLink>
                                <div className="twm-job-address">
                                    <i className="feather-map-pin" />
                                    &nbsp;{job.location}
                                </div>
                            </div>

                            <div className="twm-right-content twm-job-right-group">
                                <div className="twm-salary-and-apply mb-2">
                                    <div className="twm-jobs-amount">
                                        {job.salary ? (
                                            typeof job.salary === 'object' && job.salary.currency ? 
                                                `${job.salary.currency === 'USD' ? '$' : '₹'}${job.salary.min || job.salary.max || ''}` :
                                                typeof job.salary === 'string' && job.salary.includes('₹') ? 
                                                    job.salary : 
                                                    `₹${job.salary}`
                                        ) : '₹4.25-5.5'} <span>L.P.A</span>
                                    </div>
                                    <span className="vacancy-text">Vacancies: 4</span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <h6 className="twm-job-address posted-by-company mb-0">
                                        Posted by {job.employerId?.employerType === 'consultant' || job.companyName ? 'Consultancy' : 'Company'}
                                    </h6>
                                    <NavLink to={`${publicUser.jobs.DETAIL1}/${job._id}`} className="btn btn-sm apply-now-button" style={{backgroundColor: '#f56523', color: '#fff', border: 'none', borderRadius: '5px', padding: '6px 16px', fontWeight: '500', textDecoration: 'none'}}>
                                        Apply Now
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 text-center p-5">
                        <h5>No jobs found</h5>
                        <p>Please check back later for new opportunities.</p>
                    </div>
                )}

				</div>
				<SectionPagination />
			</>
		);
}

export default SectionJobsGrid;