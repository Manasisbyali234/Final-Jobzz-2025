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
    const [educationList, setEducationList] = useState([
        { degreeName: "", collegeName: "", passYear: "", percentage: "", marksheet: null },
    ]);
    
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
            if (profile.education) {
                setEducationList(profile.education);
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
                education: educationList
            };
            console.log('Sending data:', updateData);
            const response = await api.updateCandidateProfile(updateData);
            if (response.success) {
                alert('Profile updated successfully!');
                window.location.reload();
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
            { degreeName: "", collegeName: "", passYear: "", percentage: "", marksheet: null },
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
                <h4 className="panel-tittle m-a0">Personal Details</h4>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="panel panel-default">
                    <div className="panel-body wt-panel-body p-a20 m-b30">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Date of Birth</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label>Gender</label>
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
                                <label>Father's / Husband's Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.fatherName}
                                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label>Mother's Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.motherName}
                                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                                />
                            </div>

                            <div className="col-md-12">
                                <label>Residential Address</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Enter address"
                                    value={formData.residentialAddress}
                                    onChange={(e) => handleInputChange('residentialAddress', e.target.value)}
                                ></textarea>
                            </div>

                            <div className="col-md-12">
                                <label>Permanent Address</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Enter permanent address"
                                    value={formData.permanentAddress}
                                    onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                                ></textarea>
                            </div>

                            <div className="col-md-12">
                                <label>Correspondence Address</label>
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

                        <h5 className="mt-3">Educational Qualification Details</h5>

                        {educationList.map((edu, index) => (
                            <div className="row mt-3" key={index}>
                                <div className="col-md-2">
                                    <label>{getEducationLevelLabel(index)}</label>
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
                                    <label>{index === 0 ? 'School Name' : (index === 1 ? 'College Name' : 'Institution Name')}</label>
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
                                    <label>Passout Year</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={edu.passYear}
                                        onChange={(e) =>
                                            handleEducationChange(index, "passYear", e.target.value)
                                        }
                                        placeholder="Enter Passout Year"
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label>Percentage / CGPA / SGPA</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={edu.percentage}
                                        onChange={(e) =>
                                            handleEducationChange(index, "percentage", e.target.value)
                                        }
                                        placeholder="Enter score"
                                    />
                                </div>
                                
                                <div className="col-md-3">
                                    <label>Upload Marksheet</label>
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
                                    {edu.marksheet && <small>Uploaded: {edu.marksheet}</small>}
                                </div>
                            </div>
                        ))}

                        <div className="mt-3">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleAddEducation}
                            >
                                + Add New
                            </button>
                        </div>

                        <div className="text-left mt-4">
                            <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
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