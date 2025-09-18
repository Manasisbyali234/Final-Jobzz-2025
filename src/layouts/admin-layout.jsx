
import YesNoPopup from "../app/common/popups/popup-yes-no";
import AdminHeaderSection from "../app/pannels/admin/common/admin-header";
import AdminSidebarSection from "../app/pannels/admin/common/admin-sidebar";

import { popupType } from "../globals/constants";
import { useState } from "react";
import AdminRoutes from "../routing/admin-routes";

function AdminLayout() {

    const [sidebarActive, setSidebarActive] = useState(true);

    const handleSidebarCollapse = () => {
        setSidebarActive(!sidebarActive);
    }

    return (
        <>
            <div className="page-wraper">

                <AdminHeaderSection onClick={handleSidebarCollapse} sidebarActive={sidebarActive} />
                <AdminSidebarSection sidebarActive={sidebarActive} />

                <div id="content" className={sidebarActive ? "" : "active"}>
                    <div className="content-admin-main">
                        <AdminRoutes />
                    </div>
                </div>

                <YesNoPopup id="logout-dash-profile" type={popupType.LOGOUT} msg={"Are you sure you want to logout?"} />
            </div>
        </>
    )
}

export default AdminLayout;