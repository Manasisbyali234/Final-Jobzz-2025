function CanChangePasswordPage() {
    return (
        <>
            <div className="twm-right-section-panel site-bg-gray">
                <form>
                    {/*Basic Information*/}
                    <div className="panel panel-default">
                        <div className="panel-heading wt-panel-heading p-a20">
                            <h4 className="panel-tittle m-a0">Change Password</h4>
                        </div>
                        <div className="panel-body wt-panel-body p-a20 ">
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label>Old Password</label>
                                        <div className="ls-inputicon-box">
                                            <input className="form-control wt-form-control" name="company_name" type="password" placeholder />
                                            <i className="fs-input-icon fa fa-asterisk " />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <div className="ls-inputicon-box">
                                            <input className="form-control wt-form-control" name="company_name" type="password" placeholder />
                                            <i className="fs-input-icon fa fa-asterisk" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <div className="ls-inputicon-box">
                                            <input className="form-control wt-form-control" name="company_name" type="password" placeholder />
                                            <i className="fs-input-icon fa fa-asterisk" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-12 col-lg-12 col-md-12">
                                    <div className="text-left">
                                        <button type="submit" className="site-button">Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </>
    )
}

export default CanChangePasswordPage;