import React, { useEffect, useState } from 'react';
import CountUp from "react-countup";
import RecentJobPosts from "./recent-job-post";
import EmployerDashboardJobFunnelChart from "../common/emp-graph";

function EmpDashboardPage() {
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        shortlisted: 0
    });
    const [employer, setEmployer] = useState({ companyName: 'Company', logo: null });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('employerToken');
            if (!token) return;

            const [statsResponse, profileResponse] = await Promise.all([
                fetch('http://localhost:5000/api/employer/dashboard/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/employer/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const statsData = await statsResponse.json();
            const profileData = await profileResponse.json();

            if (statsResponse.ok && statsData.success) {
                setStats({
                    totalJobs: statsData.stats.totalJobs || 0,
                    activeJobs: statsData.stats.activeJobs || 0,
                    totalApplications: statsData.stats.totalApplications || 0,
                    shortlisted: statsData.stats.shortlisted || 0
                });
            }
            if (profileResponse.ok && profileData.success) {
                setEmployer({
                    companyName: profileData.profile.companyName || 'Company',
                    logo: profileData.profile.logo || null
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>{employer.companyName}</h2>
            </div>

            <div className="twm-dash-b-blocks mb-5">
                <div className="row">
                    <div className="col-xl-3 col-lg-6 col-md-12 mb-3">
                        <div className="panel panel-default">
                            <div className="panel-body wt-panel-body gradi-1 dashboard-card ">
                                <div className="wt-card-wrap">
                                    <div className="wt-card-icon"><i className="far fa-address-book" /></div>
                                    <div className="wt-card-right wt-total-active-listing counter ">
                                        <CountUp end={stats.totalJobs} duration={2.5} />
                                    </div>

                                    <div className="wt-card-bottom ">
                                        <h4 className="m-b0">Total Jobs Posted</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-6 col-md-12 mb-3">
                        <div className="panel panel-default">
                            <div className="panel-body wt-panel-body gradi-1 dashboard-card ">
                                <div className="wt-card-wrap">
                                    <div className="wt-card-icon"><i className="far fa-address-book" /></div>
                                    <div className="wt-card-right wt-total-active-listing counter ">
                                        <CountUp end={stats.activeJobs} duration={2.5} />
                                    </div>

                                    <div className="wt-card-bottom ">
                                        <h4 className="m-b0">Active Jobs</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-6 col-md-12 mb-3">
                        <div className="panel panel-default">
                            <div className="panel-body wt-panel-body gradi-2 dashboard-card ">
                                <div className="wt-card-wrap">
                                    <div className="wt-card-icon"><i className="far fa-file-alt" /></div>
                                    <div className="wt-card-right  wt-total-listing-view counter ">
                                        <CountUp end={stats.totalApplications} duration={2.5} />
                                    </div>

                                    <div className="wt-card-bottom">
                                        <h4 className="m-b0">Total Applications</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-6 col-md-12 mb-3">
                        <div className="panel panel-default">
                            <div className="panel-body wt-panel-body gradi-4 dashboard-card ">
                                <div className="wt-card-wrap">
                                    <div className="wt-card-icon"><i className="far fa-bell" /></div>
                                    <div className="wt-card-right wt-total-listing-bookmarked counter ">
                                        <CountUp end={stats.shortlisted} duration={2.5} />
                                    </div>
                                    
                                    <div className="wt-card-bottom">
                                        <h4 className="m-b0">Shortlisted</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="twm-pro-view-chart-wrap">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-12 mb-4">
                        <EmployerDashboardJobFunnelChart stats={stats} />
                    </div>

                    <div className="col-lg-6 col-md-12 col-12 mb-4">
                        <RecentJobPosts />
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmpDashboardPage;