function SectionPagination() {
    return (
        <>
            <div className="pagination-outer">
                <div className="pagination-style1">
                    <ul className="clearfix">
                        <li className="prev"><a href="#"><span> <i className="fa fa-angle-left" /> </span></a></li>
                        <li><a href="#">1</a></li>
                        <li className="active"><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a className="#" href="#"><i className="fa fa-ellipsis-h" /></a></li>
                        <li><a href="#">5</a></li>
                        <li className="next"><a href="#"><span> <i className="fa fa-angle-right" /> </span></a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default SectionPagination;