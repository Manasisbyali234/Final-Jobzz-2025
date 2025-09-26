import { Routes, Route } from "react-router-dom";
import { placement } from "../globals/route-names";

// Placement Dashboard Component
function PlacementDashboard() {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <h2>Placement Dashboard</h2>
                    <div className="card">
                        <div className="card-body">
                            <h5>Welcome to Placement Portal</h5>
                            <p>Manage student data and placement activities from here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlacementRoutes() {
    return (
        <Routes>
            <Route path={placement.INITIAL} element={<PlacementDashboard />} />
            <Route path={placement.DASHBOARD} element={<PlacementDashboard />} />
        </Routes>
    )
}

export default PlacementRoutes;