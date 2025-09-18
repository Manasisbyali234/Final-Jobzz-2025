function SectionCanPersonalDetail() {
    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Personal Details</h4>
                <a data-bs-toggle="modal" href="#Personal_Details" role="button" title="Edit" className="site-text-primary">
                    <span className="fa fa-edit" />
                </a>
            </div>
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Date of Birth</div>
                                <span className="twm-s-info-discription">31 July 1998</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Permanent Address</div>
                                <span className="twm-s-info-discription">Add Permanent Address</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Gender</div>
                                <span className="twm-s-info-discription">Male</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Area Pin Code</div>
                                <span className="twm-s-info-discription">302021</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Marital Status</div>
                                <span className="twm-s-info-discription">Single / unmarried</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Hometown</div>
                                <span className="twm-s-info-discription">USA</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Passport Number</div>
                                <span className="twm-s-info-discription">+123 456 7890</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Work permit of other country</div>
                                <span className="twm-s-info-discription">UK</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Differently Abled</div>
                                <span className="twm-s-info-discription">None</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Languages</div>
                                <span className="twm-s-info-discription">English</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*Personal Details Modal */}
            <div className="modal fade twm-saved-jobs-view" id="Personal_Details" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">Personal Detail</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    {/*Birth Date*/}
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Date of Birth</label>
                                            <div className="ls-inputicon-box">
                                                <input className="form-control datepicker" data-provide="datepicker" name="company_since" type="text" placeholder="mm/dd/yyyy" />
                                                <i className="fs-input-icon far fa-calendar" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Gender</label>
                                            <div className="row twm-form-radio-inline">
                                                <div className="col-md-6">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="S_male" />
                                                    <label className="form-check-label" htmlFor="S_male">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="col-md-6">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="S_female" defaultChecked />
                                                    <label className="form-check-label" htmlFor="S_female">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Permanent Address</label>
                                            <div className="ls-inputicon-box">
                                                <input className="form-control" type="text" placeholder="Enter Permanent Address" />
                                                <i className="fs-input-icon fa fa-map-marker-alt" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Hometown</label>
                                            <div className="ls-inputicon-box">
                                                <input className="form-control" type="text" placeholder="Enter Hometown" />
                                                <i className="fs-input-icon fa fa-map-marker-alt" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Pincode</label>
                                            <div className="ls-inputicon-box">
                                                <input className="form-control" type="text" placeholder="Enter Pincode" />
                                                <i className="fs-input-icon fa fa-map-pin" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Marital Status</label>
                                            <div className="ls-inputicon-box">
                                                <select className="wt-select-box selectpicker" data-live-search="true" title="" data-bv-field="size">
                                                    <option className="bs-title-option" value>Select Category</option>
                                                    <option>Married</option>
                                                    <option>Single</option>
                                                </select>
                                                <i className="fs-input-icon fa fa-user" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Passport Number</label>
                                            <div className="ls-inputicon-box">
                                                <input className="form-control" type="text" placeholder="Enter Passport Number" />
                                                <i className="fs-input-icon fa fa-star-of-life" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>What assistance do you need</label>
                                            <textarea className="form-control" rows={3} placeholder="Describe" defaultValue={""} />
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group mb-0">
                                            <label>Work Permit for Other Countries</label>
                                            <div className="ls-inputicon-box">
                                                <select className="wt-select-box selectpicker" data-live-search="true" title="" data-bv-field="size">
                                                    <option className="bs-title-option" value>Country</option>
                                                    <option>Afghanistan</option>
                                                    <option>Albania</option>
                                                    <option>Algeria</option>
                                                    <option>Andorra</option>
                                                    <option>Angola</option>
                                                    <option>Antigua and Barbuda</option>
                                                    <option>Argentina</option>
                                                    <option>Armenia</option>
                                                    <option>Australia</option>
                                                    <option>Austria</option>
                                                    <option>Azerbaijan</option>
                                                    <option>The Bahamas</option>
                                                    <option>Bahrain</option>
                                                    <option>Bangladesh</option>
                                                    <option>Barbados</option>
                                                </select>
                                                <i className="fs-input-icon fa fa-globe-americas" />
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
export default SectionCanPersonalDetail;