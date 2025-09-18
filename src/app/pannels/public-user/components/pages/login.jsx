import { NavLink, useNavigate, useLocation } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";
import { canRoute, candidate, empRoute, employer, publicUser } from "../../../../../globals/route-names";
import { useState } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [canusername, setCanUsername] = useState('guest');
    const [empusername, setEmpUsername] = useState('admin');
    const [password, setPassword] = useState('12345');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const from = location.state?.from?.pathname || '/';

    const handleCandidateLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login({
            username: canusername,
            password: password
        }, 'candidate');
        
        setLoading(false);
        
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message || 'Login failed');
        }
    }

    const handleEmployerLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await login({
            username: empusername,
            password: password
        }, 'employer');
        
        setLoading(false);
        
        if (result.success) {
            navigate(from, { replace: true });
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
                                        </ul>
                                        <div className="tab-content" id="myTab2Content">
                                            {/*Login Candidate Content*/}
                                            <form onSubmit={handleCandidateLogin} className="tab-pane fade show active" id="twm-login-candidate">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="form-group mb-3">
                                                            <input name="username"
                                                                type="text"
                                                                required
                                                                className="form-control"
                                                                placeholder="Usearname*"
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
                                                                value={password}
                                                                onChange={(event) => {
                                                                    setPassword(event.target.value);
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
                                                                value={password}
                                                                onChange={(event) => {
                                                                    setPassword(event.target.value);
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage;