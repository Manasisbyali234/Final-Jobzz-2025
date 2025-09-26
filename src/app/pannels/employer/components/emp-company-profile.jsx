import { Briefcase, Building, Calendar, FileText, Globe, Hash, IdCard, Image as ImageIcon, Mail, MapPin, Phone, Upload, User as UserIcon, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { loadScript } from "../../../../globals/constants";
import './emp-company-profile.css';

function EmpCompanyProfilePage() {
    const [formData, setFormData] = useState({
        // Basic Information
        employerCategory: '',
        companyName: '',
        phone: '',
        email: '',
        website: '',
        establishedSince: '',
        teamSize: '',

        description: '',
        
        // Company Details
        legalEntityCode: '',
        corporateAddress: '',
        branchLocations: '',
        officialEmail: '',
        officialMobile: '',
        companyType: '',
        cin: '',
        gstNumber: '',
        industrySector: '',
        panNumber: '',
        agreeTerms: '',
        
        // Primary Contact
        contactFullName: '',
        contactDesignation: '',
        contactOfficialEmail: '',
        contactMobile: '',
        companyIdCardPicture: '',
        alternateContact: '',
        
        // Images
        logo: '',
        coverImage: '',
        
        // Authorization Letters
        authorizationLetters: []
    });

    const [loading, setLoading] = useState(false);
    const [authSections, setAuthSections] = useState([{ id: 1 }]);

    useEffect(() => {
        loadScript("js/custom.js");
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('employerToken');
            const response = await fetch('http://localhost:5000/api/employer/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success && data.profile) {
                setFormData(prev => ({ ...prev, ...data.profile }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Validate image file by size, type, and minimum dimensions
    const validateImageFile = (file, { maxSizeMB, minWidth, minHeight, allowedTypes }) => {
        return new Promise((resolve) => {
            // Size check
            const maxBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxBytes) {
                resolve({ ok: false, message: `File is too large. Max size is ${maxSizeMB}MB.` });
                return;
            }

            // Type check
            if (allowedTypes && !allowedTypes.includes(file.type)) {
                resolve({ ok: false, message: `Invalid file type. Allowed: ${allowedTypes.join(", ")}.` });
                return;
            }

            // Dimension check (images only)
            try {
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);
                img.onload = () => {
                    const { width, height } = img;
                    URL.revokeObjectURL(objectUrl);
                    if (width < minWidth || height < minHeight) {
                        resolve({ ok: false, message: `Image too small. Minimum ${minWidth}x${minHeight}px required.` });
                    } else {
                        resolve({ ok: true });
                    }
                };
                img.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    resolve({ ok: false, message: 'Unable to read image. Please try a different file.' });
                };
                img.src = objectUrl;
            } catch (err) {
                resolve({ ok: false, message: 'Validation failed. Please try again.' });
            }
        });
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate logo: <=1MB, jpg/png, min 136x136
        const result = await validateImageFile(file, {
            maxSizeMB: 1,
            minWidth: 136,
            minHeight: 136,
            allowedTypes: ['image/jpeg', 'image/png']
        });
        if (!result.ok) {
            alert(`Logo: ${result.message}`);
            return;
        }

        const body = new FormData();
        body.append('logo', file);
        try {
            const token = localStorage.getItem('employerToken');
            const response = await fetch('http://localhost:5000/api/employer/profile/logo', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body
            });
            const data = await response.json();
            if (data.success) {
                handleInputChange('logo', data.logo);
            } else {
                alert(data.message || 'Logo upload failed');
            }
        } catch (error) {
            console.error('Logo upload failed:', error);
            alert('Logo upload failed. Please try again.');
        }
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate cover: <=2MB, jpg/png, no minimum size restriction
        const result = await validateImageFile(file, {
            maxSizeMB: 2,
            minWidth: 1,
            minHeight: 1,
            allowedTypes: ['image/jpeg', 'image/png']
        });
        if (!result.ok) {
            alert(`Cover Image: ${result.message}`);
            return;
        }

        const body = new FormData();
        body.append('cover', file);
        try {
            const token = localStorage.getItem('employerToken');
            const response = await fetch('http://localhost:5000/api/employer/profile/cover', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body
            });
            const data = await response.json();
            if (data.success) {
                handleInputChange('coverImage', data.coverImage);
            } else {
                alert(data.message || 'Cover image upload failed');
            }
        } catch (error) {
            console.error('Cover upload failed:', error);
            alert('Cover image upload failed. Please try again.');
        }
    };

    const handleDocumentUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate documents: <=5MB, allow images (jpg/png/jpeg) and PDF
        const maxBytes = 5 * 1024 * 1024;
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (file.size > maxBytes) {
            alert('Document is too large. Max size is 5MB.');
            return;
        }
        if (!allowed.includes(file.type)) {
            alert('Invalid document type. Allowed: JPEG, PNG, PDF.');
            return;
        }

        const body = new FormData();
        body.append('document', file);
        body.append('fieldName', fieldName);
        try {
            const token = localStorage.getItem('employerToken');
            const response = await fetch('http://localhost:5000/api/employer/profile/document', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: body
            });
            const data = await response.json();
            if (data.success) {
                handleInputChange(fieldName, data.filePath);
            } else {
                alert(data.message || 'Document upload failed');
            }
        } catch (error) {
            console.error('Document upload failed:', error);
            alert('Document upload failed. Please try again.');
        }
    };

    const handleAuthorizationLetterUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate documents: <=5MB, allow images (jpg/png/jpeg) and PDF
        const maxBytes = 5 * 1024 * 1024;
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (file.size > maxBytes) {
            alert('Document is too large. Max size is 5MB.');
            return;
        }
        if (!allowed.includes(file.type)) {
            alert('Invalid document type. Allowed: JPEG, PNG, PDF.');
            return;
        }

        const body = new FormData();
        body.append('document', file);
        try {
            const token = localStorage.getItem('employerToken');
            const response = await fetch('http://localhost:5000/api/employer/profile/authorization-letter', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: body
            });
            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    authorizationLetters: data.profile.authorizationLetters || []
                }));
                alert('Authorization letter uploaded successfully!');
                // Clear the file input
                e.target.value = '';
            } else {
                alert(data.message || 'Document upload failed');
            }
        } catch (error) {
            console.error('Document upload failed:', error);
            alert('Document upload failed. Please try again.');
        }
    };

    const handleDeleteAuthorizationLetter = async (documentId) => {
        if (!window.confirm('Are you sure you want to delete this authorization letter?')) {
            return;
        }

        try {
            const token = localStorage.getItem('employerToken');
            const response = await fetch(`http://localhost:5000/api/employer/profile/authorization-letter/${documentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    authorizationLetters: data.profile.authorizationLetters || []
                }));
                alert('Authorization letter deleted successfully!');
            } else {
                alert(data.message || 'Failed to delete document');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete document. Please try again.');
        }
    };

    const addNewAuthSection = () => {
        const newId = Math.max(...authSections.map(s => s.id)) + 1;
        setAuthSections(prev => [...prev, { id: newId }]);
    };

    const removeAuthSection = (id) => {
        if (authSections.length > 1) {
            setAuthSections(prev => prev.filter(section => section.id !== id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('employerToken');
            const response = await fetch('http://localhost:5000/api/employer/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="emp-company-profile orange-icons">
            <div className="wt-admin-right-page-header clearfix">
                <h2>Company Details</h2>
                <div className="progress-indicator">
                    <div className="progress-bar" style={{width: '75%'}}></div>
                </div>
            </div>

            {/*Logo and Cover image*/}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0"><ImageIcon size={18} className="me-2" /> Logo and Cover image</h4>
                </div>
                
                <div className="panel-body wt-panel-body p-a20 p-b0 m-b30">
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                                <label><ImageIcon size={16} className="me-2" /> Company Logo</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleLogoUpload}
                                />
                                {formData.logo && (
                                    <div className="mt-2">
                                        <img 
                                            src={formData.logo} 
                                            alt="Logo" 
                                            style={{maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', border: '1px solid #ddd'}} 
                                            onError={(e) => {
                                                console.log('Logo load error'); 
                                                e.target.src = '/images/default-logo.png';
                                            }}
                                        />
                                        <p className="text-muted text-success">✓ Logo uploaded successfully</p>
                                    </div>
                                )}
                                <p className="text-muted mt-2">
                                    <b>Company Logo:</b> Max file size is 1MB, Minimum dimension: 136 x 136 And Suitable files are .jpg & .png
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                                <label><ImageIcon size={16} className="me-2" /> Background Banner Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleCoverUpload}
                                />
                                {formData.coverImage && (
                                    <div className="mt-2">
                                        <img 
                                            src={formData.coverImage} 
                                            alt="Cover" 
                                            style={{width: '100%', maxWidth: '400px', height: 'auto', maxHeight: '200px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px'}} 
                                            onError={(e) => {
                                                console.log('Cover load error'); 
                                                e.target.src = '/images/default-cover.png';
                                            }}
                                        />
                                        <p className="text-muted text-success">✓ Cover image uploaded successfully</p>
                                    </div>
                                )}
                                <p className="text-muted mt-2">
                                    <b>Background Banner Image:</b> Max file size is 2MB. Any image size is supported. Suitable files are .jpg & .png
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/*Basic Information*/}
                <div className="panel panel-default">
                    <div className="panel-heading wt-panel-heading p-a20">
                        <h4 className="panel-tittle m-a0"><Briefcase size={18} className="me-2" /> Basic Informations</h4>
                    </div>

                    <div className="panel-body wt-panel-body p-a20 m-b30">
                        <div className="row">
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Employer Category</label>
                                    <div className="form-control" style={{backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', color: '#495057'}}>
                                        {formData.employerCategory ? 
                                            (formData.employerCategory === 'company' ? 'Company' : 'Consultancy') 
                                            : 'Not specified'
                                        }
                                    </div>
                                    <small className="text-muted">This field cannot be edited after registration</small>
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label><Building size={16} className="me-2" /> Company Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                                        placeholder="Enter company name"
                                    />
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label><Phone size={16} className="me-2" /> Phone</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="(+91) 9087654321"
                                    />
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label><Mail size={16} className="me-2" /> Email Address</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="company@example.com"
                                    />
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label><Globe size={16} className="me-2" /> Website</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label><Calendar size={16} className="me-2" /> Est. Since</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.establishedSince}
                                        onChange={(e) => handleInputChange('establishedSince', e.target.value)}
                                        placeholder="Since..."
                                    />
                                </div>
                            </div>

                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label><UsersIcon size={16} className="me-2" /> Team Size</label>
                                    <select
                                        className="form-control"
                                        value={formData.teamSize}
                                        onChange={(e) => handleInputChange('teamSize', e.target.value)}
                                    >
                                        <option value="">Select team size</option>
                                        <option value="1-5">1-5</option>
                                        <option value="5-10">5-10</option>
                                        <option value="10-20">10-20</option>
                                        <option value="20-50">20-50</option>
                                        <option value="50-100">50-100</option>
                                        <option value="100-200">100-200</option>
                                        <option value="200-500">200-500</option>
                                        <option value="500-1000">500-1000</option>
                                        <option value="1000+">1000+</option>
                                    </select>
                                </div>
                            </div>



                            <div className="col-md-12">
                                <div className="form-group">
                                    <label><FileText size={16} className="me-2" /> Description</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Company description..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Details */}
                <div className="panel panel-default">
                    <div className="panel-heading wt-panel-heading p-a20">
                        <h4 className="panel-tittle m-a0"><IdCard size={18} className="me-2" /> Company Details</h4>
                    </div>

                    <div className="panel-body wt-panel-body p-a20 m-b30">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Hash size={16} className="me-2" /> Legal Entity Code (if any)</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.legalEntityCode}
                                        onChange={(e) => handleInputChange('legalEntityCode', e.target.value)}
                                        placeholder="Enter legal entity code"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><MapPin size={16} className="me-2" /> Corporate Office Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.corporateAddress}
                                        onChange={(e) => handleInputChange('corporateAddress', e.target.value)}
                                        placeholder="Enter corporate address"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><MapPin size={16} className="me-2" /> Branch Office Locations (if any)</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.branchLocations}
                                        onChange={(e) => handleInputChange('branchLocations', e.target.value)}
                                        placeholder="Enter branch locations"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Mail size={16} className="me-2" /> Official Email ID</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        value={formData.officialEmail}
                                        onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                                        placeholder="email@company.com"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Phone size={16} className="me-2" /> Official Mobile Number</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.officialMobile}
                                        onChange={(e) => handleInputChange('officialMobile', e.target.value)}
                                        placeholder="Enter mobile number"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Briefcase size={16} className="me-2" /> Type of Company / Business</label>
                                    <select 
                                        className="form-control"
                                        value={formData.companyType}
                                        onChange={(e) => handleInputChange('companyType', e.target.value)}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Private Limited">Private Limited</option>
                                        <option value="LLP">LLP</option>
                                        <option value="Proprietorship">Proprietorship</option>
                                        <option value="Government">Government</option>
                                        <option value="NGO">NGO</option>
                                        <option value="Startup">Startup</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Hash size={16} className="me-2" /> Corporate Identification Number (CIN)</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.cin}
                                        onChange={(e) => handleInputChange('cin', e.target.value)}
                                        placeholder="Enter CIN"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Hash size={16} className="me-2" /> GST Number</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.gstNumber}
                                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                                        placeholder="Enter GST number"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Briefcase size={16} className="me-2" /> Industry Sector</label>
                                    <select 
                                        className="form-control"
                                        value={formData.industrySector}
                                        onChange={(e) => handleInputChange('industrySector', e.target.value)}
                                    >
                                        <option value="">Select Industry</option>
                                        <option value="it">IT</option>
                                        <option value="non-it">Non-IT</option>
                                        <option value="education">Education</option>
                                        <option value="finance">Finance</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Hash size={16} className="me-2" /> Company PAN Card Number</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.panNumber}
                                        onChange={(e) => handleInputChange('panNumber', e.target.value)}
                                        placeholder="Enter PAN number"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Upload size={16} className="me-2" /> Upload PAN Card Image</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => handleDocumentUpload(e, 'panCardImage')}
                                    />
                                    {formData.panCardImage && (
                                        <p className="text-success mt-1">✓ PAN Card uploaded</p>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Upload size={16} className="me-2" /> Upload CIN Document</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => handleDocumentUpload(e, 'cinImage')}
                                    />
                                    {formData.cinImage && (
                                        <p className="text-success mt-1">✓ CIN Document uploaded</p>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Upload size={16} className="me-2" /> Upload GST Certificate</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => handleDocumentUpload(e, 'gstImage')}
                                    />
                                    {formData.gstImage && (
                                        <p className="text-success mt-1">✓ GST Certificate uploaded</p>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><Upload size={16} className="me-2" /> Certificate of Incorporation (Issued by RoC)</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => handleDocumentUpload(e, 'certificateOfIncorporation')}
                                    />
                                    {formData.certificateOfIncorporation && (
                                        <p className="text-success mt-1">✓ Certificate of Incorporation uploaded</p>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="form-group">
                                    <label className="mb-3"><FileText size={16} className="me-2" /> Authorization Letters (if registering on behalf of someone else)</label>
                                    
                                    <div className="row">
                                    {/* Dynamic Authorization Letter Sections */}
                                    {authSections.map((section, index) => (
                                        <div key={section.id} className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <label><Upload size={16} className="me-2" /> Authorization Letter #{index + 1}</label>
                                                    {authSections.length > 1 && (
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => removeAuthSection(section.id)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    )}
                                                </div>
                                                <input
                                                    className="form-control"
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                    onChange={handleAuthorizationLetterUpload}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    
                                    </div>
                                    
                                    <div className="mt-2">
                                        <button 
                                            type="button" 
                                            className="btn btn-success btn-sm"
                                            onClick={addNewAuthSection}
                                        >
                                            <i className="fas fa-plus me-1"></i> Add New Authorization Letter
                                        </button>
                                    </div>
                                    
                                    {/* Display uploaded authorization letters */}
                                    {formData.authorizationLetters && formData.authorizationLetters.length > 0 && (
                                        <div className="uploaded-documents mt-4">
                                            <h6 className="text-success">
                                                <i className="fas fa-check-circle me-2"></i>
                                                Uploaded Authorization Letters
                                            </h6>
                                            <div className="row">
                                                {formData.authorizationLetters.map((doc, index) => (
                                                    <div key={doc._id || index} className="col-md-6 mb-2">
                                                        <div className="document-card p-3 border rounded shadow-sm" style={{backgroundColor: '#fff'}}>
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <div className="flex-grow-1">
                                                                    <div className="d-flex align-items-center mb-1">
                                                                        <i className="fas fa-file-alt text-primary me-2"></i>
                                                                        <span className="fw-bold">{doc.fileName}</span>
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        <i className="fas fa-calendar me-1"></i>
                                                                        {new Date(doc.uploadedAt).toLocaleDateString()}
                                                                    </small>
                                                                </div>
                                                                <button 
                                                                    type="button" 
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleDeleteAuthorizationLetter(doc._id)}
                                                                    title="Delete document"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Agree to Terms & Conditions</label>
                                    <div>
                                        <label className="m-r10">
                                            <input 
                                                type="radio" 
                                                name="terms" 
                                                value="yes"
                                                checked={formData.agreeTerms === 'yes'}
                                                onChange={(e) => handleInputChange('agreeTerms', e.target.value)}
                                            /> Yes
                                        </label>
                                        <label>
                                            <input 
                                                type="radio" 
                                                name="terms" 
                                                value="no"
                                                checked={formData.agreeTerms === 'no'}
                                                onChange={(e) => handleInputChange('agreeTerms', e.target.value)}
                                            /> No
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Contact Person */}
                <div className="panel panel-default">
                    <div className="panel-heading wt-panel-heading p-a20">
                        <h4 className="panel-tittle m-a0"><UserIcon size={18} className="me-2" /> Primary Contact Person</h4>
                    </div>
                    <div className="panel-body wt-panel-body p-a20 m-b30">
                        <div className="row">
                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label><UserIcon size={16} className="me-2" /> Full Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.contactFullName}
                                        onChange={(e) => handleInputChange('contactFullName', e.target.value)}
                                        placeholder="Enter Full Name"
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label><Briefcase size={16} className="me-2" /> Designation</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={formData.contactDesignation}
                                        onChange={(e) => handleInputChange('contactDesignation', e.target.value)}
                                        placeholder="e.g., HR Manager, Recruitment Lead, Founder"
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Official Email ID</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        value={formData.contactOfficialEmail}
                                        onChange={(e) => handleInputChange('contactOfficialEmail', e.target.value)}
                                        placeholder="Enter official email"
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input
                                        className="form-control"
                                        type="tel"
                                        value={formData.contactMobile}
                                        onChange={(e) => handleInputChange('contactMobile', e.target.value)}
                                        placeholder="Enter mobile number"
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Company ID Card Picture</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleDocumentUpload(e, 'companyIdCardPicture')}
                                    />
                                    {formData.companyIdCardPicture && (
                                        <div className="mt-2">
                                            <img 
                                                src={formData.companyIdCardPicture.startsWith('data:') ? formData.companyIdCardPicture : `data:image/jpeg;base64,${formData.companyIdCardPicture}`} 
                                                alt="Company ID Card" 
                                                style={{maxWidth: '200px', maxHeight: '120px', objectFit: 'contain', border: '1px solid #ddd'}} 
                                            />
                                            <p className="text-success mt-1">✓ Company ID Card uploaded</p>
                                        </div>
                                    )}
                                    <p className="text-muted mt-1">Upload any company identification document (Max 5MB)</p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Alternate Contact (Optional)</label>
                                    <input
                                        className="form-control"
                                        type="tel"
                                        value={formData.alternateContact}
                                        onChange={(e) => handleInputChange('alternateContact', e.target.value)}
                                        placeholder="Enter alternate contact"
                                    />
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                                <div className="text-left">
                                    <button type="submit" className="site-button" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EmpCompanyProfilePage;