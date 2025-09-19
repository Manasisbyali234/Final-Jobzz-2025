import JobZImage from "../../../../common/jobz-img";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { loadScript, updateSkinStyle } from "../../../../../globals/constants";
import api from "../../../../../utils/api";
import HeroBody from "../../../../../components/HeroBody";
import { Container, Row, Col } from "react-bootstrap";

function Home16Page() {
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({ totalJobs: 0, totalEmployers: 0, totalApplications: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        updateSkinStyle("8", false, false)
        loadScript("js/custom.js")
        fetchHomeData();

        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';

        // Add intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe all sections that should animate
        const sections = document.querySelectorAll('.animate-on-scroll');
        sections.forEach(section => observer.observe(section));

        return () => {
            sections.forEach(section => observer.unobserve(section));
        };
    }, [])

    const fetchHomeData = async () => {
        try {
            const [jobsData, statsData] = await Promise.all([
                (async () => {
                    const res = await api.getJobs({ limit: 6 });
                    return res;
                })(),
                (async () => {
                    // Prefer public stats; falls back to admin stats if token available
                    const pub = await api.getPublicStats();
                    if (pub && pub.success) return pub;
                    const adm = await api.getAdminStats();
                    return adm;
                })(),
            ]);

            if (jobsData.success) setJobs(jobsData.jobs);
            if (statsData.success) setStats(statsData.stats);
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeroBody className="mt-4 mt-md-5" />

            {/* Hidden banner section */}
            <div className="twm-home16-banner-section site-bg-light-purple" style={{display:"none"}}>
                <Container className="py-5">
                    <Row>
                        {/*Left Section*/}
                        <Col xl={6} lg={6} md={12}>
                            <div className="twm-bnr-left-section">
                                <div className="twm-bnr-title-small mb-4">
                                    We Have <span className="site-text-primary">{stats.totalJobs || '2,000'}+</span> Live
                                    Jobs
                                </div>

                                <div className="twm-bnr-title-large mb-4">
                                    Find the <span className="site-text-primary">job</span> that
                                    fits your life
                                </div>

                                <div className="twm-bnr-discription mb-4">
                                    Type your keyword, then click search to find your perfect job.
                                </div>

                                <div className="twm-bnr-search-bar mb-4">
                                    <form>
                                        <Row>
                                            {/*Title*/}
                                            <Col xl={3} lg={6} md={6} className="mb-3">
                                                <label>What</label>
                                                <select
                                                    className="wt-search-bar-select selectpicker"
                                                    data-live-search="true"
                                                    title=""
                                                    id="j-Job_Title"
                                                    data-bv-field="size"
                                                    defaultValue="Job Title"
                                                >
                                                    <option disabled value="">
                                                        Select Category
                                                    </option>
                                                    <option>Job Title</option>
                                                    <option>Web Designer</option>
                                                    <option>Developer</option>
                                                    <option>Acountant</option>
                                                </select>
                                            </Col>

                                            {/*All Category*/}
                                            <Col xl={3} lg={6} md={6} className="mb-3">
                                                <label>Type</label>
                                                <select
                                                    className="wt-search-bar-select selectpicker"
                                                    data-live-search="true"
                                                    title=""
                                                    id="j-All_Category"
                                                    data-bv-field="size"
                                                    defaultValue="All Category"
                                                >
                                                    <option disabled value="">
                                                        Select Category
                                                    </option>
                                                    <option>All Category</option>
                                                    <option>Full Time</option>
                                                    <option>Internship</option>
                                                    <option>Contract</option>
                                                    <option>Work From Home</option>
                                                </select>
                                            </Col>

                                            {/*Location*/}
                                            <Col xl={3} lg={6} md={6} className="mb-3">
                                                <label>Location</label>
                                                <div className="twm-inputicon-box">
                                                    <input
                                                        name="username"
                                                        type="text"
                                                        required
                                                        className="form-control"
                                                        placeholder="Search..."
                                                    />
                                                    <i className="twm-input-icon fas fa-map-marker-alt" />
                                                </div>
                                            </Col>

                                            {/*Find job btn*/}
                                            <Col xl={3} lg={6} md={6} className="mb-3">
                                                <NavLink to="/job-grid" className="site-button">
                                                    Find Job
                                                </NavLink>
                                            </Col>
                                        </Row>
                                    </form>
                                </div>

                                <div className="twm-bnr-popular-search">
                                    <span className="twm-title">Popular Searches:</span>
                                    <NavLink to={"#!"}>Developer</NavLink> ,
                                    <NavLink to={"#!"}>Designer</NavLink> ,
                                    <NavLink to={"#!"}>Architect</NavLink> ,
                                    <NavLink to={"#!"}>Engineer</NavLink> ...
                                </div>
                            </div>
                        </Col>

                        {/*right Section*/}
                        <Col xl={6} lg={6} md={12}>
                            <div className="twm-h-page-16-bnr-right-section">
                                <div className="twm-h-page16-bnr-pic">
                                    <JobZImage src="images/home-16/banner/bnr-pic.png" alt="#" />
                                </div>

                                {/*Samll Ring Left*/}
                                <div className="twm-small-ring-l bounce" />
                                <div className="twm-small-ring-2 bounce2" />
                                <div className="twm-bnr-right-carousel">
                                    <div className="twm-bnr-blocks-position-wrap">
                                        {/*icon-block-1*/}
                                        <div className="twm-bnr-blocks twm-bnr-blocks-position-1">
                                            <div className="twm-content">
                                                <div className="tw-count-number text-clr-sky">
                                                    <span className="counter">
                                                        <CountUp end={stats.totalEmployers || 2} duration={10} />
                                                    </span>
                                                    +
                                                </div>
                                                <p className="icon-content-info">Companies</p>
                                            </div>
                                        </div>

                                        {/*icon-block-2*/}
                                        <div className="twm-bnr-blocks twm-bnr-blocks-position-2">
                                            <div className="twm-content">
                                                <div className="tw-count-number text-clr-pink">
                                                    <span className="counter">
                                                        <CountUp end={98} duration={10} />
                                                    </span>{" "}
                                                    +
                                                </div>
                                                <p className="icon-content-info">Job Categories</p>
                                            </div>
                                        </div>

                                        {/*icon-block-3*/}
                                        <div className="twm-bnr-blocks-3 twm-bnr-blocks-position-3">
                                            <div className="twm-content">
                                                <div className="tw-count-number text-clr-green">
                                                    <span className="counter">
                                                        <CountUp end={stats.totalApplications || 3} duration={10} />
                                                    </span>
                                                    +
                                                </div>
                                                <p className="icon-content-info">Applications</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div className="twm-img-bg-circle-area">
                        <div className="twm-img-bg-circle1">
                            <span />
                        </div>

                        <div className="twm-img-bg-circle2">
                            <span />
                        </div>

                        <div className="twm-img-bg-circle3">
                            <span />
                        </div>
                    </div>
                </Container>
            </div>

            {/* HOW IT WORK SECTION START */}
            <div className="section-full p-t70 p-b60 site-bg-gray twm-how-it-work-area animate-on-scroll">
                <Container className="py-5">
                    {/* title="" START*/}
                    <div className="section-head center wt-small-separator-outer mb-5">
                        <div className="wt-small-separator site-text-primary">
                            <div>Working Process</div>
                        </div>

                        <h2 className="wt-title">How It Works</h2>
                    </div>
                    {/* title="" END*/}

                    <div className="twm-how-it-work-section3">
                        <Row>
                            <Col xl={3} lg={6} col={12} className="mb-4">
                                <div className="twm-w-process-steps3 hover-card">
                                    <div className="twm-w-pro-top">
                                        <div className="twm-media">
                                            <span>
                                                <JobZImage
                                                    src="images/work-process/icon1.png"
                                                    alt="icon1"
                                                />
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="twm-title">Register Your Account</h4>
                                    <p>You need to create an account to find the best jobs.</p>
                                </div>
                            </Col>

                            <Col xl={3} lg={6} col={12} className="mb-4">
                                <div className="twm-w-process-steps3 hover-card">
                                    <div className="twm-w-pro-top">
                                        <div className="twm-media">
                                            <span>
                                                <JobZImage
                                                    src="images/work-process/icon4.png"
                                                    alt="icon2"
                                                />
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="twm-title">Search and Apply</h4>
                                    <p>Search your preferred jobs and apply.</p>
                                </div>
                            </Col>

                            <Col xl={3} lg={6} col={12} className="mb-4">
                                <div className="twm-w-process-steps3 hover-card">
                                    <div className="twm-w-pro-top">
                                        <div className="twm-media">
                                            <span>
                                                <JobZImage
                                                    src="images/work-process/icon3.png"
                                                    alt="icon1"
                                                />
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="twm-title">Take Assessment</h4>
                                    <p>Take assessment curated based on the job profile.</p>
                                </div>
                            </Col>

                            <Col xl={3} lg={6} col={12} className="mb-4">
                                <div className="twm-w-process-steps3 hover-card">
                                    <div className="twm-w-pro-top">
                                        <div className="twm-media">
                                            <span>
                                                <JobZImage
                                                    src="images/work-process/icon2.png"
                                                    alt="icon1"
                                                />
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="twm-title">Recruitment Process</h4>
                                    <p>
                                        Interviews and discussion rounds scheduled by company.
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
            {/* HOW IT WORK SECTION END */}

            {/* JOBS CATEGORIES SECTION START */}
            <div className="section-full p-t50 p-b50 site-bg-white twm-job-categories-hpage-6-area animate-on-scroll">
                {/* title="" START*/}
                <div className="section-head center wt-small-separator-outer mb-5">
                    <div className="wt-small-separator site-text-primary">
                        <div>Jobs by Categories</div>
                    </div>

                    <h2 className="wt-title">Choose a Relevant Category</h2>
                </div>
                {/* title="" END*/}
                <Container className="py-5">
                    <div className="twm-job-cat-hpage-6-wrap">
                        <div className="job-cat-block-hpage-6-section m-b30">
                            <Row>
                                {/* COLUMNS 1 */}
                                <Col className="mb-4">
                                    <div className="job-cat-block-hpage-6 m-b30 hover-card">
                                        <div className="twm-media">
                                            <div className="flaticon-dashboard" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to="/job-grid?category=IT">Programming &amp; Tech</NavLink>
                                            <div className="twm-jobs-available">
                                                <span>100+</span> Posted new jobs
                                            </div>
                                            <div className="circle-line-wrap">
                                                <NavLink to="/job-grid?category=IT" className="circle-line-btn">
                                                    <i className="fa fa-arrow-right" />
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {/* COLUMNS 2 */}
                                <Col className="mb-4">
                                    <div className="job-cat-block-hpage-6 m-b30 hover-card">
                                        <div className="twm-media">
                                            <div className="flaticon-project-management" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to="/job-grid?category=Content">Content Writer</NavLink>
                                            <div className="twm-jobs-available">
                                                <span>100+</span> Posted new jobs
                                            </div>
                                            <div className="circle-line-wrap">
                                                <NavLink to="/job-grid?category=Content" className="circle-line-btn">
                                                    <i className="fa fa-arrow-right" />
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {/* COLUMNS 3 */}
                                <Col className="mb-4">
                                    <div className="job-cat-block-hpage-6 m-b30 hover-card">
                                        <div className="twm-media">
                                            <div className="flaticon-note" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to="/job-grid?category=Design">Graphic Designer</NavLink>
                                            <div className="twm-jobs-available">
                                                <span>100+</span> Posted new jobs
                                            </div>
                                            <div className="circle-line-wrap">
                                                <NavLink to="/job-grid?category=Design" className="circle-line-btn">
                                                    <i className="fa fa-arrow-right" />
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {/* COLUMNS 4 */}
                                <Col className="mb-4">
                                    <div className="job-cat-block-hpage-6 m-b30 hover-card">
                                        <div className="twm-media">
                                            <div className="flaticon-customer-support" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to="/job-grid?category=Healthcare">Healthcare</NavLink>
                                            <div className="twm-jobs-available">
                                                <span>100+</span> Posted new jobs
                                            </div>
                                            <div className="circle-line-wrap">
                                                <NavLink to="/job-grid?category=Healthcare" className="circle-line-btn">
                                                    <i className="fa fa-arrow-right" />
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                {/* COLUMNS 5 */}
                                <Col className="mb-4">
                                    <div className="job-cat-block-hpage-6 m-b30 hover-card">
                                        <div className="twm-media">
                                            <div className="flaticon-bars" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to="/job-grid?category=Marketing">Digital Marketing</NavLink>
                                            <div className="twm-jobs-available">
                                                <span>100+</span> Posted new jobs
                                            </div>
                                            <div className="circle-line-wrap">
                                                <NavLink to="/job-grid?category=Marketing" className="circle-line-btn">
                                                    <i className="fa fa-arrow-right" />
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div className="text-center job-categories-btn">
                            <NavLink to={"#!"} className=" site-button">
                                All Categories
                            </NavLink>
                        </div>
                    </div>
                </Container>
            </div>
            {/* JOBS CATEGORIES SECTION END */}

            {/* JOB POST START */}
            <div className="section-full p-t50 p-b30 site-bg-gray twm-bg-ring-wrap2 animate-on-scroll">
                <div className="twm-bg-ring-right" />
                <div className="twm-bg-ring-left" />
                <Container className="py-5">
                    <div className="wt-separator-two-part">
                        <Row className="wt-separator-two-part-row">
                            <Col xl={6} lg={6} md={12} className="wt-separator-two-part-left mb-4">
                                {/* title="" START*/}
                                <div className="section-head left wt-small-separator-outer">
                                    <div className="wt-small-separator site-text-primary">
                                        <div>All Jobs Post</div>
                                    </div>

                                    <h2 className="wt-title">
                                        Find Your Career You Deserve it
                                    </h2>
                                </div>
                                {/* title="" END*/}
                            </Col>

                            <Col xl={6} lg={6} md={12} className="wt-separator-two-part-right text-right mb-4">
                                <NavLink to="/job-grid" className=" site-button">
                                    Browse All Jobs
                                </NavLink>
                            </Col>
                        </Row>
                    </div>

                    <div className="section-content">
                        <div className="twm-jobs-grid-wrap">
                            <Row>
                                {jobs.length > 0 ? jobs.slice(0, 6).map((job) => (
                                    <Col lg={4} md={6} key={job._id} className="mb-4">
                                        <div className="twm-jobs-grid-style1 m-b30 hover-card">
                                            <div className="twm-media">
                                                {job.employerProfile?.logo ? (
                                                    <img src={job.employerProfile.logo} alt="Company Logo" />
                                                ) : (
                                                    <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                                                )}
                                            </div>

                                            <div className="twm-jobs-category green">
                                                <span className={`twm-bg-${job.status === 'active' ? 'green' : 'gray'}`}>
                                                    {job.status === 'active' ? 'Active' : job.status}
                                                </span>
                                            </div>
                                            <div className="twm-mid-content">
                                                <NavLink to={`/job-detail/${job._id}`} className="twm-job-title">
                                                    <h4>{job.title}</h4>
                                                </NavLink>
                                                <div className="twm-job-address">
                                                    <i className="feather-map-pin" />
                                                    &nbsp; {job.location}
                                                </div>
                                            </div>

                                            <div className="twm-right-content twm-job-right-group">
                                                <div className="twm-salary-and-apply mb-2">
                                                    <div className="twm-jobs-amount">
                                                        <strong>Annual CTC:</strong> {job.ctc?.min && job.ctc?.max ?
                                                            `₹${(job.ctc.min/100000).toFixed(1)}L - ₹${(job.ctc.max/100000).toFixed(1)}L` :
                                                            job.salary ? (typeof job.salary === 'string' && job.salary.includes('₹') ? job.salary : `₹${job.salary}`) : 'Not specified'
                                                        }
                                                    </div>
                                                    {job.netSalary?.min && job.netSalary?.max && (
                                                        <div className="twm-net-salary">
                                                            <small><strong>Net Salary:</strong> ₹{Math.round(job.netSalary.min/1000)}K - ₹{Math.round(job.netSalary.max/1000)}K</small>
                                                        </div>
                                                    )}
                                                    <span className="vacancy-text">Vacancies: {job.vacancies || 'Not specified'}</span>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between">
                                                    <h6 className="twm-job-address posted-by-company mb-0">
                                                        {job.employerId?.companyName || 'Company'}
                                                    </h6>

                                                    <button
                                                        className="btn btn-sm apply-now-button"
                                                        onClick={() => {
                                                            const token = localStorage.getItem('candidateToken');
                                                            if (!token) {
                                                                window.location.href = '/login';
                                                            } else {
                                                                alert('Application submitted successfully!');
                                                            }
                                                        }}
                                                    >
                                                        Apply Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                )) : (
                                    <Col xs={12} className="text-center">
                                        <p>No jobs available at the moment.</p>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    </div>
                </Container>
            </div>
            {/* JOB POST END */}

            {/* Recruiters START */}
            <div className="section-full p-t50 p-b30 site-bg-white animate-on-scroll">
                <Container className="py-5">
                    {/* title="" START*/}
                    <div className="section-head center wt-small-separator-outer mb-5">
                        <div className="wt-small-separator site-text-primary">
                            <div>Top Recruiters</div>
                        </div>
                        <h2 className="wt-title">Discover your next career move</h2>
                    </div>
                    {/* title="" END*/}

                    <div className="section-content">
                        <div className="twm-recruiters5-wrap">
                            <div className="twm-column-5 m-b30">
                                <ul>
                                    {/*1*/}
                                    <li>
                                        <div className="twm-recruiters5-box hover-card">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage
                                                        src="images/home-5/recruiters/1.jpg"
                                                        alt="#"
                                                    />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title">
                                                    <NavLink to={"#!"}>Tesla</NavLink>
                                                </h4>

                                                <div className="twm-job-address">
                                                    <i className="feather-map-pin" />
                                                    Sahakar Nagar, Bengaluru
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    {/*2*/}
                                    <li>
                                        <div className="twm-recruiters5-box hover-card">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage
                                                        src="images/home-5/recruiters/2.jpg"
                                                        alt="#"
                                                    />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title">
                                                    <NavLink to={"#!"}>Lamborghini</NavLink>
                                                </h4>

                                                <div className="twm-job-address">
                                                    <i className="feather-map-pin" />
                                                    Sahakar Nagar, Bengaluru
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    {/*3*/}
                                    <li>
                                        <div className="twm-recruiters5-box hover-card">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage
                                                        src="images/home-5/recruiters/5.jpg"
                                                        alt="#"
                                                    />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title">
                                                    <NavLink to={"#!"}>Elite</NavLink>
                                                </h4>

                                                <div className="twm-job-address">
                                                    <i className="feather-map-pin" />
                                                    Sahakar Nagar, Bengaluru
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    {/*4*/}
                                    <li>
                                        <div className="twm-recruiters5-box hover-card">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage
                                                        src="images/home-5/recruiters/8.jpg"
                                                        alt="#"
                                                    />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title">
                                                    <NavLink to={"#!"}>Cybercode</NavLink>
                                                </h4>

                                                <div className="twm-job-address">
                                                    <i className="feather-map-pin" />
                                                    Sahakar Nagar, Bengaluru
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    {/*5*/}
                                    <li>
                                        <div className="twm-recruiters5-box hover-card">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage
                                                        src="images/home-5/recruiters/10.jpg"
                                                        alt="#"
                                                    />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title">
                                                    <NavLink to={"#!"}>B.Live</NavLink>
                                                </h4>

                                                <div className="twm-job-address">
                                                    <i className="feather-map-pin" />
                                                    Sahakar Nagar, Bengaluru
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    {/*06*/}
                                    <li>
                                        <div className="twm-recruiters5-box hover-card">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage
                                                        src="images/home-5/recruiters/11.jpg"
                                                        alt="#"
                                                    />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title">
                                                    <NavLink to={"#!"}>Coffee shop</NavLink>
                                                </h4>

                                                <div className="twm-job-address">
                                                    <i className="feather-map-pin" />
                                                    Sahakar Nagar, Bengaluru
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    {/*12*/}
                                    <li>
                                        <div className="twm-recruiters5-box hover-card">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage
                                                        src="images/home-5/recruiters/12.jpg"
                                                        alt="#"
                                                    />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title">
                                                    <NavLink to={"#!"}>H Luxury</NavLink>
                                                </h4>

                                                <div className="twm-job-address">
                                                    <i className="feather-map-pin" />
                                                    Sahakar Nagar, Bengaluru
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    {/*14*/}
                                    <li>
                                        <div className="twm-recruiters5-box hover-card">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage
                                                        src="images/home-5/recruiters/14.jpg"
                                                        alt="#"
                                                    />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title">
                                                    <NavLink to={"#!"}>Birdwing</NavLink>
                                                </h4>

                                                <div className="twm-job-address">
                                                    <i className="feather-map-pin" />
                                                    Sahakar Nagar, Bengaluru
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="text-center m-b30">
                                <NavLink to={"#!"} className=" site-button">
                                    View All
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            {/* Recruiters END */}

            {/* TOP COMPANIES START */}
            <div className="section-full p-t60 p-b80 site-bg-white twm-companies-wrap twm-companies-wrap-h-page-7 pos-relative animate-on-scroll">
                <div className="twm-companies-wrap-bg-block" />
                {/* title="" START*/}
                <div className="section-head center wt-small-separator-outer content-white mb-5">
                    <div className="wt-small-separator site-text-primary">
                        <div>Top Companies</div>
                    </div>
                    <h2 className="wt-title">Get hired in top companies</h2>
                </div>
                {/* title="" END*/}

                <Container className="py-5">
                    <div className="twm-companies-h-page-7">
                        <div className="section-content">
                            <div className="owl-carousel home-client-carousel3 owl-btn-vertical-center">
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={"#!"}>
                                                <JobZImage src="images/client-logo2/w1.png" alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={"#!"}>
                                                <JobZImage src="images/client-logo2/w2.png" alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={"#!"}>
                                                <JobZImage src="images/client-logo2/w3.png" alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={"#!"}>
                                                <JobZImage src="images/client-logo2/w4.png" alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={"#!"}>
                                                <JobZImage src="images/client-logo2/w5.png" alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={"#!"}>
                                                <JobZImage src="images/client-logo2/w6.png" alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={"#!"}>
                                                <JobZImage src="images/client-logo2/w1.png" alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={"#!"}>
                                                <JobZImage src="images/client-logo2/w2.png" alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={"#!"}>
                                                <JobZImage src="images/client-logo2/w3.png" alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={"#!"}>
                                                <JobZImage src="images/client-logo2/w5.png" alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="twm-company-approch2-outer">
                            <div className="twm-company-approch2">
                                <Row className="mb-4">
                                    {/*block 1*/}
                                    <Col lg={4} md={4} className="mb-4">
                                        <div className="counter-outer-two">
                                            <div className="icon-content">
                                                <div className="tw-count-number site-text-primary">
                                                    <span className="counter">
                                                        <CountUp end={5} duration={10} />
                                                    </span>
                                                    M+
                                                </div>
                                                <p className="icon-content-info">
                                                    Million daily active users
                                                </p>
                                            </div>
                                        </div>
                                    </Col>

                                    {/*block 2*/}
                                    <Col lg={4} md={4} className="mb-4">
                                        <div className="counter-outer-two">
                                            <div className="icon-content">
                                                <div className="tw-count-number site-text-primary">
                                                    <span className="counter">
                                                        <CountUp end={9} duration={10} />
                                                    </span>
                                                    K+
                                                </div>
                                                <p className="icon-content-info">
                                                    Open job positions
                                                </p>
                                            </div>
                                        </div>
                                    </Col>

                                    {/*block 3*/}
                                    <Col lg={4} md={4} className="mb-4">
                                        <div className="counter-outer-two">
                                            <div className="icon-content">
                                                <div className="tw-count-number site-text-primary">
                                                    <span className="counter">
                                                        <CountUp end={2} duration={10} />
                                                    </span>
                                                    M+
                                                </div>
                                                <p className="icon-content-info">
                                                    Million stories shared
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            {/* TOP COMPANIES END */}
        </>
    );
}

export default Home16Page;