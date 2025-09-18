import { useState, useEffect } from 'react';
import JobZImage from "../../../../common/jobz-img";
import { api } from '../../../../utils/api';

function EmpManageJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await api.getEmployerJobs();
            if (response.success) {
                setJobs(response.jobs || []);
            } else {
                setError(response.message || 'Failed to fetch jobs');
            }
        } catch (error) {
            setError('Error fetching jobs');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'active': { color: '#28a745', text: 'Active' },
            'pending': { color: '#ffc107', text: 'Pending' },
            'closed': { color: '#dc3545', text: 'Closed' },
            'expired': { color: '#6c757d', text: 'Expired' }
        };
        const config = statusConfig[status] || { color: '#6c757d', text: 'Unknown' };
        return (
            <span 
                style={{
                    backgroundColor: config.color,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }}
            >
                {config.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                const response = await api.deleteJob(jobId);
                if (response.success) {
                    setJobs(jobs.filter(job => job._id !== jobId));
                    alert('Job deleted successfully');
                } else {
                    alert('Failed to delete job');
                }
            } catch (error) {
                alert('Error deleting job');
                console.error('Error:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="wt-admin-right-page-header clearfix">
                <h2>Manage Jobs</h2>
                <div className="panel panel-default">
                    <div className="panel-body wt-panel-body p-a20">
                        <div className="text-center">Loading jobs...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Manage Jobs</h2>
                <div className="breadcrumbs"><a href="#">Home</a><a href="#">Dashboard</a><span>My Job Listing</span></div>
            </div>
            {/*Basic Information*/}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0"><i className="fa fa-suitcase" /> Job Details ({jobs.length})</h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 m-b30 ">
                    {error && (
                        <div className="alert alert-danger m-b20">{error}</div>
                    )}
                    <div className="twm-D_table p-a20 table-responsive">
                        <table id="jobs_bookmark_table" className="table table-bordered twm-bookmark-list-wrap">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Applications</th>
                                    <th>Created & Expires</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">No jobs found</td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job._id}>
                                            <td>
                                                <div className="twm-bookmark-list">
                                                    <div className="twm-media">
                                                        <div className="twm-media-pic">
                                                            <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                                                        </div>
                                                    </div>
                                                    <div className="twm-mid-content">
                                                        <div className="twm-job-title">
                                                            <h4>{job.title}</h4>
                                                            <p className="twm-bookmark-address">
                                                                <i className="feather-map-pin" />{job.location || 'Location not specified'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{job.category || 'N/A'}</td>
                                            <td>
                                                <div className="twm-jobs-category">
                                                    {getStatusBadge(job.status)}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="site-text-primary">
                                                    {job.applicationCount || 0} Applied
                                                </span>
                                            </td>
                                            <td>
                                                <div>{formatDate(job.createdAt)}</div>
                                                <div>{job.expiryDate ? formatDate(job.expiryDate) : 'No expiry'}</div>
                                            </td>
                                            <td>
                                                <div className="twm-table-controls">
                                                    <ul className="twm-DT-controls-icon list-unstyled">
                                                        <li>
                                                            <button 
                                                                title="View Applications" 
                                                                data-bs-toggle="tooltip" 
                                                                data-bs-placement="top"
                                                                onClick={() => window.location.href = `/employer/job-applications/${job._id}`}
                                                            >
                                                                <span className="fa fa-eye" />
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button 
                                                                title="Edit" 
                                                                data-bs-toggle="tooltip" 
                                                                data-bs-placement="top"
                                                                onClick={() => window.location.href = `/employer/edit-job/${job._id}`}
                                                            >
                                                                <span className="far fa-edit" />
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button 
                                                                title="Delete" 
                                                                data-bs-toggle="tooltip" 
                                                                data-bs-placement="top"
                                                                onClick={() => handleDelete(job._id)}
                                                            >
                                                                <span className="far fa-trash-alt" />
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
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
    )
}
export default EmpManageJobsPage;