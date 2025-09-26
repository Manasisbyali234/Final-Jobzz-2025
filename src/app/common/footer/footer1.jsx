import { publicUrlFor } from "../../../globals/constants";
import JobZImage from "../jobz-img";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../globals/route-names";

function Footer1() {
    return (
			<>
				<footer
					className="footer-light ftr-light-with-bg site-bg-cover"
					style={{
						backgroundImage: `url(${publicUrlFor("images/ftr-bg.jpg")})`,
						fontFamily: '"Plus Jakarta Sans", sans-serif'
					}}
				>
					<div className="container">
						{/* FOOTER BLOCKES START */}
						<div className="footer-top">
							<div className="row">
								<div className="col-lg-4 col-md-12">
									<div className="widget widget_about">
										<div className="logo-footer clearfix">
											<NavLink to={publicUser.INITIAL}>
												<JobZImage
													id="skin_footer_light_logo"
													src="images/logo-light-2.png"
													alt=""
												/>
											</NavLink>
										</div>
										<p>
											A smarter way to search, apply, and succeed. Explore
											thousands of opportunities tailored to your goals.
										</p>
										<ul className="ftr-list">
											<li>
												<p>
													<span>Address :</span> Bangalore, 560092{" "}
												</p>
											</li>
											<li>
												<p>
													<span>Email :</span> example@metromindz.com
												</p>
											</li>
											<li>
												<p>
													<span>Call :</span> (+91) 9876543210
												</p>
											</li>
										</ul>
									</div>
								</div>

								<div className="col-lg-8 col-md-12">
									<div className="row">
										<div className="col-lg-6 col-md-6 col-sm-6">
											<div className="widget widget_services ftr-list-center">
												<h3 className="widget-title">Quick Links</h3>
												<ul>
													<li>
														<NavLink to={publicUser.pages.LOGIN}>Home</NavLink>
													</li>

													<li>
														<NavLink to={publicUser.candidate.GRID}>
															Jobs
														</NavLink>
													</li>

													<li>
														<NavLink to={publicUser.blog.LIST}>
															Employers
														</NavLink>
													</li>

													<li>
														<NavLink to={publicUser.blog.DETAIL}>
															Contact Us
														</NavLink>
													</li>
												</ul>
											</div>
										</div>

										<div className="col-lg-6 col-md-6 col-sm-6">
											<div className="widget widget_services ftr-list-center">
												<h3 className="widget-title">Helpful Links</h3>
												<ul>
													<li>
														<NavLink to={publicUser.blog.GRID1}>
															Candidate Dashboard
														</NavLink>
													</li>

													<li>
														<NavLink to={publicUser.pages.CONTACT}>
															Employers Dashboard
														</NavLink>
													</li>

													<li>
														<NavLink to={publicUser.jobs.LIST}>
															Terms & Conditions
														</NavLink>
													</li>

													<li>
														<NavLink to={publicUser.jobs.DETAIL1}>
															Privacy Policy
														</NavLink>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* FOOTER COPYRIGHT */}
						<div className="footer-bottom">
							<div className="footer-bottom-info">
								<div className="footer-copy-right">
									<span className="copyrights-text">
										Copyright © 2025 by Tale Global. All Rights Reserved.
									</span>
								</div>

								<ul className="social-icons">
									<li>
										<a href="https://www.facebook.com/" style={{color: '#f97316', fontSize: '18px', textDecoration: 'none', display: 'inline-block', width: '35px', height: '35px', lineHeight: '35px', textAlign: 'center', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.1)', transition: 'all 0.3s ease'}}>f</a>
									</li>

									<li>
										<a href="https://www.twitter.com/" style={{color: '#f97316', fontSize: '18px', textDecoration: 'none', display: 'inline-block', width: '35px', height: '35px', lineHeight: '35px', textAlign: 'center', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.1)', transition: 'all 0.3s ease'}}>t</a>
									</li>

									<li>
										<a href="https://www.instagram.com/" style={{color: '#f97316', fontSize: '18px', textDecoration: 'none', display: 'inline-block', width: '35px', height: '35px', lineHeight: '35px', textAlign: 'center', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.1)', transition: 'all 0.3s ease'}}>i</a>
									</li>

									<li>
										<a href="mailto:example@metromindz.com" style={{color: '#f97316', fontSize: '18px', textDecoration: 'none', display: 'inline-block', width: '35px', height: '35px', lineHeight: '35px', textAlign: 'center', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.1)', transition: 'all 0.3s ease'}}>@</a>
									</li>

									<li>
										<a href="https://www.youtube.com/" style={{color: '#f97316', fontSize: '18px', textDecoration: 'none', display: 'inline-block', width: '35px', height: '35px', lineHeight: '35px', textAlign: 'center', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.1)', transition: 'all 0.3s ease'}}>y</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</footer>
			</>
		);
}

export default Footer1;