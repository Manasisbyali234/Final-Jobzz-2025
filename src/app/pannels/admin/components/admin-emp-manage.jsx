import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../../../../utils/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './admin-emp-manage-styles.css';

function AdminEmployersAllRequest() {
    const navigate = useNavigate();
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true
        });
        fetchEmployers();
    }, []);

    const fetchEmployers = async () => {
        try {
            setLoading(true);
            const response = await api.getAllEmployers();
            if (response.success) {
                const pendingEmployers = response.data.filter(emp => 
                    emp.status !== 'approved' && emp.status !== 'rejected' && !emp.isApproved
                );
                setEmployers(pendingEmployers);
            } else {
                setError(response.message || 'Failed to fetch employers');
            }
        } catch (error) {
            setError('Error fetching employers');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (employerId) => {
        try {
            const response = await api.updateEmployerStatus(employerId, 'approved');
            if (response.success) {
                setEmployers(employers.filter(emp => emp._id !== employerId));
                alert('Employer approved successfully! Notification sent to employer.');
            } else {
                alert('Failed to approve employer');
            }
        } catch (error) {
            alert('Error approving employer');
            console.error('Error:', error);
        }
    };

    const handleReject = async (employerId) => {
        try {
            const response = await api.updateEmployerStatus(employerId, 'rejected');
            if (response.success) {
                setEmployers(employers.filter(emp => emp._id !== employerId));
                alert('Employer rejected successfully! Notification sent to employer.');
            } else {
                alert('Failed to reject employer');
            }
        } catch (error) {
            alert('Error rejecting employer');
            console.error('Error:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="admin-emp-manage-container">
                <div className="admin-emp-header" data-aos="fade-down">
                    <h2>
                        <i className="fa fa-building me-3"></i>
                        Employer Management
                    </h2>
                    <p className="admin-emp-subtitle mb-0">
                        <i className="fa fa-users-cog me-2"></i>
                        Manage and review employer applications
                    </p>
                </div>
                <div className="loading-container" data-aos="fade-up">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading employers...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Employers Details</h2>
            </div>

            <div className="panel panel-default site-bg-white">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">Pending Employers ({employers.length})</h4>
                </div>

                <div className="panel-body wt-panel-body">
                    {error && (
                        <div className="alert alert-danger m-b20">{error}</div>
                    )}
                    <div className="p-a20 table-responsive">
                        <table className="table twm-table table-striped table-borderless">
                            <thead>
                                <tr>
                                    <th>Company Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Join Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {employers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">No employers found</td>
                                    </tr>
                                ) : (
                                    employers.map((employer) => (
                                        <tr key={employer._id}>
                                            <td>
                                                <span className="site-text-primary">
                                                    {employer.companyName || employer.email}
                                                </span>
                                            </td>
                                            <td>{employer.email}</td>
                                            <td>{employer.phone || 'N/A'}</td>
                                            <td>{formatDate(employer.createdAt)}</td>
                                            <td>
                                                <span className={employer.status === 'approved' ? 'text-success' : 
                                                               employer.status === 'rejected' ? 'text-danger' : 'text-warning'}>
                                                    {employer.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    style={{
                                                        backgroundColor: "green",
                                                        color: "#fff",
                                                        border: "none",
                                                        padding: "5px 10px",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => handleApprove(employer._id)}
                                                >
                                                    Approve
                                                </button>
                                                
                                                <button
                                                    style={{
                                                        backgroundColor: "#dc3545",
                                                        color: "#fff",
                                                        border: "none",
                                                        padding: "5px 10px",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                    className="ms-3"
                                                    onClick={() => handleReject(employer._id)}
                                                >
                                                    Reject
                                                </button>

                                                <button
                                                    style={{
                                                        backgroundColor: "#5781FF",
                                                        color: "#fff",
                                                        border: "none",
                                                        padding: "5px 10px",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                    className="ms-3"
                                                    onClick={() => navigate(`/admin/employer-details/${employer._id}`)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminEmployersAllRequest;