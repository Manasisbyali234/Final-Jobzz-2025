
import { Route, Routes } from "react-router-dom";
import { publicUser } from "../globals/route-names";

import Home16Page from "../app/pannels/public-user/components/home/index16";

import JobsGridPage from "../app/pannels/public-user/components/jobs/jobs-grid";
import JobsGridMapPage from "../app/pannels/public-user/components/jobs/jobs-grid-map";
import JobsListPage from "../app/pannels/public-user/components/jobs/jobs-list";
import JobDetail1Page from "../app/pannels/public-user/components/jobs/job-detail1";
import JobDetail2Page from "../app/pannels/public-user/components/jobs/job-detail2";
import ApplyJobPage from "../app/pannels/public-user/components/jobs/apply-job";

import EmployersGridPage from "../app/pannels/public-user/components/employers/emp-grid";
import EmployersListPage from "../app/pannels/public-user/components/employers/emp-list";
import EmployersDetail1Page from "../app/pannels/public-user/components/employers/emp-detail1";
import EmployersDetail2Page from "../app/pannels/public-user/components/employers/emp-detail2";

import AboutUsPage from "../app/pannels/public-user/components/pages/about-us";
import PricingPage from "../app/pannels/public-user/components/pages/pricing";
import Error404Page from "../app/pannels/public-user/components/pages/error404";
import FaqPage from "../app/pannels/public-user/components/pages/faq";
import ContactUsPage from "../app/pannels/public-user/components/pages/contact-us";
import UnderMaintenancePage from "../app/pannels/public-user/components/pages/under-maintenance";
import ComingSoonPage from "../app/pannels/public-user/components/pages/coming-soon";
import LoginPage from "../app/pannels/public-user/components/pages/login";
import AfterLoginPage from "../app/pannels/public-user/components/pages/after-login";
import IconsPage from "../app/pannels/public-user/components/pages/icons";

import CandidateGridPage from "../app/pannels/public-user/components/candidates/can-grid";
import CandidateListPage from "../app/pannels/public-user/components/candidates/can-list";
import CandidateDetail1Page from "../app/pannels/public-user/components/candidates/can-detail1";
import CandidateDetail2Page from "../app/pannels/public-user/components/candidates/can-detail2";

import BlogGrid1Page from "../app/pannels/public-user/components/blogs/blogs-grid1";
import BlogGrid2Page from "../app/pannels/public-user/components/blogs/blogs-grid2";
import BlogGrid3Page from "../app/pannels/public-user/components/blogs/blogs-grid3";
import BlogListPage from "../app/pannels/public-user/components/blogs/blogs-list";
import BlogDetailPage from "../app/pannels/public-user/components/blogs/blog-detail";
import ForgotPassword from "../app/pannels/public-user/components/pages/forgot-password";
import AdminLogin from "../app/admin-login/page";

function PublicUserRoutes() {
    return (
        <Routes>
            <Route path={publicUser.INITIAL} element={<Home16Page />} />

            <Route path={publicUser.jobs.GRID} element={<JobsGridPage />} />
            <Route path={publicUser.jobs.GRID_MAP} element={<JobsGridMapPage />} />
            <Route path={publicUser.jobs.LIST} element={<JobsListPage />} />
            <Route path={publicUser.jobs.DETAIL1} element={<JobDetail1Page />} />
            <Route path="/job-detail/:id" element={<JobDetail1Page />} />
            <Route path="/job-detail/:param1/:id" element={<JobDetail1Page />} />
            <Route path={publicUser.jobs.DETAIL2} element={<JobDetail2Page />} />
            <Route path={publicUser.jobs.APPLY} element={<ApplyJobPage />} />
            <Route path={publicUser.employer.GRID} element={<EmployersGridPage />} />
            <Route path={publicUser.employer.LIST} element={<EmployersListPage />} />
            <Route path="/emp-detail/:id" element={<EmployersDetail1Page />} />
            <Route path={publicUser.employer.DETAIL2} element={<EmployersDetail2Page />} />
            <Route path={publicUser.pages.ABOUT} element={<AboutUsPage />} />
            <Route path={publicUser.pages.PRICING} element={<PricingPage />} />
            <Route path={publicUser.pages.ERROR404} element={<Error404Page />} />
            <Route path={publicUser.pages.FAQ} element={<FaqPage />} />
            <Route path={publicUser.pages.CONTACT} element={<ContactUsPage />} />
            <Route path={publicUser.pages.MAINTENANCE} element={<UnderMaintenancePage />} />
            <Route path={publicUser.pages.COMING} element={<ComingSoonPage />} />
            <Route path={publicUser.pages.LOGIN} element={<LoginPage />} />
            <Route path={publicUser.pages.ADMIN_LOGIN} element={<AdminLogin />} />
            <Route path={publicUser.pages.AFTER_LOGIN} element={<AfterLoginPage />} />
            <Route path={publicUser.pages.FORGOT} element={<ForgotPassword/>} />
            <Route path={publicUser.pages.ICONS} element={<IconsPage />} />
            <Route path={publicUser.candidate.GRID} element={<CandidateGridPage />} />
            <Route path={publicUser.candidate.LIST} element={<CandidateListPage />} />
            <Route path={publicUser.candidate.DETAIL1} element={<CandidateDetail1Page />} />
            <Route path={publicUser.candidate.DETAIL2} element={<CandidateDetail2Page />} />
            <Route path={publicUser.blog.GRID1} element={<BlogGrid1Page />} />
            <Route path={publicUser.blog.GRID2} element={<BlogGrid2Page />} />
            <Route path={publicUser.blog.GRID3} element={<BlogGrid3Page />} />
            <Route path={publicUser.blog.LIST} element={<BlogListPage />} />
            <Route path={publicUser.blog.DETAIL} element={<BlogDetailPage />} />
            <Route path="*" element={<Error404Page />} />
        </Routes>
    )
}

export default PublicUserRoutes;