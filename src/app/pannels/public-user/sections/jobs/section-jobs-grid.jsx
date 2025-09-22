import JobZImage from "../../../../common/jobz-img";
import { NavLink, useNavigate } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import SectionPagination from "../common/section-pagination";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { isAuthenticated, redirectToLogin } from "../../../../../utils/auth";

function SectionJobsGrid({ filters, onTotalChange }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, [filters]);

    const fetchJobs = async () => {
        try {
            const params = new URLSearchParams();
            // Handle search parameter (from HeroBody or sidebar)
            if (filters?.search) params.append('search', filters.search);
            if (filters?.keyword) params.append('keyword', filters.keyword);
            
            // Handle location parameter
            if (filters?.location) params.append('location', filters.location);
            
            // Handle job type parameter (from HeroBody or sidebar)
            if (filters?.jobType) {
                if (Array.isArray(filters.jobType)) {
                    filters.jobType.forEach(type => {
                        const normalizedType = type.toLowerCase().replace(/\s+/g, '-');
                        params.append('jobType', normalizedType);
                    });
                } else {
                    const normalizedType = filters.jobType.toLowerCase().replace(/\s+/g, '-');
                    params.append('jobType', normalizedType);
                }
            }
            if (filters?.employmentType) params.append('employmentType', filters.employmentType);
            
            // Handle other parameters
            if (filters?.jobTitle) params.append('jobTitle', filters.jobTitle);
            if (filters?.skills?.length > 0) {
                filters.skills.forEach(skill => params.append('skills', skill));
            }
            if (filters?.category) {
                params.append('category', filters.category);
                console.log('Category filter being sent:', filters.category);
            }
            if (filters?.sortBy !== undefined && filters?.sortBy !== null) {
                params.append('sortBy', filters.sortBy);
            }
            if (filters?.itemsPerPage) {
                params.append('limit', filters.itemsPerPage.toString());
            }

            const url = `http://localhost:5000/api/public/jobs?${params.toString()}`;
            console.log('API URL:', url);
            console.log('Filters received:', filters);
            const response = await fetch(url);
            const data = await response.json();
            console.log('API Response:', data);
            console.log('Jobs count:', data.jobs?.length || 0);
            if (data.success) {
                let jobList = data.jobs || data.data || [];
                setJobs(jobList);
                if (onTotalChange) {
                    onTotalChange(jobList.length);
                }
            } else {
                setJobs([]);
                if (onTotalChange) {
                    onTotalChange(0);
                }
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setJobs([]);
            if (onTotalChange) {
                onTotalChange(0);
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <Row>
                {jobs.length > 0 ? jobs.map((job, index) => (
                    <Col key={job._id} lg={6} md={12} className="mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
                        <div className="twm-jobs-grid-style1 hover-card">
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
                                    <NavLink to={`${publicUser.jobs.DETAIL1}/${job._id}`} className="btn btn-sm apply-now-button">
                                        Apply Now
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </Col>
                )) : (
                    <Col xs={12} className="text-center py-5" data-aos="fade-up">
                        <h5>No jobs found</h5>
                        <p>Please check back later for new opportunities.</p>
                    </Col>
                )}

			</Row>
				<SectionPagination />
			</>
		);
}

export default SectionJobsGrid;