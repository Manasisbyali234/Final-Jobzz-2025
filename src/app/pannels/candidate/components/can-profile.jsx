import SectionCandicateBasicInfo from "../sections/profile/section-can-basic-info";
import "./profile-styles.css";

function CanProfilePage() {
    return (
        <>
            <div className="twm-right-section-panel site-bg-gray">
                {/* Page Header */}
                <div className="panel panel-default mb-4 profile-header" data-aos="fade-up">
                    <div className="panel-heading wt-panel-heading d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            <i className="fa fa-user-circle me-3" style={{color: '#ff6b35', fontSize: '24px'}} />
                            <div>
                                <h4 className="panel-tittle m-0" style={{color: '#232323'}}>My Profile</h4>
                                <p className="m-0 text-muted mt-1" style={{fontSize: '14px'}}>Manage your personal information and contact details</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Basic Information*/}
                <SectionCandicateBasicInfo />
            </div>
        </>
    )
}

export default CanProfilePage;