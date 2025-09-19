
import SectionJobsSidebar1 from "../../sections/jobs/sidebar/section-jobs-sidebar1";
import SectionJobsGrid from "../../sections/jobs/section-jobs-grid";
import SectionRecordsFilter from "../../sections/common/section-records-filter";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loadScript } from "../../../../../globals/constants";

function JobsGridPage() {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({});
    const [totalJobs, setTotalJobs] = useState(0);
    const [sortBy, setSortBy] = useState("Most Recent");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            setFilters({ category, sortBy, itemsPerPage });
        } else {
            setFilters({ sortBy, itemsPerPage });
        }
    }, [searchParams, sortBy, itemsPerPage]);

    const _filterConfig = {
        prefix: "Showing",
        type: "jobs",
        total: totalJobs.toString(),
        showRange: false,
        showingUpto: ""
    }

    useEffect(()=>{
        loadScript("js/custom.js");
    })

    const handleFilterChange = (newFilters) => {
        const category = searchParams.get('category');
        if (category) {
            setFilters({ ...newFilters, category, sortBy, itemsPerPage });
        } else {
            setFilters({ ...newFilters, sortBy, itemsPerPage });
        }
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
    };

    return (
        <>
            <div className="section-full py-5 site-bg-white" data-aos="fade-up">
                <Container>
                    <Row className="mb-4">
                        <Col lg={4} md={12} className="rightSidebar" data-aos="fade-right" data-aos-delay="100">
                            <SectionJobsSidebar1 onFilterChange={handleFilterChange} />
                        </Col>

                        <Col lg={8} md={12} data-aos="fade-left" data-aos-delay="200">
                            {/*Filter Short By*/}
                            <div className="mb-4">
                                <SectionRecordsFilter
                                    _config={_filterConfig}
                                    onSortChange={handleSortChange}
                                    onItemsPerPageChange={handleItemsPerPageChange}
                                />
                            </div>
                            <SectionJobsGrid filters={filters} onTotalChange={setTotalJobs} />
                        </Col>
                    </Row>
                </Container>
            </div>

        </>
    )
}

export default JobsGridPage;