
import JobZImage from "../jobz-img";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../globals/route-names";
import { useState } from "react";

function Header1({ _config }) {

    const [menuActive, setMenuActive] = useState(false);

    function handleNavigationClick () {
        setMenuActive(!menuActive);
    };

    return (
        <>
            <header className={"site-header " + _config.style + " mobile-sider-drawer-menu " + (menuActive ? "active" : "") }>
                <div className="sticky-header main-bar-wraper navbar-expand-lg">
                    <div className="main-bar">
                        <div className="container-fluid clearfix">
                            <div className="logo-header">
                                <div className="logo-header-inner logo-header-one">
                                    <NavLink to={publicUser.INITIAL}>
                                        {
                                            _config.withBlackLogo
                                                ?
                                                <JobZImage src="images/logo-12.png" alt="" />
                                                :
                                                (
                                                    _config.withWhiteLogo
                                                        ?
                                                        <JobZImage src="images/logo-white.png" alt="" />
                                                        :
                                                        (
                                                            _config.withLightLogo ?
                                                                <>
                                                                    <JobZImage id="skin_header_logo_light" src="images/logo-light-3.png" alt="" className="default-scroll-show" />
                                                                    <JobZImage id="skin_header_logo" src="images/logo-dark.png" alt="" className="on-scroll-show" />
                                                                </> :
                                                                <JobZImage id="skin_header_logo" src="images/logo-dark.png" alt="" />
                                                        )
                                                )
                                        }
                                    </NavLink>
                                </div>
                            </div>
                            {/* NAV Toggle Button */}
                            <button id="mobile-side-drawer"
                                data-target=".header-nav"
                                data-toggle="collapse"
                                type="button"
                                className="navbar-toggler collapsed"
                                onClick={handleNavigationClick}
                            >
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar icon-bar-first" />
                                <span className="icon-bar icon-bar-two" />
                                <span className="icon-bar icon-bar-three" />
                            </button>
                            {/* MAIN Vav */}
                            <div className="nav-animation header-nav navbar-collapse d-flex justify-content-center" style={{display: 'flex !important'}}>
                                <ul className="nav navbar-nav" style={{display: 'flex', listStyle: 'none', gap: '2rem'}}>
                                    <li className="has-mega-menu"><a href="/" style={{color: '#333', textDecoration: 'none', padding: '10px 15px'}}>Home</a></li>
                                    <li className="has-child"><a href="/job-grid" style={{color: '#333', textDecoration: 'none', padding: '10px 15px'}}>Jobs</a></li>
                                    <li className="has-child"><a href="/emp-grid" style={{color: '#333', textDecoration: 'none', padding: '10px 15px'}}>Employers</a></li>
                                    <li className="has-child"><a href="/contact-us" style={{color: '#333', textDecoration: 'none', padding: '10px 15px'}}>Contact Us</a></li>
                                </ul>
                            </div>

                            {/* Header Right Section*/}
                            <div className="extra-nav header-2-nav">
                                <div className="extra-cell">
                                    <div className="header-nav-btn-section">
                                        <div className="twm-nav-btn-left">
                                            <a className="twm-nav-sign-up" data-bs-toggle="modal" href="#sign_up_popup" role="button">
                                                <i className="feather-log-in" /> Sign Up
                                            </a>
                                        </div>

                                        <div className="twm-nav-btn-right">
                                            <a className="twm-nav-post-a-job" data-bs-toggle="modal" href="#sign_up_popup2" role="button">
                                                <i className="feather-log-in" /> Sign In
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* SITE Search */}
                    <div id="search">
                        <span className="close" />
                        <form role="search" id="searchform" action="/search" method="get" className="radius-xl">
                            <input className="form-control" name="q" type="search" placeholder="Type to search" />
                            <span className="input-group-append">
                                <button type="button" className="search-btn">
                                    <i className="fa fa-paper-plane" />
                                </button>
                            </span>
                        </form>
                    </div>
                </div>
            </header>

        </>
    )
}

export default Header1;