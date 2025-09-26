import { useState, useEffect } from "react";
import { api } from "../../../../../utils/api";

function SectionCanResumeHeadline({ profile }) {
    const [headline, setHeadline] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHeadline(profile?.resumeHeadline || '');
    }, [profile]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await api.updateCandidateProfile({ resumeHeadline: headline });
            if (response.success) {
                alert('Resume headline updated successfully!');
                window.dispatchEvent(new CustomEvent('profileUpdated'));
            }
        } catch (error) {
            alert('Failed to update resume headline');
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">
                    <i className="fa fa-newspaper-o site-text-primary me-2"></i>
                    Resume Headline
                </h4>
                <a data-bs-toggle="modal" href="#Resume_Headline" role="button" title="Edit" className="site-text-primary">
                    <span className="fa fa-edit" />
                </a>
            </div>
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <p>{headline || 'Add your resume headline'}</p>
                </div>
            </div>
            {/*Modal Popup */}
            <div className="modal fade twm-saved-jobs-view" id="Resume_Headline" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    <i className="fa fa-newspaper-o me-2"></i>
                                    Resume Headline
                                </h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <p>It is the first thing recruiters notice in your profile. Write concisely what makes you unique and right person for the job you are looking for.</p>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group twm-textarea-full">
                                            <textarea 
                                                className="form-control" 
                                                placeholder="Type Description" 
                                                value={headline}
                                                onChange={(e) => setHeadline(e.target.value)}
                                                rows={3}
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
export default SectionCanResumeHeadline;
