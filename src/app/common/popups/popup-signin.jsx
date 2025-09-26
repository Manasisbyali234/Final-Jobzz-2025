import { useNavigate } from "react-router-dom";
import { canRoute, candidate, empRoute, employer, placementRoute, placement } from "../../../globals/route-names";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

function SignInPopup() {

    const navigate = useNavigate();
    const { login } = useAuth();
    const [canusername, setCanUsername] = useState('');
    const [empusername, setEmpUsername] = useState('');
    const [placementusername, setPlacementUsername] = useState('');
    const [canpassword, setCanPassword] = useState('');
    const [emppassword, setEmpPassword] = useState('');
    const [placementpassword, setPlacementPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCandidateLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login({
            email: canusername,
            password: canpassword
        }, 'candidate');
        
        if (result.success) {
            moveToCandidate();
        } else {
            setError(result.message);
        }
        setLoading(false);
    }

    const handleEmployerLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login({
            email: empusername,
            password: emppassword
        }, 'employer');
        
        if (result.success) {
            moveToEmployer();
        } else {
            setError(result.message);
        }
        setLoading(false);
    }

    const moveToCandidate = () => {
        navigate(canRoute(candidate.DASHBOARD));
    }

    const moveToEmployer = () => {
        navigate(empRoute(employer.DASHBOARD));
    }

    const handlePlacementLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login({
            email: placementusername,
            password: placementpassword
        }, 'placement');
        
        if (result.success) {
            moveToPlacement();
        } else {
            setError(result.message);
        }
        setLoading(false);
    }

    const moveToPlacement = () => {
        navigate(placementRoute(placement.DASHBOARD));
    }

    return (
			<>
				<div
					className="modal fade twm-sign-up"
					id="sign_up_popup2"
					aria-hidden="true"
					aria-labelledby="sign_up_popupLabel2"
					tabIndex={-1}
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							{/* <form> */}
							<div className="modal-header">
								<h2 className="modal-title" id="sign_up_popupLabel2">
									Login
								</h2>
								<p>Login and get access to all the features of TaleGlobal</p>
								<button
									type="button"
									className="btn-close"
									data-bs-dismiss="modal"
									aria-label="Close"
								/>
							</div>

							<div className="modal-body">
								<div className="twm-tabs-style-2">
									<ul className="nav nav-tabs" id="myTab2" role="tablist">
										{/*Login Candidate*/}
										<li className="nav-item">
											<button
												className="nav-link active"
												data-bs-toggle="tab"
												data-bs-target="#login-candidate"
												type="button"
											>
												<i className="fas fa-user-tie" />
												Candidate
											</button>
										</li>

										{/*Login Employer*/}
										<li className="nav-item">
											<button
												className="nav-link"
												data-bs-toggle="tab"
												data-bs-target="#login-Employer"
												type="button"
											>
												<i className="fas fa-building" />
												Employer
											</button>
										</li>

										<li className="nav-item">
											<button
												className="nav-link"
												data-bs-toggle="tab"
												data-bs-target="#login-Placement"
												type="button"
											>
												<i className="fas fa-graduation-cap" />
												Placement
											</button>
										</li>
									</ul>

									<div className="tab-content" id="myTab2Content">
										{/*Login Candidate Content*/}
										<form
											onSubmit={handleCandidateLogin}
											className="tab-pane fade show active"
											id="login-candidate"
										>
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
															required
															className="form-control"
															placeholder="Usearname*"
															value={canusername}
															onChange={(event) => {
																setCanUsername(event.target.value);
															}}
														/>
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
															}}
														/>
													</div>
												</div>

												<div className="col-lg-12">
													<div className="form-group mb-3">
														<div className=" form-check">
															<input
																type="checkbox"
																className="form-check-input"
																id="Password3"
															/>
															<label
																className="form-check-label rem-forgot"
																htmlFor="Password3"
															>
																<a href="#">Forgot Password</a>
															</label>
														</div>
													</div>
												</div>

												<div className="col-md-12">
													<button
														type="submit"
														className="site-button"
														data-bs-dismiss="modal"
													>
														Log in
													</button>

													<div className="mt-3 mb-3">
														Don't have an account ?
														<button
															className="twm-backto-login"
															data-bs-target="#sign_up_popup"
															data-bs-toggle="modal"
															data-bs-dismiss="modal"
														>
															Sign Up
														</button>
													</div>
												</div>
											</div>
										</form>

										{/*Login Employer Content*/}
										<form
											onSubmit={handleEmployerLogin}
											className="tab-pane fade"
											id="login-Employer"
										>
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
															}}
														/>
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
															}}
														/>
													</div>
												</div>

												<div className="col-lg-12">
													<div className="form-group mb-3">
														<div className=" form-check">
															<input
																type="checkbox"
																className="form-check-input"
																id="Password4"
															/>
															<label
																className="form-check-label rem-forgot"
																htmlFor="Password4"
															>
																<a href="/forgot-password">Forgot Password</a>
															</label>
														</div>
													</div>
												</div>

												<div className="col-md-12">
													<button
														type="submit"
														className="site-button"
														data-bs-dismiss="modal"
													>
														Log in
													</button>

													<div className="mt-3 mb-3">
														Don't have an account ?
														<button
															className="twm-backto-login"
															data-bs-target="#sign_up_popup"
															data-bs-toggle="modal"
															data-bs-dismiss="modal"
														>
															Sign Up
														</button>
													</div>
												</div>
											</div>
										</form>

										{/*Login Placement Content*/}
										<form
											onSubmit={handlePlacementLogin}
											className="tab-pane fade"
											id="login-Placement"
										>
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
															}}
														/>
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
															}}
														/>
													</div>
												</div>

												<div className="col-md-12">
													<button
														type="submit"
														className="site-button"
														data-bs-dismiss="modal"
													>
														Log in
													</button>

													<div className="mt-3 mb-3">
														Don't have an account ?
														<button
															className="twm-backto-login"
															data-bs-target="#sign_up_popup"
															data-bs-toggle="modal"
															data-bs-dismiss="modal"
														>
															Sign Up
														</button>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
							{/* </form> */}
						</div>
					</div>
				</div>
			</>
		);
}

export default SignInPopup;