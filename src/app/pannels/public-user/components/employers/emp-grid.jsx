import JobZImage from "../../../../common/jobz-img";
import SectionJobsSidebar1 from "../../sections/jobs/sidebar/section-jobs-sidebar1";
import SectionRecordsFilter from "../../sections/common/section-records-filter";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import SectionPagination from "../../sections/common/section-pagination";
import { useEffect, useState } from "react";
import { loadScript } from "../../../../../globals/constants";
import api from "../../../../../utils/api";

function EmployersGridPage() {
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("Most Recent");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const _filterConfig = {
        prefix: "Showing",
        type: "employers",
        total: employers.length.toString(),
        showRange: false,
        showingUpto: ""
    };

    useEffect(() => {
        loadScript("js/custom.js");
        fetchEmployers();
    }, [sortBy, itemsPerPage]);

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
    };

    const fetchEmployers = async () => {
        try {
            const params = new URLSearchParams();
            if (sortBy !== undefined && sortBy !== null) {
                params.append('sortBy', sortBy);
            }
            if (itemsPerPage) {
                params.append('limit', itemsPerPage.toString());
            }

            const url = `http://localhost:5000/api/public/employers?${params.toString()}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                let employerList = data.employers || data.data || [];

                // Frontend filtering fallback if backend doesn't support sortBy
                if (sortBy && sortBy !== 'Most Recent') {
                    employerList = employerList.filter(employer => {
                        const employerType = employer.industry || employer.category || employer.companyType || '';
                        return employerType.toLowerCase().includes(sortBy.toLowerCase());
                    });
                    console.log(`Filtered ${employerList.length} employers for type: ${sortBy}`);
                }

                // Get profiles and job counts for each employer
                const employersWithData = await Promise.all(
                    employerList.map(async (employer) => {
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
            <div className="section-full py-5 site-bg-white" data-aos="fade-up">
                <Container>
                    <Row className="mb-4">
                        <Col lg={4} md={12} className="rightSidebar" data-aos="fade-right" data-aos-delay="100">
                            <SectionJobsSidebar1 />
                        </Col>

                        <Col lg={8} md={12} data-aos="fade-left" data-aos-delay="200">
                            <div className="mb-4">
                                <SectionRecordsFilter
                                    _config={_filterConfig}
                                    onSortChange={handleSortChange}
                                    onItemsPerPageChange={handleItemsPerPageChange}
                                />
                            </div>

                            <div className="twm-employer-list-wrap">
                                <Row>
                                    {employers.length > 0 ? employers.map((employer, index) => (
                                        <Col key={employer._id} lg={6} md={6} className="mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
                                            <div className="twm-employer-grid-style1 hover-card">
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
                                        </Col>
                                    )) : (
                                        <Col xs={12} className="text-center py-5" data-aos="fade-up">
                                            <h5>No employers found</h5>
                                            <p>Please check back later for new companies.</p>
                                        </Col>
                                    )}
                                </Row>
                            </div>

                            <SectionPagination />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default EmployersGridPage;