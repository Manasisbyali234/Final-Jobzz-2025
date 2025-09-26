import React, { useState, useEffect } from "react";
import { api } from "../../../../../utils/api";

function SectionCanPersonalDetail({ profile }) {
    const [formData, setFormData] = useState({
        dateOfBirth: '',
        gender: '',
        fatherName: '',
        motherName: '',
        residentialAddress: '',
        permanentAddress: '',
        correspondenceAddress: ''
    });
    const [educationList, setEducationList] = useState([]);
    
    const getEducationLevelLabel = (index) => {
        const levels = ['10th School Name', 'PUC/Diploma College Name', 'Degree', 'Masters', 'PhD/Doctorate'];
        return levels[index] || 'Additional Qualification';
    };
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                dateOfBirth: profile.dateOfBirth || '',
                gender: profile.gender || '',
                fatherName: profile.fatherName || '',
                motherName: profile.motherName || '',
                residentialAddress: profile.residentialAddress || '',
                permanentAddress: profile.permanentAddress || '',
                correspondenceAddress: profile.correspondenceAddress || ''
            });
            if (profile.education && profile.education.length > 0) {
                setEducationList(profile.education);
            } else {
                setEducationList([]);
            }
        }
    }, [profile]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const updateData = {
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                fatherName: formData.fatherName,
                motherName: formData.motherName,
                residentialAddress: formData.residentialAddress,
                permanentAddress: formData.permanentAddress,
                correspondenceAddress: formData.correspondenceAddress,
                education: educationList.map(edu => ({
                    degreeName: edu.degreeName,
                    collegeName: edu.collegeName,
                    passYear: edu.passYear,
                    scoreType: edu.scoreType || 'percentage',
                    scoreValue: edu.scoreValue || edu.percentage,
                    marksheet: edu.marksheet
                }))
            };
            console.log('Sending data:', updateData);
            const response = await api.updateCandidateProfile(updateData);
            if (response.success) {
                alert('Profile updated successfully!');
                window.dispatchEvent(new CustomEvent('profileUpdated'));
            }
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };
    
    const handleAddEducation = () => {
        setEducationList([
            ...educationList,
            { degreeName: "", collegeName: "", passYear: "", scoreType: "percentage", scoreValue: "", percentage: "", marksheet: null },
        ]);
    };

    const handleEducationChange = (index, field, value) => {
        const updated = [...educationList];
        updated[index][field] = value;
        setEducationList(updated);
    };



    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">
                    <i className="fa fa-id-card site-text-primary me-2"></i>
                    Personal Details
                </h4>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="panel panel-default">
                    <div className="panel-body wt-panel-body p-a20 m-b30">
                        <div className="row">
                            <div className="col-md-6">
                                <label><i className="fa fa-calendar me-1"></i> Date of Birth</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label><i className="fa fa-venus-mars me-1"></i> Gender</label>
                                <select 
                                    className="form-control"
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label><i className="fa fa-male me-1"></i> Father's / Husband's Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.fatherName}
                                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label><i className="fa fa-female me-1"></i> Mother's Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.motherName}
                                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                                />
                            </div>

                            <div className="col-md-12">
                                <label><i className="fa fa-home me-1"></i> Residential Address</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Enter address"
                                    value={formData.residentialAddress}
                                    onChange={(e) => handleInputChange('residentialAddress', e.target.value)}
                                ></textarea>
                            </div>

                            <div className="col-md-12">
                                <label><i className="fa fa-map-marker me-1"></i> Permanent Address</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Enter permanent address"
                                    value={formData.permanentAddress}
                                    onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                                ></textarea>
                            </div>

                            <div className="col-md-12">
                                <label><i className="fa fa-envelope me-1"></i> Correspondence Address</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Enter correspondence address"
                                    value={formData.correspondenceAddress}
                                    onChange={(e) => handleInputChange('correspondenceAddress', e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <hr />

                        <h5 className="mt-3">
                            <i className="fa fa-graduation-cap site-text-primary me-2"></i>
                            Educational Qualification Details
                        </h5>

                        {educationList.map((edu, index) => (
                            <div className="border rounded p-3 mb-3 position-relative" key={index}>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger position-absolute"
                                    style={{ top: '10px', right: '10px', zIndex: 10 }}
                                    onClick={() => {
                                        const updated = educationList.filter((_, i) => i !== index);
                                        setEducationList(updated);
                                    }}
                                    title="Remove this education entry"
                                >
                                    ×
                                </button>
                                <div className="row">
                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">{getEducationLevelLabel(index)}</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={edu.degreeName}
                                            onChange={(e) =>
                                                handleEducationChange(index, "degreeName", e.target.value)
                                            }
                                            placeholder={`Enter ${getEducationLevelLabel(index)}`}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">{index === 0 ? 'School Name' : (index === 1 ? 'College Name' : 'Institution Name')}</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={edu.collegeName}
                                            onChange={(e) =>
                                                handleEducationChange(index, "collegeName", e.target.value)
                                            }
                                            placeholder={`Enter ${index === 0 ? 'School Name' : (index === 1 ? 'College Name' : 'Institution Name')}`}
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label fw-bold">Passout Year</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={edu.passYear}
                                            onChange={(e) =>
                                                handleEducationChange(index, "passYear", e.target.value)
                                            }
                                            placeholder="Enter Year"
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label fw-bold">Score Type</label>
                                        <select
                                            className="form-control"
                                            value={edu.scoreType || 'percentage'}
                                            onChange={(e) =>
                                                handleEducationChange(index, "scoreType", e.target.value)
                                            }
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="cgpa">CGPA</option>
                                            <option value="sgpa">SGPA</option>
                                            <option value="grade">Grade</option>
                                        </select>
                                    </div>
                                    
                                    <div className="col-md-2">
                                        <label className="form-label fw-bold">Score Value</label>
                                        <div className="input-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={edu.scoreValue || edu.percentage}
                                                onChange={(e) =>
                                                    handleEducationChange(index, "scoreValue", e.target.value)
                                                }
                                                placeholder="Enter score"
                                            />
                                            {(edu.scoreType || 'percentage') === 'percentage' && (
                                                <span className="input-group-text">%</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Upload Marksheet</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const formData = new FormData();
                                                    formData.append('marksheet', file);

                                                    try {
                                                        const response = await fetch('http://localhost:5000/api/candidate/upload-marksheet', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Authorization': `Bearer ${localStorage.getItem('candidateToken')}`
                                                            },
                                                            body: formData
                                                        });
                                                        const data = await response.json();
                                                        if (data.success) {
                                                            handleEducationChange(index, "marksheet", data.filePath);
                                                        }
                                                    } catch (error) {
                                                        console.error('Upload failed:', error);
                                                    }
                                                }
                                            }}
                                        />
                                        {edu.marksheet && <small className="text-success">✓ Uploaded: {edu.marksheet}</small>}
                                    </div>
                                </div>

                            </div>
                        ))}

                        <div className="mt-3">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleAddEducation}
                            >
                                <i className="fa fa-plus me-1"></i>
                                Add New
                            </button>
                        </div>

                        <div className="text-left mt-4">
                            <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
                                <i className="fa fa-save me-1"></i>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
export default SectionCanPersonalDetail;