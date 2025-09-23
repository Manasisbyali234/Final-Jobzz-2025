import { useState } from 'react';

function SectionCanEducation() {
    const [educationList, setEducationList] = useState([
        { id: 1, degree: 'BCA - Bachelor of Computer Applications', institution: 'Sample University', year: '2004-2006', scoreType: 'percentage', scoreValue: '75' },
        { id: 2, degree: 'MCA - Master of Computer Application', institution: 'Sample University', year: '2006-2008', scoreType: 'cgpa', scoreValue: '8.5' },
        { id: 3, degree: 'Design Communication Visual', institution: 'Sample Institute', year: '2008-2011', scoreType: 'percentage', scoreValue: '85' }
    ]);

    const [formData, setFormData] = useState({
        degree: '',
        institution: '',
        passoutYear: '',
        scoreType: 'percentage',
        scoreValue: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.degree || !formData.institution || !formData.passoutYear || !formData.scoreValue) {
            alert('Please fill all required fields');
            return;
        }
        
        const newEducation = {
            id: Date.now(),
            ...formData
        };
        
        setEducationList([...educationList, newEducation]);
        setFormData({
            degree: '',
            institution: '',
            passoutYear: '',
            scoreType: 'percentage',
            scoreValue: ''
        });
        
        // Close modal
        const modal = document.getElementById('AddEducation');
        const bootstrapModal = window.bootstrap?.Modal?.getInstance(modal);
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    };

    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Educational Qualification Details</h4>
                <a data-bs-toggle="modal" href="#AddEducation" role="button" title="Add New" className="site-text-primary">
                    <span className="fa fa-plus" /> Add New
                </a>
            </div>
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    {educationList.map((education) => (
                        <div key={education.id} className="education-item mb-3">
                            <p><b>{education.degree}</b></p>
                            <p>{education.institution}</p>
                            <p>{education.year || education.passoutYear} | {education.scoreType?.toUpperCase()}: {education.scoreValue}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
            {/* Add Education Modal */}
            <div className="modal fade twm-saved-jobs-view" id="AddEducation" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">Add Educational Qualification</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Degree</label>
                                            <div className="ls-inputicon-box">
                                                <input 
                                                    className="form-control" 
                                                    name="degree" 
                                                    type="text" 
                                                    placeholder="Enter Degree" 
                                                    value={formData.degree}
                                                    onChange={handleInputChange}
                                                />
                                                <i className="fs-input-icon fa fa-graduation-cap" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Institution Name</label>
                                            <div className="ls-inputicon-box">
                                                <input 
                                                    className="form-control" 
                                                    name="institution" 
                                                    type="text" 
                                                    placeholder="Enter Institution Name" 
                                                    value={formData.institution}
                                                    onChange={handleInputChange}
                                                />
                                                <i className="fs-input-icon fa fa-university" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Passout Year</label>
                                            <div className="ls-inputicon-box">
                                                <input 
                                                    className="form-control" 
                                                    name="passoutYear" 
                                                    type="text" 
                                                    placeholder="Enter Passout Year" 
                                                    value={formData.passoutYear}
                                                    onChange={handleInputChange}
                                                />
                                                <i className="fs-input-icon fa fa-calendar" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6">
                                        <div className="form-group">
                                            <label>Score Type</label>
                                            <div className="ls-inputicon-box">
                                                <select 
                                                    className="form-control" 
                                                    name="scoreType"
                                                    value={formData.scoreType}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="percentage">Percentage</option>
                                                    <option value="cgpa">CGPA</option>
                                                    <option value="sgpa">SGPA</option>
                                                    <option value="grade">Grade</option>
                                                </select>
                                                <i className="fs-input-icon fa fa-list" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6">
                                        <div className="form-group">
                                            <label>Score Value</label>
                                            <div className="ls-inputicon-box">
                                                <input 
                                                    className="form-control" 
                                                    name="scoreValue" 
                                                    type="text" 
                                                    placeholder="Enter score value"
                                                    value={formData.scoreValue}
                                                    onChange={handleInputChange}
                                                />
                                                <i className="fs-input-icon fa fa-percent" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Upload Marksheet</label>
                                            <div className="ls-inputicon-box">
                                                <input className="form-control" name="marksheet" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                                                <i className="fs-input-icon fa fa-upload" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="site-button" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="site-button" onClick={handleSave}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SectionCanEducation;