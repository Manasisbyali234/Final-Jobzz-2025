import React, { useState, useEffect } from 'react';
import CountUp from "react-countup";

function EmpDashboardPage() {
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        shortlisted: 0
    });
    const [employer, setEmployer] = useState({ companyName: 'Loading...', logo: null });
    const [recentActivities] = useState([
        { id: 1, type: 'application', candidate: 'John Smith', position: 'Frontend Developer', time: '30 minutes ago', icon: 'fa-paper-plane' },
        { id: 2, type: 'shortlisted', candidate: 'Sarah Johnson', position: 'React Developer', time: '2 hours ago', icon: 'fa-star' },
        { id: 3, type: 'expiring', position: 'Full Stack Developer', time: 'Expires in 2 days', icon: 'fa-clock' }
    ]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('employerToken');
            if (!token) {
                console.log('No employer token found');
                return;
            }

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
                    logo: profileData.profile.logo 
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'application': return 'fa-paper-plane';
            case 'shortlisted': return 'fa-star';
            case 'expiring': return 'fa-clock';
            default: return 'fa-info-circle';
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'application': return '#007bff';
            case 'shortlisted': return '#28a745';
            case 'expiring': return '#ffc107';
            default: return '#6c757d';
        }
    };

    return (
        <div className="twm-right-section-panel" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '2rem' }}>
            {/* Header Section */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: '1.8rem', fontWeight: '600' }}>
                        Welcome back! 👋
                    </h2>
                    <p style={{ color: '#6c757d', margin: 0 }}>Here's an overview of your recruitment activities today.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={employer.logo || 'images/user-avtar/pic4.jpg'} alt="Company Logo" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                        <h4 style={{ margin: 0, color: '#2c3e50', fontSize: '1.1rem' }}>{employer.companyName}</h4>
                        <p style={{ margin: 0, color: '#6c757d', fontSize: '0.9rem' }}>Employer</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Grid Layout */}
            <div className="row mb-4">
                {/* Jobs Posted Card */}
                <div className="col-xl-4 col-lg-6 col-md-6 mb-4">
                    <div style={{ 
                        backgroundColor: '#E3F2FD',
                        padding: '2.5rem', 
                        borderRadius: '20px', 
                        boxShadow: '0 10px 30px rgba(227, 242, 253, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(227, 242, 253, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(227, 242, 253, 0.3)';
                    }}>
                        {/* Background Pattern */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }}></div>
                        
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div style={{ 
                                backgroundColor: 'rgba(255,255,255,0.2)', 
                                padding: '12px', 
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <i className="fa fa-briefcase" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                            </div>
                            <div className="text-end">
                                <h2 style={{ 
                                    margin: 0, 
                                    color: 'white', 
                                    fontSize: '2.5rem', 
                                    fontWeight: '800',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <CountUp end={stats.totalJobs} duration={2.5} />
                                </h2>
                            </div>
                        </div>
                        
                        <div>
                            <h4 style={{ 
                                margin: 0, 
                                color: 'white', 
                                fontSize: '1.1rem', 
                                fontWeight: '600',
                                marginBottom: '0.5rem'
                            }}>Jobs Posted</h4>
                            <p style={{ 
                                margin: 0, 
                                color: 'rgba(255,255,255,0.8)', 
                                fontSize: '0.85rem',
                                fontWeight: '400'
                            }}>Total job listings created</p>
                        </div>
                    </div>
                </div>

                {/* Applications Card */}
                <div className="col-xl-4 col-lg-6 col-md-6 mb-4">
                    <div style={{ 
                        backgroundColor: '#FFF8E1',
                        padding: '2.5rem', 
                        borderRadius: '20px', 
                        boxShadow: '0 10px 30px rgba(255, 248, 225, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 248, 225, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 248, 225, 0.3)';
                    }}>
                        {/* Background Pattern */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }}></div>
                        
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div style={{ 
                                backgroundColor: 'rgba(255,255,255,0.2)', 
                                padding: '12px', 
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <i className="fa fa-paper-plane" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                            </div>
                            <div className="text-end">
                                <h2 style={{ 
                                    margin: 0, 
                                    color: 'white', 
                                    fontSize: '2.5rem', 
                                    fontWeight: '800',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <CountUp end={stats.totalApplications} duration={2.5} />
                                </h2>
                            </div>
                        </div>
                        
                        <div>
                            <h4 style={{ 
                                margin: 0, 
                                color: 'white', 
                                fontSize: '1.1rem', 
                                fontWeight: '600',
                                marginBottom: '0.5rem'
                            }}>Applications</h4>
                            <p style={{ 
                                margin: 0, 
                                color: 'rgba(255,255,255,0.8)', 
                                fontSize: '0.85rem',
                                fontWeight: '400'
                            }}>Total applications received</p>
                        </div>
                    </div>
                </div>

                {/* Shortlisted Card */}
                <div className="col-xl-4 col-lg-6 col-md-6 mb-4">
                    <div style={{ 
                        backgroundColor: '#E8F5E8',
                        padding: '2.5rem', 
                        borderRadius: '20px', 
                        boxShadow: '0 10px 30px rgba(232, 245, 232, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(232, 245, 232, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(232, 245, 232, 0.3)';
                    }}>
                        {/* Background Pattern */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }}></div>
                        
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div style={{ 
                                backgroundColor: 'rgba(255,255,255,0.2)', 
                                padding: '12px', 
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <i className="fa fa-star" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                            </div>
                            <div className="text-end">
                                <h2 style={{ 
                                    margin: 0, 
                                    color: 'white', 
                                    fontSize: '2.5rem', 
                                    fontWeight: '800',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <CountUp end={stats.shortlisted} duration={2.5} />
                                </h2>
                            </div>
                        </div>
                        
                        <div>
                            <h4 style={{ 
                                margin: 0, 
                                color: 'white', 
                                fontSize: '1.1rem', 
                                fontWeight: '600',
                                marginBottom: '0.5rem'
                            }}>Shortlisted</h4>
                            <p style={{ 
                                margin: 0, 
                                color: 'rgba(255,255,255,0.8)', 
                                fontSize: '0.85rem',
                                fontWeight: '400'
                            }}>Candidates shortlisted</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Job Posting Status Widget */}
                <div className="col-lg-6 mb-4">
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: '100%' }}>
                        <h4 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>
                            Job Posting Status
                        </h4>
                        
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: '#2c3e50', fontSize: '0.9rem', fontWeight: '500' }}>Active Jobs</span>
                                <span style={{ color: '#28a745', fontSize: '1.1rem', fontWeight: '600' }}>{stats.activeJobs}</span>
                            </div>
                            <div style={{ backgroundColor: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ backgroundColor: '#28a745', height: '100%', width: `${stats.totalJobs > 0 ? (stats.activeJobs / stats.totalJobs) * 100 : 0}%`, borderRadius: '4px' }}></div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: '#2c3e50', fontSize: '0.9rem', fontWeight: '500' }}>Expired Jobs</span>
                                <span style={{ color: '#dc3545', fontSize: '1.1rem', fontWeight: '600' }}>{stats.totalJobs - stats.activeJobs}</span>
                            </div>
                            <div style={{ backgroundColor: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ backgroundColor: '#dc3545', height: '100%', width: `${stats.totalJobs > 0 ? ((stats.totalJobs - stats.activeJobs) / stats.totalJobs) * 100 : 0}%`, borderRadius: '4px' }}></div>
                            </div>
                        </div>

                        <button className="btn w-100 mt-3" style={{ backgroundColor: '#FF6B00', color: 'white', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.9rem', fontWeight: '500' }} onClick={() => window.location.href = '/employer/post-job'}>
                            <i className="fa fa-plus" style={{ marginRight: '0.5rem' }}></i>
                            Post New Job
                        </button>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="col-lg-6 mb-4">
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: '100%' }}>
                        <h4 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>
                            Recent Activity
                        </h4>
                        
                        <div>
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="d-flex align-items-center mb-3 pb-3" style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <div style={{ backgroundColor: `${getActivityColor(activity.type)}20`, padding: '8px', borderRadius: '50%', marginRight: '1rem', minWidth: '40px', textAlign: 'center' }}>
                                        <i className={`fa ${getActivityIcon(activity.type)}`} style={{ color: getActivityColor(activity.type), fontSize: '0.9rem' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p style={{ margin: 0, color: '#2c3e50', fontSize: '0.9rem', fontWeight: '500' }}>
                                            {activity.type === 'application' && '📨 New Application Received'}
                                            {activity.type === 'shortlisted' && '⭐ Candidate Shortlisted'}
                                            {activity.type === 'expiring' && '⏳ Job Posting Expiring Soon'}
                                        </p>
                                        <p style={{ margin: 0, color: '#6c757d', fontSize: '0.8rem' }}>
                                            {activity.candidate ? `${activity.candidate} - ${activity.position}` : activity.position}
                                        </p>
                                        <small style={{ color: '#adb5bd' }}>{activity.time}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <button className="btn w-100 mt-3" style={{ backgroundColor: 'transparent', color: '#FF6B00', border: '1px solid #FF6B00', borderRadius: '8px', padding: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                            View All Activity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmpDashboardPage;