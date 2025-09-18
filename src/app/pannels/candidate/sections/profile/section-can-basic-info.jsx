import React, { useState, useEffect } from "react";
import { api } from "../../../../../utils/api";

function SectionCandicateBasicInfo() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
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
                    <h4 className="panel-tittle m-a0">Basic Information</h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 m-b30">
                    <div className="row">
                        <div className="col-md-6">
                            <label>Profile Picture</label>
                            <input 
                                className="form-control" 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {/* Image Preview */}
                            <div className="mt-2">
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                ) : currentProfilePicture ? (
                                    <img 
                                        src={currentProfilePicture} 
                                        alt="Current Profile" 
                                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label>Full Name (As per records)</label>
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label>Mobile Number</label>
                            <input
                                className="form-control"
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter mobile number"
                            />
                        </div>

                        <div className="col-md-6">
                            <label>Email ID</label>
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                    </div>

                    <hr />

                    <div className="text-left mt-4">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default SectionCandicateBasicInfo;