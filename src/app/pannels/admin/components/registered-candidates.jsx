import { useState, useEffect, useRef } from 'react';
import { api } from '../../../../utils/api';

function RegisteredCandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [shortlistedApplications, setShortlistedApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const modalRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [candidatesResponse, shortlistedResponse] = await Promise.all([
                api.getRegisteredCandidates(),
                api.getShortlistedApplications()
            ]);
            
            if (candidatesResponse.success) {
                setCandidates(candidatesResponse.data);
            }
            if (shortlistedResponse.success) {
                setShortlistedApplications(shortlistedResponse.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCandidateShortlistInfo = (candidateId) => {
        const applications = shortlistedApplications.filter(
            app => app.candidateId?._id === candidateId || app.candidateId === candidateId
        );
        
        if (applications.length === 0) {
            return { status: 'Not Shortlisted', round: '-', selected: '-' };
        }
        
        const latestApp = applications[applications.length - 1];
        return {
            status: 'Shortlisted',
            round: latestApp.currentRound || 'Round 1',
            selected: latestApp.finalStatus === 'selected' ? 'Yes' : 
                     latestApp.finalStatus === 'rejected' ? 'No' : 'Pending'
        };
    };

    if (loading) {
        return (
            <div className="dashboard-content">

                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-content">

            {/* Candidate Details Modal */}
            <div className="modal fade" id="candidateDetailsModal" tabIndex={-1} aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Candidate Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedCandidate ? (
                                <div className="container-fluid">
                                    <div className="row mb-2">
                                        <div className="col-6"><strong>Name:</strong> {selectedCandidate.name}</div>
                                        <div className="col-6"><strong>Email:</strong> {selectedCandidate.email}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6"><strong>Phone:</strong> {selectedCandidate.phone || 'Not provided'}</div>
                                        <div className="col-6"><strong>Profile:</strong> {selectedCandidate.hasProfile ? 'Completed' : 'Incomplete'}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6"><strong>Location:</strong> {selectedCandidate.profile?.location || 'Not specified'}</div>
                                        <div className="col-6"><strong>Registered:</strong> {new Date(selectedCandidate.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-12"><strong>Skills:</strong> {selectedCandidate.profile?.skills?.length ? selectedCandidate.profile.skills.join(', ') : 'No skills listed'}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6"><strong>Shortlisted Status:</strong> {getCandidateShortlistInfo(selectedCandidate._id).status}</div>
                                        <div className="col-6"><strong>Current Round:</strong> {getCandidateShortlistInfo(selectedCandidate._id).round}</div>
                                    </div>
                                    {selectedCandidate.profile?.summary && (
                                        <div className="row mb-2">
                                            <div className="col-12"><strong>Summary:</strong> {selectedCandidate.profile.summary}</div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="site-button" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-widg">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>All Registered Candidates ({candidates.length})</h4>
                            </div>
                            <div className="card-body">
                                {candidates.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p>No registered candidates found.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped" style={{color: 'black'}}>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Profile Status</th>
                                                    <th>Location</th>

                                                    <th>Shortlisted Status</th>
                                                    <th>Current Round</th>
                                                    <th>Selected</th>
                                                    <th>Registered Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {candidates.map((candidate) => {
                                                    const shortlistInfo = getCandidateShortlistInfo(candidate._id);
                                                    return (
                                                        <tr key={candidate._id}>
                                                            <td>
                                                                <div className="dash-list-thumb">
                                                                    <h4 className="mb-0 ft-medium fs-sm">
                                                                        {candidate.name}
                                                                    </h4>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span style={{color: 'black'}}>{candidate.email}</span>
                                                            </td>
                                                            <td>
                                                                <span style={{color: 'black'}}>
                                                                    {candidate.phone || 'Not provided'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${candidate.hasProfile ? 'badge-success' : 'badge-warning'}`} style={{color: 'black'}}>
                                                                    {candidate.hasProfile ? 'Profile Completed' : 'Profile Incomplete'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span style={{color: 'black'}}>
                                                                    {candidate.profile?.location || 'Not specified'}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span className={`badge ${shortlistInfo.status === 'Shortlisted' ? 'badge-success' : 'badge-secondary'}`} style={{color: 'black'}}>
                                                                    {shortlistInfo.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span style={{color: 'black'}}>{shortlistInfo.round}</span>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${
                                                                    shortlistInfo.selected === 'Yes' ? 'badge-success' :
                                                                    shortlistInfo.selected === 'No' ? 'badge-danger' :
                                                                    'badge-warning'
                                                                }`} style={{color: 'black'}}>
                                                                    {shortlistInfo.selected}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span style={{color: 'black'}}>
                                                                    {new Date(candidate.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="dash-action-btns">
                                                                    <button 
                                                                        className="btn btn-outline-primary btn-sm"
                                                                        onClick={() => viewCandidateDetails(candidate)}
                                                                        title="View Details"
                                                                    >
                                                                        <i className="fa fa-eye"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function viewCandidateDetails(candidate) {
        setSelectedCandidate(candidate);
        try {
            // Use Bootstrap's JS API to show the modal
            const modalEl = document.getElementById('candidateDetailsModal');
            if (modalEl) {
                const modal = window.bootstrap ? new window.bootstrap.Modal(modalEl) : null;
                if (modal) modal.show();
                else modalEl.classList.add('show');
            }
        } catch (e) {
            console.error('Failed to open modal', e);
        }
    }
}

export default RegisteredCandidatesPage;