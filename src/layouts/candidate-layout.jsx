
import YesNoPopup from "../app/common/popups/popup-yes-no";
import { popupType } from "../globals/constants";
import { useState } from "react";
import CanHeaderSection from "../app/pannels/candidate/common/can-header";
import CanSidebarSection from "../app/pannels/candidate/common/can-sidebar";
import CandidateRoutes from "../routing/candidate-routes";

function CandidateLayout() {

    const [sidebarActive, setSidebarActive] = useState(true);

    const handleSidebarCollapse = () => {
        setSidebarActive(!sidebarActive);
    }

    return (
        <>
            <div className="page-wraper">

                <CanHeaderSection onClick={handleSidebarCollapse} sidebarActive={sidebarActive} />
                <CanSidebarSection sidebarActive={sidebarActive} />

                <div id="content" className={sidebarActive ? "" : "active"}>
                    <div className="content-admin-main">
                        <CandidateRoutes />
                    </div>
                </div>

                <YesNoPopup id="delete-dash-profile" type={popupType.DELETE} msg={"Do you want to delete your profile?"} />
                <YesNoPopup id="logout-dash-profile" type={popupType.LOGOUT} msg={"Do you want to Logout your profile?"} />

            </div>
        </>
    )
}

export default CandidateLayout;