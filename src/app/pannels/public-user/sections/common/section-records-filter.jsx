
function SectionRecordsFilter({ _config }) {
    return (
        <>
            <div className="product-filter-wrap d-flex justify-content-between align-items-center m-b30">
                <span className="woocommerce-result-count-left">
                    {
                        _config.prefix
                    }
                    {
                        _config.showRange ? (" 1-" + _config.showingUpto + " of ") : " "
                    }
                    {
                        _config.total + " " + _config.type
                    }
                </span>
                <form className="woocommerce-ordering twm-filter-select" method="get">
                    <span className="woocommerce-result-count">Short By</span>
                    <select className="wt-select-bar-2 selectpicker" data-live-search="true" data-bv-field="size">
                        <option>Most Recent</option>
                        <option>Freelance</option>
                        <option>Full Time</option>
                        <option>Internship</option>
                        <option>Part Time</option>
                        <option>Temporary</option>
                    </select>
                    <select className="wt-select-bar-2 selectpicker" data-live-search="true" data-bv-field="size">
                        <option>Show 10</option>
                        <option>Show 20</option>
                        <option>Show 30</option>
                        <option>Show 40</option>
                        <option>Show 50</option>
                        <option>Show 60</option>
                    </select>
                </form>
            </div>
        </>
    )
}

export default SectionRecordsFilter;