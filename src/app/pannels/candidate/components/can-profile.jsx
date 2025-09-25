import SectionCandicateBasicInfo from "../sections/profile/section-can-basic-info";

function CanProfilePage() {
    return (
        <>
            <div className="twm-right-section-panel site-bg-gray">
                {/* Page Header */}
                <div className="panel panel-default mb-4" data-aos="fade-up">
                    <div className="panel-heading wt-panel-heading p-a20 d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            <i className="fa fa-user-circle text-primary me-2" />
                            <h4 className="panel-tittle m-a0">My Profile</h4>
                        </div>
                    </div>
                    <div className="panel-body wt-panel-body p-a20">
                        <p className="m-0 text-muted">Manage your personal information and contact details.</p>
                    </div>
                </div>

                {/*Basic Information*/}
                <SectionCandicateBasicInfo />
            </div>
        </>
    )
}

export default CanProfilePage;