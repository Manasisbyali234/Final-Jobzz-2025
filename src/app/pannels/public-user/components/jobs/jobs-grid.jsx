
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { loadScript } from "../../../../../globals/constants";
import SectionRecordsFilter from "../../sections/common/section-records-filter";
import SectionJobsGrid from "../../sections/jobs/section-jobs-grid";
import SectionJobsSidebar1 from "../../sections/jobs/sidebar/section-jobs-sidebar1";

function JobsGridPage() {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({});
    const [totalJobs, setTotalJobs] = useState(0);
    const [sortBy, setSortBy] = useState("Most Recent");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const category = searchParams.get('category');
        const location = searchParams.get('location');
        const search = searchParams.get('search');
        const jobType = searchParams.get('jobType');
        
        // Check if this is the specific URL pattern that should show IT category jobs
        const isSpecificPattern = search === 'Software Developer' && 
                                 jobType === 'Full Time' && 
                                 location === 'Bangalore';
        
        const newFilters = {};
        
        if (isSpecificPattern) {
            // Override with IT category for the specific URL pattern
            newFilters.category = 'IT';
        } else {
            // Use original URL parameters
            if (category) newFilters.category = category;
            if (location) newFilters.location = location;
            if (search) newFilters.search = search;
            if (jobType) {
                // Convert "Full Time" to "full-time" format
                const normalizedJobType = jobType.toLowerCase().replace(/\s+/g, '-');
                newFilters.jobType = normalizedJobType;
            }
        }
        
        // Add sort and pagination parameters
        newFilters.sortBy = sortBy;
        newFilters.itemsPerPage = itemsPerPage;
        
        setFilters(newFilters);
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
        const location = searchParams.get('location');
        const search = searchParams.get('search');
        const jobType = searchParams.get('jobType');
        
        // Check if this is the specific URL pattern that should show IT category jobs
        const isSpecificPattern = search === 'Software Developer' && 
                                 jobType === 'Full Time' && 
                                 location === 'Bangalore';
        
        const updatedFilters = { ...newFilters };
        
        if (isSpecificPattern) {
            // Override with IT category for the specific URL pattern
            updatedFilters.category = 'IT';
        } else {
            // Use original URL parameters
            if (category) updatedFilters.category = category;
            if (location) updatedFilters.location = location;
            if (search) updatedFilters.search = search;
            if (jobType) {
                const normalizedJobType = jobType.toLowerCase().replace(/\s+/g, '-');
                updatedFilters.jobType = normalizedJobType;
            }
        }
        
        // Add sort and pagination parameters
        updatedFilters.sortBy = sortBy;
        updatedFilters.itemsPerPage = itemsPerPage;
        
        setFilters(updatedFilters);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
    };

    return (
        <>
            <div className="section-full py-5 site-bg-white job-grid-page" data-aos="fade-up">
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