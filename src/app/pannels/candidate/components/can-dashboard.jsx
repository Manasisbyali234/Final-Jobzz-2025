// MODERN CANDIDATE DASHBOARD

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadScript } from "../../../../globals/constants";
import { api } from "../../../../utils/api";
import { useAuth } from "../../../../contexts/AuthContext";
import { candidate, canRoute } from "../../../../globals/route-names";
import CountUp from "react-countup";
import "../../common/modern-dashboard.css";

function CanDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        applied: 0,
        inProgress: 0,
        shortlisted: 0,
        profileCompletion: 0,
        completionMessage: 'Loading...'
    });
    const [loading, setLoading] = useState(true);
    const [recentActivities] = useState([
        { id: 1, type: 'viewed', company: 'TechCorp', position: 'Frontend Developer', time: '2 hours ago', icon: 'fa-eye' },
        { id: 2, type: 'shortlisted', company: 'StartupXYZ', position: 'React Developer', time: '1 day ago', icon: 'fa-star' },
        { id: 3, type: 'match', company: 'InnovateLab', position: 'Full Stack Developer', time: '2 days ago', icon: 'fa-heart' }
    ]);

    useEffect(() => {
        loadScript("js/custom.js");
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('candidateToken');
            if (!token) {
                console.log('No candidate token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/candidate/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                setDashboardData({
                    applied: data.stats.applied || 0,
                    inProgress: data.stats.inProgress || 0,
                    shortlisted: data.stats.shortlisted || 0,
                    profileCompletion: data.stats.profileCompletion || 0,
                    completionMessage: data.stats.completionMessage || 'Complete your profile to improve visibility.'
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'viewed': return '#007bff';
            case 'shortlisted': return '#28a745';
            case 'match': return '#ff6b35';
            default: return '#6c757d';
        }
    };

    return (
        <div className="twm-right-section-panel" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Welcome Section */}
            <div style={{ padding: '2rem', backgroundColor: 'white', marginBottom: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: '1.8rem', fontWeight: '600' }}>
                    Welcome back, {user?.firstName || 'Candidate'}! 👋
                </h2>
                <p style={{ color: '#6c757d', margin: 0 }}>Here's what's happening with your job search today.</p>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-lg-4 col-md-6 mb-3">
                    <div style={{ 
                        backgroundColor: '#E3F2FD', 
                        padding: '2rem', 
                        borderRadius: '16px', 
                        boxShadow: '0 4px 20px rgba(227, 242, 253, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-5px)';
                        e.target.style.boxShadow = '0 8px 30px rgba(227, 242, 253, 0.4)';
                        e.target.style.backgroundColor = '#BBDEFB';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 20px rgba(227, 242, 253, 0.3)';
                        e.target.style.backgroundColor = '#E3F2FD';
                    }}>
                        <div className="text-center">
                            <i className="fa fa-paper-plane" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}></i>
                            <h3 style={{ margin: 0, color: 'white', fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <CountUp end={dashboardData.applied} duration={2} />
                            </h3>
                            <p style={{ margin: 0, color: 'white', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Applied</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-3">
                    <div style={{ 
                        backgroundColor: '#FFF8E1', 
                        padding: '2rem', 
                        borderRadius: '16px', 
                        boxShadow: '0 4px 20px rgba(255, 248, 225, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-5px)';
                        e.target.style.boxShadow = '0 8px 30px rgba(255, 248, 225, 0.4)';
                        e.target.style.backgroundColor = '#FFF3C4';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 20px rgba(255, 248, 225, 0.3)';
                        e.target.style.backgroundColor = '#FFF8E1';
                    }}>
                        <div className="text-center">
                            <i className="fa fa-clock" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}></i>
                            <h3 style={{ margin: 0, color: 'white', fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <CountUp end={dashboardData.inProgress} duration={2} />
                            </h3>
                            <p style={{ margin: 0, color: 'white', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>In Progress</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-3">
                    <div style={{ 
                        backgroundColor: '#E8F5E8', 
                        padding: '2rem', 
                        borderRadius: '16px', 
                        boxShadow: '0 4px 20px rgba(232, 245, 232, 0.3)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-5px)';
                        e.target.style.boxShadow = '0 8px 30px rgba(232, 245, 232, 0.4)';
                        e.target.style.backgroundColor = '#C8E6C9';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 20px rgba(232, 245, 232, 0.3)';
                        e.target.style.backgroundColor = '#E8F5E8';
                    }}>
                        <div className="text-center">
                            <i className="fa fa-star" style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}></i>
                            <h3 style={{ margin: 0, color: 'white', fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <CountUp end={dashboardData.shortlisted} duration={2} />
                            </h3>
                            <p style={{ margin: 0, color: 'white', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Shortlisted</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Profile Completion Widget */}
                <div className="col-lg-6 mb-4">
                    <div style={{ 
                        backgroundColor: 'white', 
                        padding: '2rem', 
                        borderRadius: '12px', 
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        height: '100%'
                    }}>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                            {/* Progress Circle */}
                            <div className="flex-shrink-0">
                                <div style={{ 
                                    position: 'relative', 
                                    display: 'inline-block',
                                    width: '100px',
                                    height: '100px'
                                }}>
                                    <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#e9ecef" strokeWidth="6"/>
                                        <circle 
                                            cx="50" 
                                            cy="50" 
                                            r="40" 
                                            fill="none" 
                                            stroke="#ff6b35" 
                                            strokeWidth="6"
                                            strokeDasharray={`${2 * Math.PI * 40}`}
                                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - dashboardData.profileCompletion / 100)}`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '50%', 
                                        left: '50%', 
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '1.3rem',
                                        fontWeight: '700',
                                        color: '#2c3e50'
                                    }}>
                                        {dashboardData.profileCompletion}%
                                    </div>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-grow-1 text-center text-md-start">
                                <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: '600' }}>
                                    Complete Your Profile
                                </h4>
                                <p style={{ 
                                    fontSize: '0.85rem', 
                                    color: '#6c757d', 
                                    margin: '0 0 1.5rem 0',
                                    lineHeight: '1.4'
                                }}>
                                    {dashboardData.completionMessage}
                                </p>
                                
                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <button 
                                        className="btn" 
                                        onClick={() => navigate(canRoute(candidate.PROFILE))}
                                        style={{ 
                                            backgroundColor: '#ff6b35', 
                                            color: 'white', 
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '0.6rem 1.2rem',
                                            fontSize: '0.85rem',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Update Profile
                                    </button>
                                    <button 
                                        className="btn" 
                                        onClick={() => window.open(`/candidate-detail/${user?.id || 1}`, '_blank')}
                                        style={{ 
                                            backgroundColor: 'transparent', 
                                            color: '#ff6b35', 
                                            border: '1px solid #ff6b35',
                                            borderRadius: '8px',
                                            padding: '0.6rem 1.2rem',
                                            fontSize: '0.85rem',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Preview Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="col-lg-6 mb-4">
                    <div style={{ 
                        backgroundColor: 'white', 
                        padding: '2rem', 
                        borderRadius: '12px', 
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        height: '100%'
                    }}>
                        <h4 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>
                            Recent Activity
                        </h4>
                        
                        <div>
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="d-flex align-items-center mb-3 pb-3" style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <div style={{ 
                                        backgroundColor: `${getActivityColor(activity.type)}20`, 
                                        padding: '8px', 
                                        borderRadius: '50%', 
                                        marginRight: '1rem',
                                        minWidth: '40px',
                                        textAlign: 'center'
                                    }}>
                                        <i className={`fa ${activity.icon}`} style={{ color: getActivityColor(activity.type), fontSize: '0.9rem' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p style={{ margin: 0, color: '#2c3e50', fontSize: '0.9rem', fontWeight: '500' }}>
                                            {activity.type === 'viewed' && 'Application Viewed'}
                                            {activity.type === 'shortlisted' && 'You were Shortlisted'}
                                            {activity.type === 'match' && 'New Job Match'}
                                        </p>
                                        <p style={{ margin: 0, color: '#6c757d', fontSize: '0.8rem' }}>
                                            {activity.position} at {activity.company}
                                        </p>
                                        <small style={{ color: '#adb5bd' }}>{activity.time}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#6c757d', 
                fontSize: '0.9rem',
                borderTop: '1px solid #e9ecef',
                marginTop: '2rem'
            }}>
                © 2025 JobZZ · All rights reserved.
            </div>
        </div>
    );
}

export default CanDashboardPage;