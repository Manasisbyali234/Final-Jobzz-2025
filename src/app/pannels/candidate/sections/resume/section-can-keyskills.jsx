import { useState, useEffect } from "react";
import { api } from "../../../../../utils/api";

function SectionCanKeySkills({ profile }) {
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const profileSkills = profile?.skills || [];
        setSkills(profileSkills);
        setSkillInput(profileSkills.join(', '));
    }, [profile]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const skillsArray = skillInput.split(',').map(s => s.trim()).filter(s => s);
            const response = await api.updateCandidateProfile({ skills: skillsArray });
            if (response.success) {
                setSkills(skillsArray);
                alert('Skills updated successfully!');
                window.dispatchEvent(new CustomEvent('profileUpdated'));
            }
        } catch (error) {
            alert('Failed to update skills');
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">
                    <i className="fa fa-cogs site-text-primary me-2"></i>
                    Key Skills
                </h4>
                <a data-bs-toggle="modal" href="#Key_Skills" role="button" title="Edit" className="site-text-primary">
                    <span className="fa fa-edit" />
                </a>
            </div>
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="tw-sidebar-tags-wrap">
                    <div className="tagcloud">
                        {skills.length > 0 ? (
                            skills.map((skill, index) => (
                                <a key={index} href="javascript:void(0)" className="skill-tag">
                                    <i className="fa fa-tag me-1"></i>
                                    {skill}
                                </a>
                            ))
                        ) : (
                            <p className="text-muted">
                                <i className="fa fa-info-circle me-1"></i>
                                No skills added yet. Click edit to add your skills.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/*Modal popup */}
            <div className="modal fade twm-saved-jobs-view" id="Key_Skills" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    <i className="fa fa-cogs me-2"></i>
                                    Key Skills
                                </h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <p>It is the first thing recruiters notice in your profile. Write concisely what makes you unique and right person for the job you are looking for.</p>
                                <div className="form-group">
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        placeholder="Enter skills separated by commas (e.g. React, JavaScript, Node.js)"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                    />
                                    <small className="text-muted">Separate multiple skills with commas</small>
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
export default SectionCanKeySkills;