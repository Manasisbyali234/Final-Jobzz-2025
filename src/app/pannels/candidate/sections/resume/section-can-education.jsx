function SectionCanEducation() {
    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Education</h4>
                <a data-bs-toggle="modal" href="#Education" role="button" title="Edit" className="site-text-primary">
                    <span className="fa fa-edit" />
                </a>
            </div>
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <p>Mention your employment details including your current and previous company work experience</p>
                    <p>2004 to 2006</p>
                    <p><b>BCA - Bachelor of Computer Applications</b></p>
                    <p>2006 to 2008</p>
                    <p><b>MCA - Master of Computer Application</b></p>
                    <p>2008 to 20011</p>
                    <p><b>Design Communication Visual</b></p>
                    <p><a className="site-text-primary" href="#">Add Doctorate/PhD</a></p>
                    <p><a className="site-text-primary" href="#">Add Masters/Post-Graduation</a></p>
                    <p><a className="site-text-primary" href="#">Add Graduation/Diploma</a></p>
                </div>
            </div>
            {/*Education */}
            <div className="modal fade twm-saved-jobs-view" id="Education" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">Education</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Education</label>
                                            <div className="ls-inputicon-box">
                                                <select className="wt-select-box selectpicker" data-live-search="true" title="" data-bv-field="size">
                                                    <option className="bs-title-option" value>Select Category</option>
                                                    <option>Graduation/Diploma</option>
                                                    <option>Masters/Post-Graduation</option>
                                                </select>
                                                <i className="fs-input-icon fa fa-user-graduate" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Course</label>
                                            <div className="ls-inputicon-box">
                                                <select className="wt-select-box selectpicker" data-live-search="true" title="" data-bv-field="size">
                                                    <option className="bs-title-option" value>Select Course</option>
                                                    <option>BBA- Bachelor of Business Administration</option>
                                                    <option>BFA- Bachelor of Fine Arts</option>
                                                    <option>BSW- Bachelor of Social Work</option>
                                                </select>
                                                <i className="fs-input-icon fa fa-book" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>University/Institute</label>
                                            <div className="ls-inputicon-box">
                                                <select className="wt-select-box selectpicker" data-live-search="true" title="" data-bv-field="size">
                                                    <option className="bs-title-option" value>Select University</option>
                                                    <option>University of Cambridge</option>
                                                    <option>Stanford University</option>
                                                    <option>Imperial College London</option>
                                                </select>
                                                <i className="fs-input-icon fas fa-book-reader" />
                                            </div>
                                        </div>
                                    </div>
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
export default SectionCanEducation;