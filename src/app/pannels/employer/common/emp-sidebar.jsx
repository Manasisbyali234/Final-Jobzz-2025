
import JobZImage from "../../../common/jobz-img";
import { NavLink, useLocation } from "react-router-dom";
import { loadScript, setMenuActive } from "../../../../globals/constants";
import { employer, empRoute, publicUser } from "../../../../globals/route-names";
import { useEffect } from "react";

function EmpSidebarSection(props) {
    const currentpath = useLocation().pathname;

    useEffect(() => {
        loadScript("js/custom.js");
        loadScript("js/emp-sidebar.js");
    });

    return (
        <>
            <nav id="sidebar-admin-wraper" className={props.sidebarActive ? "" : "active"}>
                <div className="page-logo">
                    <NavLink to={publicUser.INITIAL}><JobZImage id="skin_page_logo" src="images/logo-dark.png" alt="" /></NavLink>
                </div>

                <div className="admin-nav scrollbar-macosx">
                    <ul>
                        <li
                            className={setMenuActive(currentpath, empRoute(employer.DASHBOARD))}>
                            <NavLink to={empRoute(employer.DASHBOARD)} style={{display: 'flex', alignItems: 'center'}}><i className="fa fa-home" style={{minWidth: '30px', textAlign: 'center'}} /><span className="admin-nav-text" style={{paddingLeft: '10px'}}>Dashboard</span></NavLink>
                        </li>

                        <li
                            className={setMenuActive(currentpath, empRoute(employer.PROFILE))}>
                            <NavLink to={empRoute(employer.PROFILE)} style={{display: 'flex', alignItems: 'center'}}><i className="fa fa-user-tie" style={{minWidth: '30px', textAlign: 'center'}} /><span className="admin-nav-text" style={{paddingLeft: '10px'}}>Company Profile</span></NavLink>
                        </li>

                        <li
                            className={setMenuActive(currentpath, empRoute(employer.MANAGE_JOBS))}>
                            <NavLink to={empRoute(employer.MANAGE_JOBS)} style={{display: 'flex', alignItems: 'center'}}><i className="fa fa-suitcase" style={{minWidth: '30px', textAlign: 'center'}} /><span className="admin-nav-text" style={{paddingLeft: '10px'}}>Openings</span></NavLink>
                        </li>

                        <li className={setMenuActive(currentpath, empRoute(employer.CANDIDATES))}>
                            <NavLink to={empRoute(employer.CANDIDATES)} style={{display: 'flex', alignItems: 'center'}}><i className="fa fa-user-friends" style={{minWidth: '30px', textAlign: 'center'}} /><span className="admin-nav-text" style={{paddingLeft: '15px'}}>Applicants</span></NavLink>
                        </li>
                        
                        <li>
                            <a href="#" data-bs-toggle="modal" data-bs-target="#logout-dash-profile" style={{display: 'flex', alignItems: 'center'}}>
                                <i className="fa fa-share-square" style={{minWidth: '30px', textAlign: 'center'}} />
                                <span className="admin-nav-text" style={{paddingLeft: '10px'}}>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default EmpSidebarSection;