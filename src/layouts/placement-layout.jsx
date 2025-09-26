import { useLocation } from "react-router-dom";
import PlacementRoutes from "../routing/placement-routes";

function PlacementLayout() {
    const currentpath = useLocation().pathname;

    return (
        <>
            <div className="page-wraper">
                <div className="page-content">
                    <PlacementRoutes />
                </div>
            </div>
        </>
    )
}

export default PlacementLayout;