import React, { useState } from 'react';

function SignUpPopup() {
    const [candidateData, setCandidateData] = useState({
        username: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    
    const [employerData, setEmployerData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        employerCategory: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleCandidateChange = (e) => {
        const { name, value } = e.target;
        setCandidateData({ ...candidateData, [name]: value });
        
        if (name === 'confirmPassword' || name === 'password') {
            const password = name === 'password' ? value : candidateData.password;
            const confirmPassword = name === 'confirmPassword' ? value : candidateData.confirmPassword;
            
            if (confirmPassword && password !== confirmPassword) {
                setPasswordError('Passwords do not match');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleEmployerChange = (e) => {
        const { name, value } = e.target;
        setEmployerData({ ...employerData, [name]: value });
        
        if (name === 'confirmPassword' || name === 'password') {
            const password = name === 'password' ? value : employerData.password;
            const confirmPassword = name === 'confirmPassword' ? value : employerData.confirmPassword;
            
            if (confirmPassword && password !== confirmPassword) {
                setPasswordError('Passwords do not match');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleCandidateSubmit = async (e) => {
        e.preventDefault();
        if (candidateData.password !== candidateData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('http://localhost:5000/api/candidate/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: candidateData.username,
                    email: candidateData.email,
                    phone: candidateData.mobile,
                    password: candidateData.password,
                    confirmPassword: candidateData.confirmPassword
                })
            });
            
            const data = await response.json();
            if (data.success) {
                alert('Registration successful! Please login.');
                setCandidateData({ username: '', email: '', mobile: '', password: '', confirmPassword: '' });
            } else {
                setError(data.message || 'Registration failed');
                console.error('Registration error:', data);
                console.log('Error details:', JSON.stringify(data, null, 2));
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Network error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEmployerSubmit = async (e) => {
        e.preventDefault();
        if (employerData.password !== employerData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('http://localhost:5000/api/employer/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: employerData.name,
                    email: employerData.email,
                    phone: employerData.mobile,
                    password: employerData.password,
                    confirmPassword: employerData.confirmPassword,
                    companyName: employerData.name,
                    employerCategory: employerData.employerCategory,
                    employerType: employerData.employerCategory === 'consultancy' ? 'consultant' : 'company'
                })
            });
            
            const data = await response.json();
            if (data.success) {
                alert('Registration successful! Please login.');
                setEmployerData({ name: '', email: '', mobile: '', password: '', confirmPassword: '', employerCategory: '' });
            } else {
                setError(data.message || 'Registration failed');
                console.error('Registration error:', data);
                console.log('Error details:', JSON.stringify(data, null, 2));
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Network error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
			<>
				<div
					className="modal fade twm-sign-up"
					id="sign_up_popup"
					aria-hidden="true"
					aria-labelledby="sign_up_popupLabel"
					tabIndex={-1}
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h2 className="modal-title" id="sign_up_popupLabel">
									Sign Up
								</h2>
								<p>
									Sign Up and get access to all the features of TaleGlobal
								</p>
								<button
									type="button"
									className="btn-close"
									data-bs-dismiss="modal"
									aria-label="Close"
								/>
							</div>

							<div className="modal-body">
								<div className="twm-tabs-style-2">
									<ul className="nav nav-tabs" id="myTab" role="tablist">
										<li className="nav-item" role="presentation">
											<button
												className="nav-link active"
												data-bs-toggle="tab"
												data-bs-target="#sign-candidate"
												type="button"
											>
												<i className="fas fa-user-tie" />
												Candidate
											</button>
										</li>

										<li className="nav-item" role="presentation">
											<button
												className="nav-link"
												data-bs-toggle="tab"
												data-bs-target="#sign-Employer"
												type="button"
											>
												<i className="fas fa-building" />
												Employer
											</button>
										</li>
									</ul>

									<div className="tab-content" id="myTabContent">
										<div
											className="tab-pane fade show active"
											id="sign-candidate"
										>
											<form onSubmit={handleCandidateSubmit}>
											<div className="row">
												{error && (
													<div className="col-12">
														<div className="alert alert-danger">{error}</div>
													</div>
												)}
												<div className="col-lg-12">
													<div className="form-group mb-3">
														<input
															name="username"
															type="text"
															className="form-control"
															placeholder="Name*"
															value={candidateData.username}
															onChange={handleCandidateChange}
															required
														/>
													</div>
												</div>
												<div className="col-lg-12">
													<div className="form-group mb-3">
														<input
															name="email"
															type="email"
															className="form-control"
															placeholder="Email*"
															value={candidateData.email}
															onChange={handleCandidateChange}
															required
														/>
													</div>
												</div>

												<div className="col-lg-12">
													<div className="form-group mb-3">
														<input
															name="mobile"
															type="tel"
															className="form-control"
															placeholder="Mobile No.*"
															value={candidateData.mobile}
															onChange={handleCandidateChange}
															required
														/>
													</div>
												</div>

												<div className="col-lg-12">
													<div className="form-group mb-3">
														<input
															name="password"
															type="password"
															className="form-control"
															placeholder="Password*"
															value={candidateData.password}
															onChange={handleCandidateChange}
															required
														/>
													</div>
												</div>

												<div className="col-lg-12">
													<div className="form-group mb-3">
														<input
															name="confirmPassword"
															type="password"
															className="form-control"
															placeholder="Confirm Password*"
															value={candidateData.confirmPassword}
															onChange={handleCandidateChange}
															required
														/>
														{passwordError && <small className="text-danger">{passwordError}</small>}
													</div>
												</div>
												
												<div className="col-lg-12">
													<div className="form-group mb-3">
														<div className=" form-check">
															<input
																type="checkbox"
																className="form-check-input"
																id="agree1"
																required
															/>
															<label
																className="form-check-label"
																htmlFor="agree1"
															>
																I agree to the{" "}
																<a href="#">Terms and conditions</a>
															</label>
															<p>
																Already registered?
																<button
																	type="button"
																	className="twm-backto-login"
																	data-bs-target="#sign_up_popup2"
																	data-bs-toggle="modal"
																	data-bs-dismiss="modal"
																>
																	Sign in
																</button>
															</p>
														</div>
													</div>
												</div>
												<div className="col-md-12">
													<button type="submit" className="site-button" disabled={loading || passwordError}>
														{loading ? 'Signing Up...' : 'Sign Up'}
													</button>
												</div>
											</div>
											</form>
										</div>

										<div className="tab-pane fade" id="sign-Employer">
											<form onSubmit={handleEmployerSubmit}>
											<div className="row">
												{error && (
													<div className="col-12">
														<div className="alert alert-danger">{error}</div>
													</div>
												)}
												<div className="col-lg-12">
													<div className="form-group mb-3">
														<select
															name="employerCategory"
															className="form-control"
															value={employerData.employerCategory}
															onChange={handleEmployerChange}
															required
														>
															<option value="">Select Category*</option>
															<option value="company">Company</option>
															<option value="consultancy">Consultancy</option>
														</select>
													</div>
												</div>
												<div className="col-lg-12">
													<div className="form-group mb-3">
														<input
															name="name"
															type="text"
															className="form-control"
															placeholder="Name*"
															value={employerData.name}
															onChange={handleEmployerChange}
															required
														/>
													</div>
												</div>
												<div className="col-lg-12">
													<div className="form-group mb-3">
														<input
															name="email"
															type="email"
															className="form-control"
															placeholder="Email*"
															value={employerData.email}
															onChange={handleEmployerChange}
															required
														/>
													</div>
												</div>

												<div className="col-lg-12">
													<div className="form-group mb-3">
														<input
															name="mobile"
															type="tel"
															className="form-control"
															placeholder="Mobile No.*"
															value={employerData.mobile}
															onChange={handleEmployerChange}
															required
														/>
													</div>
												</div>

												<div className="col-lg-12">
													<div className="form-group mb-3">
														<input
															name="password"
															type="password"
															className="form-control"
															placeholder="Password*"
															value={employerData.password}
															onChange={handleEmployerChange}
															required
														/>
													</div>
												</div>

												<div className="col-lg-12">
													<div className="form-group mb-3">
														<input
															name="confirmPassword"
															type="password"
															className="form-control"
															placeholder="Confirm Password*"
															value={employerData.confirmPassword}
															onChange={handleEmployerChange}
															required
														/>
														{passwordError && <small className="text-danger">{passwordError}</small>}
													</div>
												</div>

												<div className="col-lg-12">
													<div className="form-group mb-3">
														<div className=" form-check">
															<input
																type="checkbox"
																className="form-check-input"
																id="agree2"
																required
															/>
															<label
																className="form-check-label"
																htmlFor="agree2"
															>
																I agree to the{" "}
																<a href="#">Terms and conditions</a>
															</label>
															<p>
																Already registered?
																<button
																	type="button"
																	className="twm-backto-login"
																	data-bs-target="#sign_up_popup2"
																	data-bs-toggle="modal"
																	data-bs-dismiss="modal"
																>
																	Sign in
																</button>
															</p>
														</div>
													</div>
												</div>

												<div className="col-md-12">
													<button type="submit" className="site-button" disabled={loading || passwordError}>
														{loading ? 'Signing Up...' : 'Sign Up'}
													</button>
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
			</>
		);
}

export default SignUpPopup;