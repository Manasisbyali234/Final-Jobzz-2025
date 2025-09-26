import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../../utils/api';

function PlacementDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [placement, setPlacement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [credits, setCredits] = useState(0);
    const [assigningCredits, setAssigningCredits] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [studentData, setStudentData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        fetchPlacementDetails();
    }, [id]);

    const fetchPlacementDetails = async () => {
        try {
            setLoading(true);
            const response = await api.getPlacementDetails(id);
            if (response.success) {
                setPlacement(response.placement);
                setCredits(response.placement.credits || 0);
            } else {
                setError(response.message || 'Failed to fetch placement details');
            }
        } catch (error) {
            setError('Error fetching placement details');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/placements/${id}/download`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = placement.fileName || 'student_data.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Failed to download file');
            }
        } catch (error) {
            alert('Error downloading file');
            console.error('Error:', error);
        }
    };

    const handleViewData = async () => {
        try {
            setLoadingData(true);
            const response = await fetch(`http://localhost:5000/api/admin/placements/${id}/data`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setStudentData(data.students || []);
            } else {
                alert('Failed to load student data');
            }
        } catch (error) {
            alert('Error loading student data');
            console.error('Error:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleApprove = async () => {
        try {
            const response = await api.updatePlacementStatus(id, 'approved');
            if (response.success) {
                alert('Placement officer approved successfully! Candidates will be processed automatically.');
                fetchPlacementDetails(); // Refresh data
            } else {
                alert('Failed to approve placement officer');
            }
        } catch (error) {
            alert('Error approving placement officer');
            console.error('Error:', error);
        }
    };

    const handleProcessData = async () => {
        try {
            setProcessing(true);
            const response = await api.processPlacementData(id);
            console.log('Process response:', response);
            if (response.success) {
                alert(`Processing completed! ${response.stats.created} candidates created, ${response.stats.skipped} skipped.`);
                fetchPlacementDetails(); // Refresh data
            } else {
                alert(`Failed to process placement data: ${response.message || 'Unknown error'}`);
                console.error('Process error:', response);
            }
        } catch (error) {
            alert(`Error processing placement data: ${error.message}`);
            console.error('Error:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        try {
            const response = await api.updatePlacementStatus(id, 'rejected');
            if (response.success) {
                alert('Placement officer rejected successfully!');
                navigate('/admin/admin-placement-rejected');
            } else {
                alert('Failed to reject placement officer');
            }
        } catch (error) {
            alert('Error rejecting placement officer');
            console.error('Error:', error);
        }
    };

    const handleAssignCredits = async () => {
        try {
            setAssigningCredits(true);
            const response = await api.assignPlacementCredits(id, credits);
            if (response.success) {
                alert('Credits assigned successfully!');
                setPlacement(response.placement);
                // Refresh student data to show updated credits
                if (studentData.length > 0) {
                    handleViewData();
                }
            } else {
                alert('Failed to assign credits');
            }
        } catch (error) {
            alert('Error assigning credits');
            console.error('Error:', error);
        } finally {
            setAssigningCredits(false);
        }
    };

    if (loading) {
        return (
            <div className="wt-admin-right-page-header clearfix">
                <h2>Loading...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wt-admin-right-page-header clearfix">
                <h2>Error: {error}</h2>
            </div>
        );
    }

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Placement Officer Details</h2>
                <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/admin-placement-manage')}
                >
                    Back to List
                </button>
            </div>

            <div className="panel panel-default site-bg-white">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">Placement Officer Information</h4>
                </div>

                <div className="panel-body wt-panel-body p-a20">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label><strong>Name:</strong></label>
                                <p>{placement.name}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label><strong>Email:</strong></label>
                                <p>{placement.email}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label><strong>Phone:</strong></label>
                                <p>{placement.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label><strong>Registration Date:</strong></label>
                                <p>{new Date(placement.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label><strong>Status:</strong></label>
                                <p>
                                    <span className={placement.status === 'approved' ? 'text-success' : 
                                                   placement.status === 'rejected' ? 'text-danger' : 'text-warning'}>
                                        {placement.status || 'Pending'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label><strong>Uploaded File:</strong></label>
                                {placement.fileName ? (
                                    <div>
                                        <p>{placement.fileName}</p>
                                        <button 
                                            className="btn btn-primary btn-sm"
                                            onClick={handleDownload}
                                        >
                                            <i className="fa fa-download"></i> Download File
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-muted">No file uploaded</p>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label><strong>Processing Status:</strong></label>
                                <div>
                                    {placement.isProcessed ? (
                                        <span className="processing-status processed">
                                            <i className="fa fa-check"></i> Processed ({placement.candidatesCreated || 0} candidates created)
                                        </span>
                                    ) : (
                                        <span className="processing-status pending">
                                            <i className="fa fa-clock-o"></i> Not processed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-6">
                            <h5>Credits Management</h5>
                            <div className="form-group">
                                <label><strong>Assign Credits:</strong></label>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="number"
                                        className="form-control me-3"
                                        style={{width: '150px'}}
                                        value={credits}
                                        onChange={(e) => setCredits(Math.min(10000, Math.max(0, parseInt(e.target.value) || 0)))}
                                        min="0"
                                        max="10000"
                                    />
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={handleAssignCredits}
                                        disabled={assigningCredits}
                                    >
                                        {assigningCredits ? 'Assigning...' : 'Assign Credits'}
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleAssignCredits}
                                        disabled={assigningCredits}
                                    >
                                        {assigningCredits ? 'Updating...' : 'Update Credits'}
                                    </button>
                                </div>
                                <small className="text-muted">Current Credits: {placement.credits || 0}</small>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h5>Actions</h5>
                            <div className="mb-2">
                                <button
                                    className="btn btn-success placement-action-btn"
                                    onClick={handleApprove}
                                    disabled={placement.status === 'approved'}
                                >
                                    <i className="fa fa-check"></i> Approve
                                </button>
                                <button
                                    className="btn btn-danger placement-action-btn"
                                    onClick={handleReject}
                                    disabled={placement.status === 'rejected'}
                                >
                                    <i className="fa fa-times"></i> Reject
                                </button>
                            </div>
                            {placement.status === 'active' && placement.fileName && !placement.isProcessed && (
                                <div className="placement-process-info">
                                    <button
                                        className="btn btn-info placement-action-btn"
                                        onClick={handleProcessData}
                                        disabled={processing}
                                    >
                                        <i className="fa fa-cogs"></i> {processing ? 'Processing...' : 'Process Student Data'}
                                    </button>
                                    <small className="d-block text-muted">
                                        This will create candidate accounts from the Excel file with their email and password
                                    </small>
                                </div>
                            )}
                            {placement.isProcessed && (
                                <div className="placement-process-info">
                                    <i className="fa fa-info-circle"></i> 
                                    <strong>Processing Complete:</strong> {placement.candidatesCreated || 0} candidates can now sign in with their credentials from the Excel file.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {studentData.length > 0 && (
                <div className="panel panel-default site-bg-white mt-4">
                    <div className="panel-heading wt-panel-heading p-a20">
                        <h4 className="panel-tittle m-a0">Student Data ({studentData.length} records)</h4>
                    </div>
                    <div className="panel-body wt-panel-body p-a20">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Email</th>
                                        <th>Password</th>
                                        <th>Phone</th>
                                        <th>Credits</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentData.map((student, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{student.email || 'N/A'}</td>
                                            <td><code>{student.password || 'N/A'}</code></td>
                                            <td>{student.phone || 'N/A'}</td>
                                            <td>{placement.credits || student.credits || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PlacementDetails;