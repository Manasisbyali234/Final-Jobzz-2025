import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../../../../utils/api';

function AdminEmployersRejected() {
    const navigate = useNavigate();
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRejectedEmployers();
    }, []);

    const fetchRejectedEmployers = async () => {
        try {
            setLoading(true);
            const response = await api.getAllEmployers();
            if (response.success) {
                const rejectedEmployers = response.data.filter(emp => 
                    emp.status === 'rejected' || (emp.isApproved === false && emp.status === 'inactive')
                );
                setEmployers(rejectedEmployers);
            } else {
                setError(response.message || 'Failed to fetch rejected employers');
            }
        } catch (error) {
            setError('Error fetching rejected employers');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="wt-admin-right-page-header clearfix">
                <h2>Rejected Employers</h2>
                <div className="panel panel-default site-bg-white">
                    <div className="panel-body wt-panel-body p-a20">
                        <div className="text-center">Loading rejected employers...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Rejected Employers</h2>
            </div>

            <div className="panel panel-default site-bg-white">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">Rejected Employers ({employers.length})</h4>
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
                                    <th>Rejected Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {employers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">No rejected employers found</td>
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
                                            <td>{formatDate(employer.updatedAt || employer.createdAt)}</td>
                                            <td>
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

export default AdminEmployersRejected;