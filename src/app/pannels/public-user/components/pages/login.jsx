import { NavLink, useNavigate, useLocation } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";
import { canRoute, candidate, empRoute, employer, placementRoute, placement, publicUser } from "../../../../../globals/route-names";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { loadScript, publicUrlFor } from "../../../../../globals/constants";
import CountUp from "react-countup";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [canusername, setCanUsername] = useState('guest');
    const [empusername, setEmpUsername] = useState('admin');
    const [placementusername, setPlacementUsername] = useState('');
    const [canpassword, setCanPassword] = useState('12345');
    const [emppassword, setEmpPassword] = useState('12345');
    const [placementpassword, setPlacementPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        loadScript("js/custom.js");
        fetchJobs();
        fetchCategories();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/public/jobs?limit=3');
            const data = await response.json();
            if (data.success) {
                setJobs(data.jobs.slice(0, 3));
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/public/jobs');
            const data = await response.json();
            if (data.success) {
                const categoryCount = {};
                data.jobs.forEach(job => {
                    const category = job.category || 'Other';
                    categoryCount[category] = (categoryCount[category] || 0) + 1;
                });
                
                const categoryList = Object.entries(categoryCount).map(([name, count]) => ({
                    name,
                    count,
                    icon: getCategoryIcon(name)
                })).slice(0, 6);
                
                setCategories(categoryList);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'IT': 'flaticon-coding',
            'Design': 'flaticon-computer',
            'Marketing': 'flaticon-user',
            'Content': 'flaticon-note',
            'Finance': 'flaticon-bars',
            'HR': 'flaticon-hr',
            'Healthcare': 'flaticon-healthcare',
            'Other': 'flaticon-dashboard'
        };
        return icons[category] || 'flaticon-dashboard';
    };

    const handleCandidateLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login({
            email: canusername,
            password: canpassword
        }, 'candidate');
        
        setLoading(false);
        
        if (result.success) {
            // Check if there's a redirect URL stored
            const redirectUrl = localStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                localStorage.removeItem('redirectAfterLogin');
                navigate(redirectUrl, { replace: true });
            } else {
                navigate('/candidate/dashboard', { replace: true });
            }
        } else {
            setError(result.message || 'Login failed');
        }
    }

    const handleEmployerLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login({
            email: empusername,
            password: emppassword
        }, 'employer');
        
        setLoading(false);
        
        if (result.success) {
            // Check if there's a redirect URL stored
            const redirectUrl = localStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                localStorage.removeItem('redirectAfterLogin');
                navigate(redirectUrl, { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } else {
            setError(result.message || 'Login failed');
        }
    }

    const handlePlacementLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login({
            email: placementusername,
            password: placementpassword
        }, 'placement');
        
        setLoading(false);
        
        if (result.success) {
            // Check if there's a redirect URL stored
            const redirectUrl = localStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                localStorage.removeItem('redirectAfterLogin');
                navigate(redirectUrl, { replace: true });
            } else {
                navigate(placementRoute(placement.DASHBOARD), { replace: true });
            }
        } else {
            setError(result.message || 'Login failed');
        }
    }

    return (
        <>
            <div className="section-full site-bg-white">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-8 col-lg-6 col-md-5 twm-log-reg-media-wrap">
                            <div className="twm-log-reg-media">
                                <div className="twm-l-media">
                                    <JobZImage src="images/login-bg.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-7">
                            <div className="twm-log-reg-form-wrap">
                                <div className="twm-log-reg-logo-head">
                                    <NavLink to={publicUser.HOME1}>
                                        <JobZImage src="images/logo-dark.png" alt="" className="logo" />
                                    </NavLink>
                                </div>
                                <div className="twm-log-reg-inner">
                                    <div className="twm-log-reg-head">
                                        <div className="twm-log-reg-logo">
                                            <span className="log-reg-form-title">Log In</span>
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    <div className="twm-tabs-style-2">
                                        <ul className="nav nav-tabs" id="myTab2" role="tablist">
                                            {/*Login Candidate*/}
                                            <li className="nav-item">
                                                <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#twm-login-candidate" type="button"><i className="fas fa-user-tie" />Candidate</button>
                                            </li>
                                            {/*Login Employer*/}
                                            <li className="nav-item">
                                                <button className="nav-link" data-bs-toggle="tab" data-bs-target="#twm-login-Employer" type="button"><i className="fas fa-building" />Employer</button>
                                            </li>
                                            {/*Login Placement*/}
                                            <li className="nav-item">
                                                <button className="nav-link" data-bs-toggle="tab" data-bs-target="#twm-login-Placement" type="button"><i className="fas fa-graduation-cap" />Placement</button>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="myTab2Content">
                                            {/*Login Candidate Content*/}
                                            <form onSubmit={handleCandidateLogin} className="tab-pane fade show active" id="twm-login-candidate">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="form-group mb-3">
                                                            <input name="email"
                                                                type="email"
                                                                required
                                                                className="form-control"
                                                                placeholder="Email*"
                                                                value={canusername}
                                                                onChange={(event) => {
                                                                    setCanUsername(event.target.value);
                                                                }} />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="form-group mb-3">
                                                            <input
                                                                name="password"
                                                                type="password"
                                                                className="form-control"
                                                                required
                                                                placeholder="Password*"
                                                                value={canpassword}
                                                                onChange={(event) => {
                                                                    setCanPassword(event.target.value);
                                                                }} />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="twm-forgot-wrap">
                                                            <div className="form-group mb-3">
                                                                <div className="form-check">
                                                                    <input type="checkbox" className="form-check-input" id="Password4" />
                                                                    <label className="form-check-label rem-forgot" htmlFor="Password4">Remember me <a href="#" className="site-text-primary">Forgot Password</a></label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="site-button" disabled={loading}>
                                                                {loading ? 'Logging in...' : 'Log in'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <span className="center-text-or">Or</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="log_with_facebook">
                                                                <i className="fab fa-facebook" />
                                                                Continue with Facebook
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="log_with_google">
                                                                <JobZImage src="images/google-icon.png" alt="" />
                                                                Continue with Google
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            {/*Login Employer Content*/}
                                            <form onSubmit={handleEmployerLogin} className="tab-pane fade" id="twm-login-Employer">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="form-group mb-3">
                                                            <input
                                                                name="username"
                                                                type="text"
                                                                required
                                                                className="form-control"
                                                                placeholder="Usearname*"
                                                                value={empusername}
                                                                onChange={(event) => {
                                                                    setEmpUsername(event.target.value);
                                                                }} />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="form-group mb-3">
                                                            <input
                                                                name="password"
                                                                type="password"
                                                                className="form-control"
                                                                required
                                                                placeholder="Password*"
                                                                value={emppassword}
                                                                onChange={(event) => {
                                                                    setEmpPassword(event.target.value);
                                                                }} />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="twm-forgot-wrap">
                                                            <div className="form-group mb-3">
                                                                <div className="form-check">
                                                                    <input type="checkbox" className="form-check-input" id="Password4" />
                                                                    <label className="form-check-label rem-forgot" htmlFor="Password4">Remember me <a href="#" className="site-text-primary">Forgot Password</a></label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="site-button" disabled={loading}>
                                                                {loading ? 'Logging in...' : 'Log in'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <span className="center-text-or">Or</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="log_with_facebook">
                                                                <i className="fab fa-facebook" />
                                                                Continue with Facebook
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="log_with_google">
                                                                <JobZImage src="images/google-icon.png" alt="" />
                                                                Continue with Google
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            {/*Login Placement Content*/}
                                            <form onSubmit={handlePlacementLogin} className="tab-pane fade" id="twm-login-Placement">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="form-group mb-3">
                                                            <input
                                                                name="username"
                                                                type="text"
                                                                required
                                                                className="form-control"
                                                                placeholder="Email*"
                                                                value={placementusername}
                                                                onChange={(event) => {
                                                                    setPlacementUsername(event.target.value);
                                                                }} />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="form-group mb-3">
                                                            <input
                                                                name="password"
                                                                type="password"
                                                                className="form-control"
                                                                required
                                                                placeholder="Password*"
                                                                value={placementpassword}
                                                                onChange={(event) => {
                                                                    setPlacementPassword(event.target.value);
                                                                }} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="site-button" disabled={loading}>
                                                                {loading ? 'Logging in...' : 'Log in'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <span className="center-text-or">Or</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="log_with_facebook">
                                                                <i className="fab fa-facebook" />
                                                                Continue with Facebook
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="log_with_google">
                                                                <JobZImage src="images/google-icon.png" alt="" />
                                                                Continue with Google
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="section-full p-t120 p-b90 site-bg-white twm-how-it-work-area">
                <div className="container">
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>Working Process</div>
                        </div>
                        <h2 className="wt-title">How It Works</h2>
                    </div>
                    <div className="twm-how-it-work-section">
                        <div className="row">
                            <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="twm-w-process-steps">
                                    <span className="twm-large-number">01</span>
                                    <div className="twm-w-pro-top bg-clr-sky">
                                        <div className="twm-media">
                                            <span><JobZImage src="images/work-process/icon1.png" alt="icon1" /></span>
                                        </div>
                                        <h4 className="twm-title">Register<br />Your Account</h4>
                                    </div>
                                    <p>You need to create an account to find the best and preferred job.</p>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="twm-w-process-steps">
                                    <span className="twm-large-number">02</span>
                                    <div className="twm-w-pro-top bg-clr-pink">
                                        <div className="twm-media">
                                            <span><JobZImage src="images/work-process/icon2.png" alt="icon1" /></span>
                                        </div>
                                        <h4 className="twm-title">Apply <br />For Dream Job</h4>
                                    </div>
                                    <p>You need to create an account to find the best and preferred job.</p>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="twm-w-process-steps">
                                    <span className="twm-large-number">03</span>
                                    <div className="twm-w-pro-top bg-clr-green">
                                        <div className="twm-media">
                                            <span><JobZImage src="images/work-process/icon3.png" alt="icon1" /></span>
                                        </div>
                                        <h4 className="twm-title">Upload <br />Your Resume</h4>
                                    </div>
                                    <p>You need to create an account to find the best and preferred job.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Categories Section */}
            <div className="section-full p-t120 p-b90 site-bg-gray twm-job-categories-area">
                <div className="container">
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>Jobs by Categories</div>
                        </div>
                        <h2 className="wt-title">Choose Your Desire Category</h2>
                    </div>
                    <div className="twm-job-categories-section">
                        <div className="row">
                            {categories.map((category, index) => (
                                <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className={category.icon} />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">{category.count}+ Jobs</div>
                                            <NavLink to={`${publicUser.jobs.GRID}?category=${category.name}`}>{category.name}</NavLink>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Jobs Section */}
            <div className="section-full p-t120 p-b90 site-bg-white">
                <div className="container">
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>Featured Jobs</div>
                        </div>
                        <h2 className="wt-title">Find Your Career You Deserve it</h2>
                    </div>
                    <div className="section-content">
                        <div className="twm-jobs-list-wrap">
                            <ul>
                                {jobs.map((job) => (
                                    <li key={job._id}>
                                        <div className="twm-jobs-list-style1 mb-5">
                                            <div className="twm-media">
                                                {job.employerProfile?.logo ? (
                                                    <img src={job.employerProfile.logo} alt="Company Logo" style={{width: '60px', height: '60px', objectFit: 'cover'}} />
                                                ) : (
                                                    <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                                                )}
                                            </div>
                                            <div className="twm-mid-content">
                                                <NavLink to={`${publicUser.jobs.DETAIL1}/${job._id}`} className="twm-job-title">
                                                    <h4>{job.title}<span className="twm-job-post-duration">/ {new Date(job.createdAt).toLocaleDateString()}</span></h4>
                                                </NavLink>
                                                <p className="twm-job-address">{job.location}</p>
                                                {job.companyName && (
                                                    <a href="#" className="twm-job-websites site-text-primary">{job.companyName}</a>
                                                )}
                                            </div>
                                            <div className="twm-right-content">
                                                <div className="twm-jobs-category green">
                                                    <span className="twm-bg-green">{job.jobType || 'Full-time'}</span>
                                                </div>
                                                <div className="twm-jobs-amount">
                                                    {job.salary ? `₹${job.salary}` : '₹4.25-5.5'} <span>LPA</span>
                                                </div>
                                                <NavLink to={`${publicUser.jobs.DETAIL1}/${job._id}`} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-center m-b30">
                                <NavLink to={publicUser.jobs.LIST} className="site-button">Browse All Jobs</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage;