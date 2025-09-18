import { useEffect, useState } from "react";
import JobZImage from "../../../common/jobz-img";
import CountUp from "react-countup";
import AdminDashboardActivityChart from "../common/admin-graph";

function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalCandidates: 0,
        totalEmployers: 0,
        activeJobs: 0,
        totalApplications: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Admin Dashboard</h2>
            </div>

            <div className="twm-dash-b-blocks mb-5">
                <div className="row">
                    <div className="col-xl-3 col-lg-6 col-md-12 mb-3">
                        <div className="panel panel-default">
                            <div className="panel-body wt-panel-body gradi-1 dashboard-card">
                                <div className="wt-card-wrap">
                                    <div className="wt-card-icon">
                                        <i className="far fa-address-book" />
                                    </div>

                                    <div className="wt-card-right wt-total-active-listing counter">
                                        {loading ? '...' : <CountUp end={stats.totalCandidates} duration={2} />}
                                    </div>

                                    <div className="wt-card-bottom">
                                        <h4 className="m-b0">Total Candidates</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-6 col-md-12 mb-3">
                        <div className="panel panel-default">
                            <div className="panel-body wt-panel-body gradi-2 dashboard-card">
                                <div className="wt-card-wrap">
                                    <div className="wt-card-icon">
                                        <i className="far fa-file-alt" />
                                    </div>

                                    <div className="wt-card-right wt-total-listing-view counter">
                                        {loading ? '...' : <CountUp end={stats.totalEmployers} duration={2} />}
                                    </div>

                                    <div className="wt-card-bottom">
                                        <h4 className="m-b0">Total Employers</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-6 col-md-12 mb-3">
                        <div className="panel panel-default">
                            <div className="panel-body wt-panel-body gradi-3 dashboard-card">
                                <div className="wt-card-wrap">
                                    <div className="wt-card-icon">
                                        <i className="far fa-envelope" />
                                    </div>
                                    
                                    <div className="wt-card-right wt-total-listing-review counter">
                                        {loading ? '...' : <CountUp end={stats.activeJobs} duration={2} />}
                                    </div>

                                    <div className="wt-card-bottom">
                                        <h4 className="m-b0">Active Jobs</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-xl-3 col-lg-6 col-md-12 mb-3">
                        <div className="panel panel-default">
                            <div className="panel-body wt-panel-body gradi-4 dashboard-card">
                                <div className="wt-card-wrap">
                                    <div className="wt-card-icon">
                                        <i className="far fa-bell" />
                                    </div>

                                    <div className="wt-card-right wt-total-listing-bookmarked counter">
                                        {loading ? '...' : <CountUp end={stats.totalApplications} duration={2} />}
                                    </div>

                                    <div className="wt-card-bottom">
                                        <h4 className="m-b0">Applications</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="twm-pro-view-chart-wrap">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-12 mb-4">
                        <AdminDashboardActivityChart />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboardPage;