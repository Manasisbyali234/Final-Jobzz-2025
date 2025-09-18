
import { Route, Routes } from "react-router-dom";
import { admin } from "../globals/route-names";
import AdminDashboardPage from "../app/pannels/admin/components/admin-dashboard";
import AdminCandidates from "../app/pannels/admin/components/admin-candidates";
import AdminCandidateAddEdit from "../app/pannels/admin/components/admin-candidate-add";
import AdminEmployerJobs from "../app/pannels/admin/components/admin-emp-jobs";
import AdminJobs from "../app/pannels/admin/components/admin-jobs";
import AdminCreditsPage from "../app/pannels/admin/components/admin-can-credit";
import AdminBulkUploadPage from "../app/pannels/admin/components/admin-credit-bulkupload";
import AdminEmployersAllRequest from "../app/pannels/admin/components/admin-emp-manage";
import AdminEmployersApproved from "../app/pannels/admin/components/admin-emp-approve";
import AdminEmployersRejected from "../app/pannels/admin/components/admin-emp-reject";
import EmployerDetails from "../app/pannels/admin/components/adminEmployerDetails";

import RegisteredCandidatesPage from "../app/pannels/admin/components/registered-candidates";

function AdminRoutes() {
    return (
			<Routes>
				<Route path={admin.DASHBOARD} element={<AdminDashboardPage />} />
				<Route path={admin.CAN_MANAGE} element={<AdminEmployersAllRequest />} />
				<Route path={admin.CAN_APPROVE} element={<AdminEmployersApproved />} />
				<Route path={admin.CAN_REJECT} element={<AdminEmployersRejected />} />
				<Route path={admin.CANDIDATES} element={<AdminCandidates />} />
				<Route
					path={admin.CANDIDATE_ADD_EDIT}
					element={<AdminCandidateAddEdit />}
				/>
				<Route path={admin.EMPLOYER_JOBS} element={<AdminEmployerJobs />} />
				<Route path={admin.JOBS} element={<AdminJobs />} />
				<Route path={admin.CREDITS} element={<AdminCreditsPage />} />
				<Route path={admin.BULK_UPLOAD} element={<AdminBulkUploadPage />} />
				<Route
					path={admin.EMPLOYER_DETAILS}
					element={<EmployerDetails />}
				/>

				<Route path={admin.REGISTERED_CANDIDATES} element={<RegisteredCandidatesPage />} />
			</Routes>
		);
}

export default AdminRoutes;
