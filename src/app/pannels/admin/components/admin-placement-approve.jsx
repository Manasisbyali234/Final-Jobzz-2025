import { useState, useEffect } from 'react';
import { api } from '../../../../utils/api';

function AdminPlacementOfficersApproved() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApprovedPlacements();
    }, []);

    const fetchApprovedPlacements = async () => {
        try {
            setLoading(true);
            const response = await api.getAllPlacements();
            if (response.success) {
                const approvedPlacements = response.data.filter(placement => 
                    placement.status === 'active' || placement.isApproved
                );
                setPlacements(approvedPlacements);
            } else {
                setError(response.message || 'Failed to fetch placement officers');
            }
        } catch (error) {
            setError('Error fetching placement officers');
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
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Approved Placement Officers</h2>
            </div>

            <div className="panel panel-default site-bg-white">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">Approved Placement Officers ({placements.length})</h4>
                </div>

                <div className="panel-body wt-panel-body">
                    {error && (
                        <div className="alert alert-danger m-b20">{error}</div>
                    )}
                    <div className="p-a20 table-responsive">
                        <table className="table twm-table table-striped table-borderless">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Join Date</th>
                                    <th>File Uploaded</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {placements.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">No approved placement officers found</td>
                                    </tr>
                                ) : (
                                    placements.map((placement) => (
                                        <tr key={placement._id}>
                                            <td>
                                                <span className="site-text-primary">
                                                    {placement.name}
                                                </span>
                                            </td>
                                            <td>{placement.email}</td>
                                            <td>{placement.phone || 'N/A'}</td>
                                            <td>{formatDate(placement.createdAt)}</td>
                                            <td>
                                                {placement.fileName ? (
                                                    <span className="text-success">
                                                        <i className="fa fa-check"></i> {placement.fileName}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">No file</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="text-success">Approved</span>
                                            </td>
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
                                                    onClick={() => window.open(`/admin/placement-details/${placement._id}`, '_blank')}
                                                >
                                                    <i className="fa fa-eye"></i>
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

export default AdminPlacementOfficersApproved;