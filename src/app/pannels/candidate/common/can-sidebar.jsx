// CANDIDATE DASHBOARD SIDEBAR

import JobZImage from "../../../common/jobz-img";
import { NavLink, useLocation } from "react-router-dom";
import { loadScript, setMenuActive } from "../../../../globals/constants";
import { candidate, canRoute, publicUser } from "../../../../globals/route-names";
import { useEffect, useState } from "react";
import "../../common/modern-dashboard.css";

function CanSidebarSection(props) {
    const currentpath = useLocation().pathname;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        loadScript("js/custom.js");
        loadScript("js/can-sidebar.js");
    });

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <button 
                className="mobile-menu-toggle d-md-none" 
                onClick={toggleMobileMenu}
                style={{ display: 'block' }}
            >
                <i className="fa fa-bars"></i>
            </button>
            
            <nav id="sidebar-admin-wraper" className={`${props.sidebarActive ? "" : "active"} ${isMobileMenuOpen ? "active" : ""}`}>
                <div className="page-logo">
                    <NavLink to={publicUser.INITIAL}><JobZImage id="skin_page_logo" src="images/logo-dark.png" alt="logo" /></NavLink>
                </div>
                <div className="admin-nav scrollbar-macosx">
                    <ul>
                        <li className={setMenuActive(currentpath, canRoute(candidate.DASHBOARD))}>
                            <NavLink to={canRoute(candidate.DASHBOARD)} style={{display: 'flex', alignItems: 'center'}}>
                                <i className="fa fa-home" style={{minWidth: '30px', textAlign: 'center'}} />
                                <span className="admin-nav-text" style={{paddingLeft: '15px'}}>Dashboard</span>
                            </NavLink>
                        </li>
                        <li className={setMenuActive(currentpath, canRoute(candidate.PROFILE))}>
                            <NavLink to={canRoute(candidate.PROFILE)} style={{display: 'flex', alignItems: 'center'}}>
                                <i className="fa fa-user" style={{minWidth: '30px', textAlign: 'center'}} />
                                <span className="admin-nav-text" style={{paddingLeft: '15px'}}>My Profile</span>
                            </NavLink>
                        </li>
                        <li className={setMenuActive(currentpath, canRoute(candidate.STATUS))}>
                            <NavLink to={canRoute(candidate.STATUS)} style={{display: 'flex', alignItems: 'center'}}>
                                <i className="fa fa-briefcase" style={{minWidth: '30px', textAlign: 'center'}} />
                                <span className="admin-nav-text" style={{paddingLeft: '15px'}}>My Applications</span>
                            </NavLink>
                        </li>
                        <li className={setMenuActive(currentpath, canRoute(candidate.RESUME))}>
                            <NavLink to={canRoute(candidate.RESUME)} style={{display: 'flex', alignItems: 'center'}}>
                                <i className="fa fa-file-alt" style={{minWidth: '30px', textAlign: 'center'}} />
                                <span className="admin-nav-text" style={{paddingLeft: '15px'}}>My Resume</span>
                            </NavLink>
                        </li>
                        <li>
                            <a href="#" data-bs-toggle="modal" data-bs-target="#logout-dash-profile" style={{display: 'flex', alignItems: 'center'}}>
                                <i className="fa fa-sign-out-alt" style={{minWidth: '30px', textAlign: 'center'}} />
                                <span className="admin-nav-text" style={{paddingLeft: '15px'}}>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default CanSidebarSection;