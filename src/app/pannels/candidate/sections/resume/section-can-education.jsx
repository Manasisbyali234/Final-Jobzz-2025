import { useState, useEffect } from 'react';
import { api } from '../../../../../utils/api';

function SectionCanEducation({ profile, onUpdate }) {
    const [educationList, setEducationList] = useState([]);
    const [formData, setFormData] = useState({
        degreeName: '',
        collegeName: '',
        passYear: '',
        scoreType: 'percentage',
        scoreValue: '',
        marksheet: null
    });
    const [editingIndex, setEditingIndex] = useState(-1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile?.education) {
            setEducationList(profile.education);
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({ ...prev, marksheet: e.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            degreeName: '',
            collegeName: '',
            passYear: '',
            scoreType: 'percentage',
            scoreValue: '',
            marksheet: null
        });
        setEditingIndex(-1);
    };

    const handleEdit = (index) => {
        const education = educationList[index];
        setFormData({
            degreeName: education.degreeName || '',
            collegeName: education.collegeName || '',
            passYear: education.passYear || '',
            scoreType: education.scoreType || 'percentage',
            scoreValue: education.scoreValue || education.percentage || '',
            marksheet: education.marksheet || null
        });
        setEditingIndex(index);
    };

    const handleDelete = async (index) => {
        if (window.confirm('Are you sure you want to delete this education record?')) {
            try {
                setLoading(true);
                const updatedList = educationList.filter((_, i) => i !== index);
                await api.updateCandidateProfile({ education: updatedList });
                setEducationList(updatedList);
                if (onUpdate) onUpdate();
            } catch (error) {
                console.error('Error deleting education:', error);
                alert('Failed to delete education record');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        if (!formData.degreeName || !formData.collegeName || !formData.passYear || !formData.scoreValue) {
            alert('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            let updatedList;
            
            if (editingIndex >= 0) {
                updatedList = [...educationList];
                updatedList[editingIndex] = { ...formData };
            } else {
                updatedList = [...educationList, { ...formData }];
            }

            await api.updateCandidateProfile({ education: updatedList });
            setEducationList(updatedList);
            resetForm();
            if (onUpdate) onUpdate();
            
            // Close modal
            const modal = document.getElementById('AddEducation');
            const bootstrapModal = window.bootstrap?.Modal?.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        } catch (error) {
            console.error('Error saving education:', error);
            alert('Failed to save education record');
        } finally {
            setLoading(false);
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
                    {educationList.length > 0 ? educationList.map((education, index) => (
                        <div key={index} className="education-item mb-3">
                            <p><b>{education.degreeName}</b></p>
                            <p>{education.collegeName}</p>
                            <p>{education.passYear} | {education.scoreType?.toUpperCase()}: {education.scoreValue || education.percentage}</p>
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleEdit(index)}
                                >
                                    <i className="fa fa-edit" /> Edit
                                </button>
                                <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(index)}
                                >
                                    <i className="fa fa-trash" /> Delete
                                </button>
                            </div>
                            <hr />
                        </div>
                    )) : (
                        <p className="text-muted">No education details added yet.</p>
                    )}
                </div>
            </div>
            {/* Add Education Modal */}
            <div className="modal fade twm-saved-jobs-view" id="AddEducation" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    {editingIndex >= 0 ? 'Edit Educational Qualification' : 'Add Educational Qualification'}
                                </h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm} />
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Degree</label>
                                            <div className="ls-inputicon-box">
                                                <input 
                                                    className="form-control" 
                                                    name="degreeName" 
                                                    type="text" 
                                                    placeholder="Enter Degree" 
                                                    value={formData.degreeName}
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
                                                    name="collegeName" 
                                                    type="text" 
                                                    placeholder="Enter Institution Name" 
                                                    value={formData.collegeName}
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
                                                    name="passYear" 
                                                    type="text" 
                                                    placeholder="Enter Passout Year" 
                                                    value={formData.passYear}
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
                                                <input 
                                                    className="form-control" 
                                                    name="marksheet" 
                                                    type="file" 
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={handleFileChange}
                                                />
                                                <i className="fs-input-icon fa fa-upload" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="site-button" data-bs-dismiss="modal" onClick={resetForm}>Close</button>
                                <button type="button" className="site-button" onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : (editingIndex >= 0 ? 'Update' : 'Save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SectionCanEducation;