import { useEffect } from "react";
import { loadScript, publicUrlFor } from "../../../../../globals/constants";
import JobZImage from "../../../../common/jobz-img";
import CountUp from "react-countup";
import { publicUser } from "../../../../../globals/route-names";
import { NavLink } from "react-router-dom";

function Home1Page() {

    useEffect(() => {
        loadScript("js/custom.js");
    })

    return (
        <>
            {/*Banner Start*/}
            <div className="twm-home1-banner-section site-bg-gray bg-cover" style={{ backgroundImage: `url(${publicUrlFor("images/main-slider/slider1/bg1.jpg")})` }}>
                <div className="row">
                    {/*Left Section*/}
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <div className="twm-bnr-left-section">
                            <div className="twm-bnr-title-small">We Have <span className="site-text-primary">208,000+</span> Live Jobs</div>
                            <div className="twm-bnr-title-large">Find the <span className="site-text-primary">job</span> that fits your life</div>
                            <div className="twm-bnr-discription">Type your keyword, then click search to find your perfect job.</div>
                            <div className="twm-bnr-search-bar">
                                <form>
                                    <div className="row">
                                        {/*Title*/}
                                        <div className="form-group col-xl-3 col-lg-6 col-md-6">
                                            <label>What</label>
                                            <select className="wt-search-bar-select selectpicker" data-live-search="true" title="" id="j-Job_Title" data-bv-field="size">
                                                <option disabled value="" >Select Category</option>
                                                <option>Job Title</option>
                                                <option>Web Designer</option>
                                                <option>Developer</option>
                                                <option>Acountant</option>
                                            </select>
                                        </div>
                                        {/*All Category*/}
                                        <div className="form-group col-xl-3 col-lg-6 col-md-6">
                                            <label>Type</label>
                                            <select className="wt-search-bar-select selectpicker" data-live-search="true" title="" id="j-All_Category" data-bv-field="size">
                                                <option disabled value="" >Select Category</option>
                                                <option>All Category</option>
                                                <option>Web Designer</option>
                                                <option>Developer</option>
                                                <option>Acountant</option>
                                            </select>
                                        </div>
                                        {/*Location*/}
                                        <div className="form-group col-xl-3 col-lg-6 col-md-6">
                                            <label>Location</label>
                                            <div className="twm-inputicon-box">
                                                <input name="username" type="text" required className="form-control" placeholder="Search..." />
                                                <i className="twm-input-icon fas fa-map-marker-alt" />
                                            </div>
                                        </div>
                                        {/*Find job btn*/}
                                        <div className="form-group col-xl-3 col-lg-6 col-md-6">
                                            <button type="button" className="site-button">Find Job</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="twm-bnr-popular-search">
                                <span className="twm-title">Popular Searches:</span>
                                <NavLink to={publicUser.jobs.LIST}>Developer</NavLink> ,
                                <NavLink to={publicUser.jobs.LIST}>Designer</NavLink> ,
                                <NavLink to={publicUser.jobs.LIST}>Architect</NavLink> ,
                                <NavLink to={publicUser.jobs.LIST}>Engineer</NavLink> ...
                            </div>
                        </div>
                    </div>
                    {/*right Section*/}
                    <div className="col-xl-6 col-lg-6 col-md-12 twm-bnr-right-section">
                        <div className="twm-bnr-right-content">
                            <div className="twm-img-bg-circle-area">
                                <div className="twm-img-bg-circle1 rotate-center"><span /></div>
                                <div className="twm-img-bg-circle2 rotate-center-reverse"><span /></div>
                                <div className="twm-img-bg-circle3"><span /></div>
                            </div>
                            <div className="twm-bnr-right-carousel">
                                <div className="owl-carousel twm-h1-bnr-carousal">
                                    <div className="item">
                                        <div className="slide-img">
                                            <JobZImage src="images/main-slider/slider1/r-img1.png" alt="#" />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="slide-img">
                                            <div className="slide-img">
                                                <JobZImage src="images/main-slider/slider1/r-img2.png" alt="#" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="twm-bnr-blocks-position-wrap">
                                    {/*icon-block-1*/}
                                    <div className="twm-bnr-blocks twm-bnr-blocks-position-1">
                                        <div className="twm-icon">
                                            <JobZImage src="images/main-slider/slider1/icon-1.png" alt="" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="tw-count-number text-clr-sky">
                                                <span className="counter">
                                                    <CountUp end={12} duration={10} />
                                                </span>K+
                                            </div>
                                            <p className="icon-content-info">Companies Jobs</p>
                                        </div>
                                    </div>
                                    {/*icon-block-2*/}
                                    <div className="twm-bnr-blocks twm-bnr-blocks-position-2">
                                        <div className="twm-icon">
                                            <JobZImage src="images/main-slider/slider1/icon-2.png" alt="" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="tw-count-number text-clr-pink">
                                                <span className="counter">
                                                    <CountUp end={98} duration={10} />
                                                </span> +
                                            </div>
                                            <p className="icon-content-info">Job For Countries </p>
                                        </div>
                                    </div>
                                    {/*icon-block-3*/}
                                    <div className="twm-bnr-blocks-3 twm-bnr-blocks-position-3">
                                        <div className="twm-pics">
                                            <span><JobZImage src="images/main-slider/slider1/user/u-1.jpg" alt="" /></span>
                                            <span><JobZImage src="images/main-slider/slider1/user/u-2.jpg" alt="" /></span>
                                            <span><JobZImage src="images/main-slider/slider1/user/u-3.jpg" alt="" /></span>
                                            <span><JobZImage src="images/main-slider/slider1/user/u-4.jpg" alt="" /></span>
                                            <span><JobZImage src="images/main-slider/slider1/user/u-5.jpg" alt="" /></span>
                                            <span><JobZImage src="images/main-slider/slider1/user/u-6.jpg" alt="" /></span>
                                        </div>
                                        <div className="twm-content">
                                            <div className="tw-count-number text-clr-green">
                                                <span className="counter">
                                                    <CountUp end={3} duration={10} />
                                                </span>K+
                                            </div>
                                            <p className="icon-content-info">Jobs Done</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*Samll Ring Left*/}
                            <div className="twm-small-ring-l slide-top-animation" />
                            <div className="twm-small-ring-2 slide-top-animation" />
                        </div>
                    </div>
                </div>
                <div className="twm-gradient-text">
                    Jobs
                </div>
            </div>
            {/*Banner End*/}
            {/* HOW IT WORK SECTION START */}
            <div className="section-full p-t120 p-b90 site-bg-white twm-how-it-work-area">
                <div className="container">
                    {/* title="" START*/}
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>Working Process</div>
                        </div>
                        <h2 className="wt-title">How It Works</h2>
                    </div>
                    {/* title="" END*/}
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
                                        <h4 className="twm-title">Apply <br />
                                            For Dream Job</h4>
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
            {/* HOW IT WORK SECTION END */}
            {/* JOBS CATEGORIES SECTION START */}
            <div className="section-full p-t120 p-b90 site-bg-gray twm-job-categories-area">
                <div className="container">
                    <div className="wt-separator-two-part">
                        <div className="row wt-separator-two-part-row">
                            <div className="col-xl-5 col-lg-5 col-md-12 wt-separator-two-part-left">
                                {/* title="" START*/}
                                <div className="section-head left wt-small-separator-outer">
                                    <div className="wt-small-separator site-text-primary">
                                        <div>Jobs by Categories</div>
                                    </div>
                                    <h2 className="wt-title">Choose Your Desire Category</h2>
                                </div>
                                {/* title="" END*/}
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-12 wt-separator-two-part-right">
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry the standard dummy text ever since the  when an printer took.</p>
                            </div>
                        </div>
                    </div>
                    <div className="twm-job-categories-section">
                        <div className="job-categories-style1 m-b30">
                            <div className="owl-carousel job-categories-carousel owl-btn-left-bottom ">
                                {/* COLUMNS 1 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-dashboard" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">9,185 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Business Development</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 2 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-project-management" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">3,205 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Project Management</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 3 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-note" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">2,100 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Content Writer</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 4 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-customer-support" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">1,500 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Costomer Services</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 5 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-bars" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">9,185 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Accounting / Finance</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 6 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-user" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">3,205 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Marketing</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 7 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-computer" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">2,100 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Design &amp; Art</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 8 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-coding" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">1,500 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Web Development</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 9 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-hr" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">9,185 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Human Resource</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 10 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-healthcare" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">3,205 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Health and Care </NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 11 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-repair" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">2,100 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Automotive Jobs</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 12 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-teacher" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">1,500 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Teaching / Education</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 13 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-bank" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">9,185 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Banking</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 14 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-deal" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">3,205 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Sales Marketing</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 15 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-tray" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">2,100 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Restaurant / Food</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 16 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-tower" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">1,500 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Telecommunications</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 17 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-lotus" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">9,185 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Fitness Trainer</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 18 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-camera-tripod" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">3,205 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Photography</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 19 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-multimedia" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">2,100 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Audio + Music</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 20 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-contract" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">1,500 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Real estate</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 21 */}
                                <div className="item ">
                                    <div className="job-categories-block">
                                        <div className="twm-media">
                                            <div className="flaticon-engineer" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">9,185 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Construction</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right job-categories-btn">
                            <NavLink to={publicUser.jobs.GRID} className=" site-button">All Categories</NavLink>
                        </div>
                    </div>
                </div>
            </div>
            {/* JOBS CATEGORIES SECTION END */}
            {/* EXPLORE NEW LIFE START */}
            <div className="section-full p-t120 p-b120 twm-explore-area bg-cover " style={{ backgroundImage: `url(${publicUrlFor("images/background/bg-1.jpg")})` }}>
                <div className="container">
                    <div className="section-content">
                        <div className="row">
                            <div className="col-lg-4 col-md-12">
                                <div className="twm-explore-media-wrap">
                                    <div className="twm-media">
                                        <JobZImage src="images/gir-large.png" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-12">
                                <div className="twm-explore-content-outer">
                                    <div className="twm-explore-content">
                                        <div className="twm-l-line-1" />
                                        <div className="twm-l-line-2" />
                                        <div className="twm-r-circle-1" />
                                        <div className="twm-r-circle-2" />
                                        <div className="twm-title-small">Explore New Life</div>
                                        <div className="twm-title-large">
                                            <h2>Don’t just find. be found
                                                put your CV in front of
                                                great employers </h2>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry the standard dummy text ever since the  when an printer took.</p>
                                        </div>
                                        <div className="twm-upload-file">
                                            <button type="button" className="site-button">Upload Your Resume <i className="feather-upload" /></button>
                                        </div>
                                    </div>
                                    <div className="twm-bold-circle-right" />
                                    <div className="twm-bold-circle-left" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* EXPLORE NEW LIFE END */}
            {/* TOP COMPANIES START */}
            <div className="section-full p-t120  site-bg-white twm-companies-wrap">
                {/* title="" START*/}
                <div className="section-head center wt-small-separator-outer">
                    <div className="wt-small-separator site-text-primary">
                        <div>Top Companies</div>
                    </div>
                    <h2 className="wt-title">Get hired in top companies</h2>
                </div>
                {/* title="" END*/}
                <div className="container">
                    <div className="section-content">
                        <div className="owl-carousel home-client-carousel2 owl-btn-vertical-center">
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo/w1.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo/w2.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo/w3.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo/w4.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo/w5.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo/w6.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo/w1.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo/w2.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo/w3.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo/w5.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="twm-company-approch-outer">
                    <div className="twm-company-approch">
                        <div className="row">
                            {/*block 1*/}
                            <div className="col-lg-4 col-md-12">
                                <div className="counter-outer-two">
                                    <div className="icon-content">
                                        <div className="tw-count-number text-clr-sky">
                                            <span className="counter">
                                                <CountUp end={5} duration={10} />
                                            </span>M+</div>
                                        <p className="icon-content-info">Million daily active users</p>
                                    </div>
                                </div>
                            </div>
                            {/*block 2*/}
                            <div className="col-lg-4 col-md-12">
                                <div className="counter-outer-two">
                                    <div className="icon-content">
                                        <div className="tw-count-number text-clr-pink">
                                            <span className="counter">
                                                <CountUp end={9} duration={10} />
                                            </span>K+</div>
                                        <p className="icon-content-info">Open job positions</p>
                                    </div>
                                </div>
                            </div>
                            {/*block 3*/}
                            <div className="col-lg-4 col-md-12">
                                <div className="counter-outer-two">
                                    <div className="icon-content">
                                        <div className="tw-count-number text-clr-green">
                                            <span className="counter">
                                                <CountUp end={2} duration={10} />
                                            </span>M+</div>
                                        <p className="icon-content-info">Million stories shared</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* TOP COMPANIES END */}
            {/* JOB POST START */}
            <div className="section-full p-t120 p-b90 site-bg-light-purple twm-bg-ring-wrap">
                <div className="twm-bg-ring-right" />
                <div className="twm-bg-ring-left" />
                <div className="container">
                    {/* title="" START*/}
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>All Jobs Post</div>
                        </div>
                        <h2 className="wt-title">Find Your Career You Deserve it</h2>
                    </div>
                    {/* title="" END*/}
                    <div className="section-content">
                        <div className="twm-jobs-list-wrap">
                            <ul>
                                <li>
                                    <div className="twm-jobs-list-style1 mb-5">
                                        <div className="twm-media">
                                            <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                                        </div>
                                        <div className="twm-mid-content">
                                            <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
                                                <h4>Senior Web Designer , Developer  <span className="twm-job-post-duration">/ 1 days ago</span></h4>
                                            </NavLink>
                                            <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
                                            <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a>
                                        </div>
                                        <div className="twm-right-content">
                                            <div className="twm-jobs-category green"><span className="twm-bg-green">New</span></div>
                                            <div className="twm-jobs-amount">$2500 <span>/ Month</span></div>
                                            <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="twm-jobs-list-style1 mb-5">
                                        <div className="twm-media">
                                            <JobZImage src="images/jobs-company/pic2.jpg" alt="#" />
                                        </div>
                                        <div className="twm-mid-content">
                                            <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
                                                <h4>Need Senior Rolling Stock Technician<span className="twm-job-post-duration">/ 15 days ago</span></h4>
                                            </NavLink>
                                            <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
                                            <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a>
                                        </div>
                                        <div className="twm-right-content">
                                            <div className="twm-jobs-category green"><span className="twm-bg-brown">Intership</span></div>
                                            <div className="twm-jobs-amount">$2000<span>/ Month</span></div>
                                            <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="twm-jobs-list-style1 mb-5">
                                        <div className="twm-media">
                                            <JobZImage src="images/jobs-company/pic3.jpg" alt="#" />
                                        </div>
                                        <div className="twm-mid-content">
                                            <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
                                                <h4 className="twm-job-title">IT Department Manager &amp; Blogger-Entrepenour  <span className="twm-job-post-duration">/ 6 Month ago</span></h4>
                                            </NavLink>
                                            <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
                                            <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a>
                                        </div>
                                        <div className="twm-right-content">
                                            <div className="twm-jobs-category green"><span className="twm-bg-purple">Fulltime</span></div>
                                            <div className="twm-jobs-amount">$1500 <span>/ Month</span></div>
                                            <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="twm-jobs-list-style1 mb-5">
                                        <div className="twm-media">
                                            <JobZImage src="images/jobs-company/pic4.jpg" alt="#" />
                                        </div>
                                        <div className="twm-mid-content">
                                            <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
                                                <h4 className="twm-job-title">Art Production Specialist   <span className="twm-job-post-duration">/ 2 days ago</span></h4>
                                            </NavLink>
                                            <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
                                            <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a>
                                        </div>
                                        <div className="twm-right-content">
                                            <div className="twm-jobs-category green"><span className="twm-bg-sky">Freelancer</span></div>
                                            <div className="twm-jobs-amount">$1200<span>/ Month</span></div>
                                            <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="twm-jobs-list-style1 mb-5">
                                        <div className="twm-media">
                                            <JobZImage src="images/jobs-company/pic5.jpg" alt="#" />
                                        </div>
                                        <div className="twm-mid-content">
                                            <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
                                                <h4 className="twm-job-title">Recreation &amp; Fitness Worker   <span className="twm-job-post-duration">/ 1 days ago</span></h4>
                                            </NavLink>
                                            <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
                                            <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a>
                                        </div>
                                        <div className="twm-right-content">
                                            <div className="twm-jobs-category green"><span className="twm-bg-golden">Temporary</span></div>
                                            <div className="twm-jobs-amount">$1700 <span>/ Month</span></div>
                                            <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div className="text-center m-b30">
                                <NavLink to={publicUser.jobs.LIST} className=" site-button">Browse All Jobs</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* JOB POST END */}
            {/* TESTIMONIAL SECTION START */}
            <div className="section-full p-t120 p-b90 site-bg-white twm-testimonial-1-area">
                <div className="container">
                    <div className="wt-separator-two-part">
                        <div className="row wt-separator-two-part-row">
                            <div className="col-xl-5 col-lg-6 col-md-12 wt-separator-two-part-left">
                                {/* title="" START*/}
                                <div className="section-head left wt-small-separator-outer">
                                    <div className="wt-small-separator site-text-primary">
                                        <div>Clients Testimonials</div>
                                    </div>
                                    <h2 className="wt-title">What Our Customers Say About Us</h2>
                                </div>
                                {/* title="" END*/}
                            </div>
                        </div>
                    </div>
                    <div className="section-content">
                        <div className="owl-carousel twm-testimonial-1-carousel owl-btn-bottom-center ">
                            {/* COLUMNS 1 */}
                            <div className="item ">
                                <div className="twm-testimonial-1">
                                    <div className="twm-testimonial-1-content">
                                        <div className="twm-testi-media">
                                            <JobZImage src="images/testimonials/pic-1.png" alt="#" />
                                        </div>
                                        <div className="twm-testi-content">
                                            <div className="twm-quote">
                                                <JobZImage src="images/quote-dark.png" alt="" />
                                            </div>
                                            <div className="twm-testi-info">I just got a job that I applied for via careerfy! I used the site all the time during my job hunt.</div>
                                            <div className="twm-testi-detail">
                                                <div className="twm-testi-name">Nikola Tesla</div>
                                                <div className="twm-testi-position">Accountant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* COLUMNS 2 */}
                            <div className="item ">
                                <div className="twm-testimonial-1">
                                    <div className="twm-testimonial-1-content">
                                        <div className="twm-testi-media">
                                            <JobZImage src="images/testimonials/pic-2.png" alt="#" />
                                        </div>
                                        <div className="twm-testi-content">
                                            <div className="twm-quote">
                                                <JobZImage src="images/quote-dark.png" alt="" />
                                            </div>
                                            <div className="twm-testi-info">I just got a job that I applied for via careerfy! I used the site all the time during my job hunt.</div>
                                            <div className="twm-testi-detail">
                                                <div className="twm-testi-name">Nikola Tesla</div>
                                                <div className="twm-testi-position">Accountant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* COLUMNS 3 */}
                            <div className="item ">
                                <div className="twm-testimonial-1">
                                    <div className="twm-testimonial-1-content">
                                        <div className="twm-testi-media">
                                            <JobZImage src="images/testimonials/pic-3.png" alt="#" />
                                        </div>
                                        <div className="twm-testi-content">
                                            <div className="twm-quote">
                                                <JobZImage src="images/quote-dark.png" alt="" />
                                            </div>
                                            <div className="twm-testi-info">I just got a job that I applied for via careerfy! I used the site all the time during my job hunt.</div>
                                            <div className="twm-testi-detail">
                                                <div className="twm-testi-name">Nikola Tesla</div>
                                                <div className="twm-testi-position">Accountant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* COLUMNS 4 */}
                            <div className="item ">
                                <div className="twm-testimonial-1">
                                    <div className="twm-testimonial-1-content">
                                        <div className="twm-testi-media">
                                            <JobZImage src="images/testimonials/pic-2.png" alt="#" />
                                        </div>
                                        <div className="twm-testi-content">
                                            <div className="twm-quote">
                                                <JobZImage src="images/quote-dark.png" alt="" />
                                            </div>
                                            <div className="twm-testi-info">I just got a job that I applied for via careerfy! I used the site all the time during my job hunt.</div>
                                            <div className="twm-testi-detail">
                                                <div className="twm-testi-name">Nikola Tesla</div>
                                                <div className="twm-testi-position">Accountant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* COLUMNS 5 */}
                            <div className="item ">
                                <div className="twm-testimonial-1">
                                    <div className="twm-testimonial-1-content">
                                        <div className="twm-testi-media">
                                            <JobZImage src="images/testimonials/pic-1.png" alt="#" />
                                        </div>
                                        <div className="twm-testi-content">
                                            <div className="twm-quote">
                                                <JobZImage src="images/quote-dark.png" alt="" />
                                            </div>
                                            <div className="twm-testi-info">I just got a job that I applied for via careerfy! I used the site all the time during my job hunt.</div>
                                            <div className="twm-testi-detail">
                                                <div className="twm-testi-name">Nikola Tesla</div>
                                                <div className="twm-testi-position">Accountant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* TESTIMONIAL SECTION END */}
            {/* OUR BLOG START */}
            <div className="section-full p-t120 p-b90 site-bg-gray">
                <div className="container">
                    {/* title="" START*/}
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>Our Blogs</div>
                        </div>
                        <h2 className="wt-title">Latest Article</h2>
                    </div>
                    {/* title="" END*/}
                    <div className="section-content">
                        <div className="twm-blog-post-1-outer-wrap">
                            <div className="owl-carousel twm-la-home-blog owl-btn-bottom-center">
                                <div className="item">
                                    {/*Block one*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg1.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>Mark Petter</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>How to convince recruiters and get your dream job</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    {/*Block two*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg2.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>David Wish</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>5 things to know about the March
                                                        2023 jobs report</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    {/*Block three*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg3.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>Mike Doe</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>Job Board is the most important
                                                        sector in the world</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    {/*Block Four*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg1.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>Mark Petter</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>How to convince recruiters and get your dream job</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    {/*Block Five*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg2.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>David Wish</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>5 things to know about the March
                                                        2023 jobs report</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    {/*Block Six*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg3.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>Mike Doe</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>Job Board is the most important
                                                        sector in the world</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* OUR BLOG END */}
        </>
    )
}

export default Home1Page;