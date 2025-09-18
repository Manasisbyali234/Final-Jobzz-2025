import JobZImage from "../../../../common/jobz-img";
import SectionJobsSidebar1 from "../../sections/jobs/sidebar/section-jobs-sidebar1";
import SectionRecordsFilter from "../../sections/common/section-records-filter";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import SectionPagination from "../../sections/common/section-pagination";
import { useEffect, useState } from "react";
import { loadScript } from "../../../../../globals/constants";
import api from "../../../../../utils/api";

function EmployersGridPage() {
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);

    const _filterConfig = {
        prefix: "Showing",
        type: "Result",
        total: employers.length.toString(),
        showRange: true,
        showingUpto: employers.length.toString()
    };

    useEffect(() => {
        loadScript("js/custom.js");
        fetchEmployers();
    }, []);

    const fetchEmployers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/public/employers');
            const data = await response.json();
            if (data.success) {
                // Get profiles and job counts for each employer
                const employersWithData = await Promise.all(
                    data.employers.map(async (employer) => {
                        // Get employer profile
                        const profileResponse = await fetch(`http://localhost:5000/api/public/employers/${employer._id}`);
                        const profileData = await profileResponse.json();
                        
                        // Get job count
                        const jobsResponse = await fetch(`http://localhost:5000/api/public/jobs?employerId=${employer._id}`);
                        const jobsData = await jobsResponse.json();
                        
                        return {
                            ...employer,
                            profile: profileData.success ? profileData.profile : null,
                            jobCount: jobsData.success ? jobsData.jobs.length : 0
                        };
                    })
                );
                setEmployers(employersWithData);
            }
        } catch (error) {
            console.error('Error fetching employers:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5">Loading employers...</div>;
    }

    return (
        <>
            <div className="section-full p-t120  p-b90 site-bg-white">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-12 rightSidebar">
                            <SectionJobsSidebar1 />
                        </div>

                        <div className="col-lg-8 col-md-12">
                            <SectionRecordsFilter _config={_filterConfig} />

                            <div className="twm-employer-list-wrap">
                                <div className="row">
                                    {employers.length > 0 ? employers.map((employer) => (
                                        <div key={employer._id} className="col-lg-6 col-md-6">
                                            <div className="twm-employer-grid-style1 mb-5">
                                                <div className="twm-media">
                                                    {employer.profile?.logo ? (
                                                        <img src={employer.profile.logo} alt="Company Logo" />
                                                    ) : (
                                                        <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                                                    )}
                                                </div>
                                                <div className="twm-mid-content">
                                                    <NavLink
                                                        to={`/emp-detail/${employer._id}`}
                                                        className="twm-job-title"
                                                    >
                                                        <h4>{employer.companyName}</h4>
                                                    </NavLink>
                                                    <div className="twm-job-address">
                                                        <i className="feather-map-pin" />
                                                        &nbsp; {employer.profile?.corporateAddress || 'Location not specified'}
                                                    </div>
                                                    <NavLink
                                                        to={`/emp-detail/${employer._id}`}
                                                        className="twm-job-websites site-text-primary"
                                                    >
                                                        {employer.profile?.website || employer.email}
                                                    </NavLink>
                                                </div>
                                                <div className="twm-right-content">
                                                    <div className="twm-jobs-vacancies">
                                                        <span>{employer.jobCount || 0}</span>Vacancies
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-12 text-center p-5">
                                            <h5>No employers found</h5>
                                            <p>Please check back later for new companies.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <SectionPagination />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployersGridPage;