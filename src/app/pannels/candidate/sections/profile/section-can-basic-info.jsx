import React, { useState, useEffect } from "react";
import { api } from "../../../../../utils/api";

function SectionCandicateBasicInfo() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        location: '',
        profilePicture: null
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentProfilePicture, setCurrentProfilePicture] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.getCandidateProfile();
            console.log('Profile response:', response);
            
            if (response.success && response.profile) {
                const profile = response.profile;
                const candidate = profile.candidateId || {};
                
                setFormData({
                    name: candidate.name || '',
                    phone: candidate.phone || '',
                    email: candidate.email || '',
                    location: profile.location || '',
                    profilePicture: null
                });
                setCurrentProfilePicture(profile.profilePicture);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profilePicture: file
            }));
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('phone', formData.phone);
            submitData.append('email', formData.email);
            submitData.append('location', formData.location);
            if (formData.profilePicture) {
                submitData.append('profilePicture', formData.profilePicture);
            }
            
            console.log('Form data being sent:', formData);
            
            const response = await api.updateCandidateProfile(submitData);
            console.log('API response:', response);
            if (response.success) {
                alert('Profile updated successfully!');
                // Refresh profile data to show updated image
                fetchProfile();
                // Clear image preview
                setImagePreview(null);
                // Trigger header refresh
                window.dispatchEvent(new Event('profileUpdated'));
            } else {
                alert('Failed to update profile: ' + (response.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="panel panel-default">
                <div className="panel-body p-a20 text-center">
                    Loading profile...
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0" style={{color: '#232323'}}>
                        <i className="fa fa-info-circle me-2" style={{color: '#ff6b35'}}></i>
                        Basic Information
                    </h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 m-b30">
                    <div className="row">
                        <div className="col-md-12 mb-professional">
                            <div className="profile-picture-section">
                                <label className="mb-3">
                                    <i className="fa fa-camera me-2" style={{color: '#ff6b35'}}></i>
                                    Profile Picture
                                </label>
                                <div className="mb-3">
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="profile-image-preview"
                                        />
                                    ) : currentProfilePicture ? (
                                        <img 
                                            src={currentProfilePicture} 
                                            alt="Current Profile" 
                                            className="profile-image-preview"
                                        />
                                    ) : (
                                        <div className="profile-placeholder">
                                            <i className="fa fa-user fa-2x"></i>
                                        </div>
                                    )}
                                </div>
                                <input 
                                    className="form-control" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <small className="text-muted mt-2 d-block">Upload JPG, PNG or GIF (Max 5MB)</small>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label>
                                <i className="fa fa-user me-2" style={{color: '#ff6b35'}}></i>
                                Full Name (As per records)
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label>
                                <i className="fa fa-phone me-2" style={{color: '#ff6b35'}}></i>
                                Mobile Number
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter your mobile number"
                            />
                        </div>

                        <div className="col-md-6">
                            <label>
                                <i className="fa fa-envelope me-2" style={{color: '#ff6b35'}}></i>
                                Email ID
                            </label>
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label>
                                <i className="fa fa-map-marker-alt me-2" style={{color: '#ff6b35'}}></i>
                                Location
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Enter your location"
                            />
                        </div>
                    </div>

                    <hr />

                    <div className="text-left mt-professional">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            <i className={`fa ${saving ? 'fa-spinner fa-spin' : 'fa-save'} me-2`}></i>
                            {saving ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default SectionCandicateBasicInfo;