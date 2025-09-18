
import JobZImage from "../../../common/jobz-img";
import { NavLink, useLocation } from "react-router-dom";
import { loadScript, setMenuActive } from "../../../../globals/constants";
import { admin, adminRoute, publicUser } from "../../../../globals/route-names";
import { useEffect } from "react";
import "./admin-sidebar.css";

function AdminSidebarSection(props) {
    const currentpath = useLocation().pathname;

    useEffect(() => {
        loadScript("js/custom.js");
        loadScript("js/admin-sidebar.js");
    })

    return (
        <>
            <nav id="sidebar-admin-wraper" className={props.sidebarActive ? "" : "active"}>
                <div className="page-logo">
                    <NavLink to={publicUser.INITIAL}><JobZImage id="skin_page_logo" src="images/logo-dark.png" alt="" /></NavLink>
                </div>

                <div className="admin-nav scrollbar-macosx">
                    <ul>
                        <li
                            className={setMenuActive(currentpath, adminRoute(admin.DASHBOARD))}>
                            <NavLink to={adminRoute(admin.DASHBOARD)}><i className="fa fa-home" /><span className="admin-nav-text">Dashboard</span></NavLink>
                        </li>

                        <li
                            className={
                                setMenuActive(currentpath, adminRoute(admin.CAN_MANAGE)) +
                                setMenuActive(currentpath, adminRoute(admin.CAN_MANAGE))
                            }>
                            <a href="#">
                                <i className="fa fa-user-tie" />
                                <span className="admin-nav-text">Employers</span>
                            </a>
                            <ul className="sub-menu">
                                <li><NavLink to={adminRoute(admin.CAN_MANAGE)} id="allList"><span className="admin-nav-text">All Submissions</span></NavLink></li>
                                <li><NavLink to={adminRoute(admin.CAN_APPROVE)} id="approvedList"><span className="admin-nav-text">Approved</span></NavLink></li>
                                <li><NavLink to={adminRoute(admin.CAN_REJECT)} id="rejectedList"><span className="admin-nav-text">Rejected</span></NavLink></li>
                            </ul>
                        </li>

                        <li className={setMenuActive(currentpath, adminRoute(admin.REGISTERED_CANDIDATES))}>
                            <NavLink to={adminRoute(admin.REGISTERED_CANDIDATES)}>
                                <i className="fa fa-users" />
                                <span className="admin-nav-text">Registered Candidates</span>
                            </NavLink>
                        </li>
    
                        <li>
                            <a href="#" data-bs-toggle="modal" data-bs-target="#logout-dash-profile">
                                <i className="fa fa-share-square" />
                                <span className="admin-nav-text">Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default AdminSidebarSection;