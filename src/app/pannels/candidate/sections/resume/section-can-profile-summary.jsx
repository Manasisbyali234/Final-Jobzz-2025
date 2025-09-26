import { useState, useEffect } from "react";
import { api } from "../../../../../utils/api";

function SectionCanProfileSummary({ profile }) {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSummary(profile?.profileSummary || '');
    }, [profile]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await api.updateCandidateProfile({ profileSummary: summary });
            if (response.success) {
                alert('Profile summary updated successfully!');
                window.dispatchEvent(new CustomEvent('profileUpdated'));
            }
        } catch (error) {
            alert('Failed to update profile summary');
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">
                    <i className="fa fa-user-circle site-text-primary me-2"></i>
                    Profile Summary
                </h4>
                <a data-bs-toggle="modal" href="#Profile_Summary" role="button" title="Edit" className="site-text-primary">
                    <span className="fa fa-edit" />
                </a>
            </div>
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <p>{summary || 'Add your profile summary to highlight your career and education'}</p>
                </div>
            </div>
            {/*Modal Popup */}
            <div className="modal fade twm-saved-jobs-view" id="Profile_Summary" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    <i className="fa fa-user-circle me-2"></i>
                                    Profile Summary
                                </h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <p>Your Profile Summary should mention the highlights of your career and education, what your professional interests are, and what kind of a career you are looking for. Write a meaningful summary of more than 50 characters.</p>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group twm-textarea-full">
                                            <textarea 
                                                className="form-control" 
                                                placeholder="Write your profile summary"
                                                value={summary}
                                                onChange={(e) => setSummary(e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="site-button" data-bs-dismiss="modal">Close</button>
                                <button 
                                    type="button" 
                                    className="site-button"
                                    onClick={handleSave}
                                    disabled={loading}
                                    data-bs-dismiss="modal"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SectionCanProfileSummary;