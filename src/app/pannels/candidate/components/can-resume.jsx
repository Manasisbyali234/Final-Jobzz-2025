import { useEffect, useState } from "react";
import SectionCanAccomplishments from "../sections/resume/section-can-accomplishments";
import SectionCanAttachment from "../sections/resume/section-can-attachment";
import SectionCanDesiredProfile from "../sections/resume/section-can-desired-profile";
import SectionCanEducation from "../sections/resume/section-can-education";
import SectionCanEmployment from "../sections/resume/section-can-employment";
import SectionCanITSkills from "../sections/resume/section-can-itskills";
import SectionCanKeySkills from "../sections/resume/section-can-keyskills";
import SectionCanPersonalDetail from "../sections/resume/section-can-personal";
import SectionCanProfileSummary from "../sections/resume/section-can-profile-summary";
import SectionCanProjects from "../sections/resume/section-can-projects";
import SectionCanResumeHeadline from "../sections/resume/section-can-resume-headline";
import { loadScript } from "../../../../globals/constants";
import { api } from "../../../../utils/api";
import "./resume-styles.css";

function CanMyResumePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        fetchProfile();
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await api.getCandidateProfile();
            console.log('Resume profile response:', response);
            if (response.success) {
                setProfile(response.profile);
                // Trigger dashboard refresh by dispatching custom event
                window.dispatchEvent(new CustomEvent('profileUpdated'));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = () => {
        fetchProfile();
    };

    return (
			<>
				<div className="twm-right-section-panel site-bg-gray">
					{/* Resume Page Header */}
					<div className="panel panel-default mb-4">
						<div className="panel-heading wt-panel-heading p-a20">
							<h3 className="panel-tittle m-a0 text-center">
								<i className="fa fa-file-text-o me-2" style={{color: '#ff6b35'}}></i>
								My Resume
							</h3>
							<p className="text-center text-muted mb-0">
								<i className="fa fa-wrench me-1" style={{color: '#ff6b35'}}></i>
								Build and manage your professional resume
							</p>
						</div>
					</div>

					{loading ? (
						<div className="text-center p-4">
							<i className="fa fa-spinner fa-spin fa-2x site-text-primary mb-3"></i>
							<p>Loading profile...</p>
						</div>
					) : (
						<>
							<div className="panel panel-default mb-3">
								<SectionCanResumeHeadline profile={profile} />
							</div>

							<div className="panel panel-default mb-3">
								<SectionCanProfileSummary profile={profile} />
							</div>

							<div className="panel panel-default mb-3">
								<SectionCanKeySkills profile={profile} />
							</div>
							<div className="panel panel-default mb-3">
								<SectionCanPersonalDetail profile={profile} />
							</div>

							<div className="panel panel-default mb-3">
								<SectionCanAttachment profile={profile} />
							</div>
						</>
					)}
				</div>
			</>
		);
}

export default CanMyResumePage;