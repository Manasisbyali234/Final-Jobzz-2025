import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import { placement } from "../globals/route-names";

// Placement Dashboard Component
function PlacementDashboard() {
    const [studentData, setStudentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/placement/students', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('placementToken')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStudentData(data.students || []);
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

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
            
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4>Student Data ({studentData.length} records)</h4>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center">Loading student data...</div>
                            ) : studentData.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Candidate Name</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Password</th>
                                                <th>Credits</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentData.map((student, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{student.name || 'N/A'}</td>
                                                    <td>{student.phone || ''}</td>
                                                    <td>{student.email || 'N/A'}</td>
                                                    <td><code>{student.password || 'N/A'}</code></td>
                                                    <td>{student.credits || 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center text-muted">No student data available</div>
                            )}
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