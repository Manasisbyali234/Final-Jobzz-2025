import React, { useState } from "react";
import AssessmentCard from "../assessments/AssessmnetCard";
import CreateAssessmentModal from "../assessments/CreateassessmentModal";


export default function AssessmentDashboard() {
	const [assessments, setAssessments] = useState([]);
	const [showModal, setShowModal] = useState(false);

	const handleCreateAssessment = (newAssessment) => {
		setAssessments((prev) => [...prev, newAssessment]);
		setShowModal(false);
	};

	return (
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded bg-light shadow-sm">
				<div>
					<h4 className="mb-1">Assessments</h4>
					<small className="text-muted">
						Manage and create your assessments
					</small>
				</div>
				<button className="btn btn-dark" onClick={() => setShowModal(true)}>
					+ Create Assessment
				</button>
			</div>

			{assessments.length === 0 ? (
				<p className="mt-4 text-muted">
					No assessments yet. Create one to get started.
				</p>
			) : (
				<div className="mt-4">
					{assessments.map((assessment, index) => (
						<AssessmentCard key={index} data={assessment} />
					))}
				</div>
			)}

			{showModal && (
				<CreateAssessmentModal
					onClose={() => setShowModal(false)}
					onCreate={handleCreateAssessment}
				/>
			)}
		</div>
	);
}
