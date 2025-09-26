import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../../../../utils/api';

function AdminPlacementOfficersAllRequest() {
    const navigate = useNavigate();
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPlacements();
    }, []);

    const fetchPlacements = async () => {
        try {
            setLoading(true);
            console.log('Fetching placements...');
            const response = await api.getAllPlacements();
            console.log('API Response:', response);
            if (response.success) {
                // Show all placements for debugging, filter later
                const allPlacements = response.data || [];
                console.log('All placements:', allPlacements);
                const pendingPlacements = allPlacements.filter(placement => 
                    placement.status === 'pending' || (!placement.status && !placement.isApproved)
                );
                console.log('Pending placements:', pendingPlacements);
                setPlacements(pendingPlacements);
            } else {
                console.error('API Error:', response);
                setError(response.message || 'Failed to fetch placement officers');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            setError('Error fetching placement officers: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (placementId) => {
        try {
            const response = await api.updatePlacementStatus(placementId, 'approved');
            if (response.success) {
                setPlacements(placements.filter(placement => placement._id !== placementId));
                alert('Placement officer approved successfully!');
            } else {
                alert('Failed to approve placement officer');
            }
        } catch (error) {
            alert('Error approving placement officer');
            console.error('Error:', error);
        }
    };

    const handleReject = async (placementId) => {
        try {
            const response = await api.updatePlacementStatus(placementId, 'rejected');
            if (response.success) {
                setPlacements(placements.filter(placement => placement._id !== placementId));
                alert('Placement officer rejected successfully!');
            } else {
                alert('Failed to reject placement officer');
            }
        } catch (error) {
            alert('Error rejecting placement officer');
            console.error('Error:', error);
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
                <h2>Placement Officers Details</h2>
            </div>

            <div className="panel panel-default site-bg-white">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">Pending Placement Officers ({placements.length})</h4>
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
                                        <td colSpan="7" className="text-center">No placement officers found</td>
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
                                                <span className={placement.status === 'approved' ? 'text-success' : 
                                                               placement.status === 'rejected' ? 'text-danger' : 'text-warning'}>
                                                    {placement.status || 'Pending'}
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
                                                    onClick={() => handleApprove(placement._id)}
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
                                                    onClick={() => handleReject(placement._id)}
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
                                                    onClick={() => navigate(`/admin/placement-details/${placement._id}`)}
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

export default AdminPlacementOfficersAllRequest;