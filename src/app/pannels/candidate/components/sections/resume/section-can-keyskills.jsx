function SectionCanKeySkills() {
    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Key Skills</h4>
                <a data-bs-toggle="modal" href="#Key_Skills" role="button" title="Edit" className="site-text-primary">
                    <span className="fa fa-edit" />
                </a>
            </div>
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="tw-sidebar-tags-wrap">
                    <div className="tagcloud">
                        <a href="javascript:void(0)">Finance</a>
                        <a href="javascript:void(0)">Sales</a>
                        <a href="javascript:void(0)">Part-time</a>
                        <a href="javascript:void(0)">Administration</a>
                        <a href="javascript:void(0)">Retail</a>
                        <a href="javascript:void(0)">Engineering</a>
                        <a href="javascript:void(0)">Developer</a>
                        <a href="javascript:void(0)">Work from home</a>
                        <a href="javascript:void(0)">IT Consulting</a>
                        <a href="javascript:void(0)">Manufacturing</a>
                    </div>
                </div>
            </div>
            {/*Modal popup */}
            <div className="modal fade twm-saved-jobs-view" id="Key_Skills" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">Key Skills</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <p>It is the first thing recruiters notice in your profile. Write concisely what makes you unique and right person for the job you are looking for.</p>
                                <div className="form-group">
                                    <input className="form-control" type="text" defaultValue="Finance, Sales, Retail, Engineering" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="site-button" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="site-button">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SectionCanKeySkills;