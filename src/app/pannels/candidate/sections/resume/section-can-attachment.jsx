import { useState } from "react";
import { api } from "../../../../../utils/api";

function SectionCanAttachment({ profile }) {
    const [uploading, setUploading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('resume', selectedFile);

        try {
            const response = await api.uploadResume(formData);
            if (response.success) {
                alert('Resume uploaded successfully!');
                setResumeFile(selectedFile.name);
                setSelectedFile(null);
            }
        } catch (error) {
            alert('Failed to upload resume');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Attach Resume</h4>
            </div>
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <p>Resume is the most important document recruiters look for. Recruiters generally do not look at profiles without resumes.</p>
                    <div className="dashboard-cover-pic">
                        <input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            onChange={handleFileSelect}
                            disabled={uploading}
                            className="form-control mb-3"
                        />
                        {selectedFile && <p>Selected: {selectedFile.name}</p>}
                        <button 
                            type="button" 
                            className="btn btn-primary mb-3"
                            onClick={handleSubmit}
                            disabled={uploading || !selectedFile}
                        >
                            {uploading ? 'Uploading...' : 'Submit Resume'}
                        </button>
                        {profile?.resume && <p>Current resume: {profile.resume}</p>}
                        {resumeFile && <p>Uploaded: {resumeFile}</p>}
                        <p>Upload Resume File size max 3 MB</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SectionCanAttachment;