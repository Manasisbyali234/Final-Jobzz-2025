// LEGACY CANDIDATE DASHBOARD (Reff style)

import SectionCandidateOverview from "../sections/dashboard/section-can-overview";
import CompleteProfileCard from "../sections/dashboard/section-can-profile";
import SectionNotifications from "../sections/dashboard/section-notifications";
import { useEffect } from "react";
import { loadScript } from "../../../../globals/constants";

function CanDashboardPage() {
  useEffect(() => {
    loadScript("js/custom.js");
  });

  return (
    <>
      <div className="twm-right-section-panel site-bg-gray">
        <SectionCandidateOverview />

        <div className="twm-pro-view-chart-wrap">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-12 mb-4">
              <CompleteProfileCard />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 mb-4">
              <SectionNotifications />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CanDashboardPage;