import JobZImage from "../../../../common/jobz-img";
import SectionEmployersCandidateSidebar from "../../sections/common/section-emp-can-sidebar";
import SectionShareProfile from "../../sections/common/section-share-profile";
import SectionOfficePhotos1 from "../../sections/common/section-office-photos1";
import SectionOfficeVideo1 from "../../sections/common/section-office-video1";
import SectionAvailableJobsList from "../../sections/employers/detail/section-available-jobs-list";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadScript } from "../../../../../globals/constants";

function EmployersDetail1Page() {
    const { id } = useParams();
    const [employer, setEmployer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        loadScript("js/custom.js");
        if (id) {
            fetchEmployerDetails();
        }
    }, [id]);

    const fetchEmployerDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/public/employers/${id}`);
            const data = await response.json();
            console.log('Employer API response:', data);
            if (data.success) {
                setEmployer(data.profile);
                console.log('Employer data set:', data.profile);
            } else {
                console.error('API error:', data.message);
            }
        } catch (error) {
            console.error('Error fetching employer details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5">Loading employer details...</div>;
    }

    if (!employer) {
        return <div className="text-center p-5">Employer not found</div>;
    }

    return (
			<>
				<div className="section-full  p-t120 p-b90 bg-white">
					<div className="container">
						<div className="section-content">
							<div className="row d-flex justify-content-center">
								<div className="col-lg-8 col-md-12">
									{/* Candidate detail START */}
									<div className="cabdidate-de-info">
										<div className="twm-employer-self-wrap">
											<div className="twm-employer-self-info">
												<div className="twm-employer-self-top">
													<div className="twm-media-bg">
														{employer.coverImage ? (
															<img src={employer.coverImage} alt="Company Cover" />
														) : (
															<JobZImage src="images/employer-bg.jpg" alt="#" />
														)}
													</div>
													<div className="twm-mid-content">
														<div className="twm-media">
															{employer.logo ? (
																<img src={employer.logo} alt="Company Logo" />
															) : (
																<JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
															)}
														</div>
														<h4 className="twm-job-title">
															{employer.employerId?.companyName || employer.companyName || 'Company Name'}
														</h4>
														<p className="twm-employer-address">
															<i className="feather-map-pin" />
															{employer.corporateAddress || employer.location || 'Location not specified'}
														</p>
														{/* <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-employer-websites site-text-primary">https://thewebmax.com</a> */}
														{/* <div className="twm-employer-self-bottom">
                                                        <a href="#" className="site-button outline-primary">Add Review</a>
                                                        <a href="#" className="site-button">Follow Us</a>
                                                    </div> */}
													</div>
												</div>
											</div>
										</div>

										{/* Tabs Navigation */}
										<ul className="nav nav-tabs mt-4" role="tablist">
											<li className="nav-item">
												<a
													className="nav-link active"
													data-bs-toggle="tab"
													href="#overview"
													role="tab"
												>
													Overview
												</a>
											</li>

											<li className="nav-item">
												<a
													className="nav-link"
													data-bs-toggle="tab"
													href="#jobs"
													role="tab"
												>
													Jobs
												</a>
											</li>
										</ul>

										{/* Tabs Content */}
										<div className="tab-content p-t20">
											<div
												className="tab-pane fade show active"
												id="overview"
												role="tabpanel"
											>
												<h4 className="twm-s-title">About Company</h4>
												<p>
													{employer.description || employer.companyDescription || 'No company description available.'}
												</p>

												<h4 className="twm-s-title">Why Join Us</h4>
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
														Partnering with product and engineering to translate
														business and user goals.
													</li>
												</ul>
											</div>

											<div className="tab-pane fade" id="jobs" role="tabpanel">
												<SectionAvailableJobsList employerId={id} />
											</div>
										</div>

										<SectionShareProfile />

										<div className="twm-two-part-section">
											<div className="row">
												<div className="col-lg-6 col-md-6">
													{/* <SectionOfficePhotos1 /> */}
												</div>
												<div className="col-lg-6 col-md-6">
													{/* <SectionOfficeVideo1 /> */}
												</div>
											</div>
										</div>

										{/* <SectionAvailableJobsList />  */}
									</div>
								</div>

								<div className="col-lg-4 col-md-12 rightSidebar">
									<SectionEmployersCandidateSidebar type="1" employer={employer} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
}

export default EmployersDetail1Page;