
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const AssessmentResults = () => {
// 	const location = useLocation();
// 	const navigate = useNavigate();
// 	const {
// 		answers = [],
// 		totalQuestions = 0,
// 		timeTaken = 0,
// 	} = location.state || {};

// 	const correctAnswers = answers.filter(Boolean).length;
// 	const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(0);
// 	const accuracy = percentage; // Same value as percentage in this case

// 	return (
// 		<div
// 			style={{
// 				fontFamily: "Arial, sans-serif",
// 				backgroundColor: "rgba(0, 0, 0, 0.6)",
// 				minHeight: "100vh",
// 				display: "flex",
// 				justifyContent: "center",
// 				alignItems: "center",
// 				padding: "20px",
// 			}}
// 		>
// 			<div
// 				style={{
// 					background: "#fff",
// 					borderRadius: "12px",
// 					padding: "30px",
// 					width: "100%",
// 					maxWidth: "500px",
// 					textAlign: "center",
// 					boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
// 					position: "relative",
// 				}}
// 			>
// 				{/* Close Button */}
// 				<button
// 					onClick={() => navigate("/")}
// 					style={{
// 						position: "absolute",
// 						right: "15px",
// 						top: "15px",
// 						border: "none",
// 						background: "transparent",
// 						fontSize: "18px",
// 						cursor: "pointer",
// 					}}
// 				>
// 					✖
// 				</button>

// 				<h2 style={{ marginBottom: "15px", fontWeight: "bold" }}>
// 					Assessment Results
// 				</h2>
// 				<p style={{ marginBottom: "20px", color: "#555" }}>
// 					Assessment Completed!
// 				</p>

// 				{/* Percentage */}
// 				<div
// 					style={{
// 						fontSize: "40px",
// 						fontWeight: "bold",
// 						color: percentage >= 60 ? "green" : "red",
// 					}}
// 				>
// 					{percentage}%
// 				</div>
// 				<p style={{ marginBottom: "10px", color: "#555" }}>
// 					{correctAnswers} out of {totalQuestions} correct
// 				</p>

// 				{/* Pass/Fail Badge */}
// 				<span
// 					style={{
// 						display: "inline-block",
// 						padding: "5px 15px",
// 						borderRadius: "20px",
// 						background: percentage >= 60 ? "#d4edda" : "#f8d7da",
// 						color: percentage >= 60 ? "#155724" : "#721c24",
// 						fontWeight: "bold",
// 						marginBottom: "20px",
// 					}}
// 				>
// 					{percentage >= 60 ? "PASSED" : "FAILED"}
// 				</span>

// 				{/* Stats Grid */}
// 				<div
// 					style={{
// 						display: "flex",
// 						justifyContent: "space-around",
// 						marginTop: "20px",
// 						fontSize: "14px",
// 						color: "#333",
// 					}}
// 				>
// 					<div>
// 						<strong>Time Taken</strong>
// 						<div>
// 							{Math.floor(timeTaken / 60)}:
// 							{(timeTaken % 60).toString().padStart(2, "0")}
// 						</div>
// 					</div>
// 					<div>
// 						<strong>Questions Answered</strong>
// 						<div>{totalQuestions}</div>
// 					</div>
// 					<div>
// 						<strong>Accuracy</strong>
// 						<div>{accuracy}%</div>
// 					</div>
// 				</div>

// 				{/* Close Button */}
// 				<button
// 					onClick={() => navigate("/candidate/step")}
// 					style={{
// 						marginTop: "30px",
// 						padding: "10px 20px",
// 						border: "none",
// 						borderRadius: "8px",
// 						background: "#000",
// 						color: "#fff",
// 						cursor: "pointer",
// 					}}
// 				>
// 					Close Assessment
// 				</button>
// 			</div>
// 		</div>
// 	);
// };

// export default AssessmentResults;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AssessmentResults = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const {
		answers = [],
		totalQuestions = 0,
		timeTaken = 0,
		currentStep = 3, // Default to step 3 after assessment
	} = location.state || {};

	const correctAnswers = answers.filter(Boolean).length;
	const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(0);
	const accuracy = percentage; // Same value as percentage here

	// Close and go back to step tracker, preserving step state
	const handleCloseAssessment = () => {
		navigate("/candidate/step", {
			state: {
				currentStep, // Pass step number
				answers,
				totalQuestions,
				timeTaken,
			},
		});
	};

	return (
		<div
			style={{
				fontFamily: "Arial, sans-serif",
				backgroundColor: "rgba(0, 0, 0, 0.6)",
				minHeight: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: "20px",
			}}
		>
			<div
				style={{
					background: "#fff",
					borderRadius: "12px",
					padding: "30px",
					width: "100%",
					maxWidth: "500px",
					textAlign: "center",
					boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
					position: "relative",
				}}
			>
				{/* Close Button */}
				<button
					onClick={handleCloseAssessment}
					style={{
						position: "absolute",
						right: "15px",
						top: "15px",
						border: "none",
						background: "transparent",
						fontSize: "18px",
						cursor: "pointer",
					}}
				>
					✖
				</button>

				<h2 style={{ marginBottom: "15px", fontWeight: "bold" }}>
					Assessment Results
				</h2>
				<p style={{ marginBottom: "20px", color: "#555" }}>
					Assessment Completed!
				</p>

				{/* Percentage */}
				<div
					style={{
						fontSize: "40px",
						fontWeight: "bold",
						color: percentage >= 60 ? "green" : "red",
					}}
				>
					{percentage}%
				</div>
				<p style={{ marginBottom: "10px", color: "#555" }}>
					{correctAnswers} out of {totalQuestions} correct
				</p>

				{/* Pass/Fail Badge */}
				<span
					style={{
						display: "inline-block",
						padding: "5px 15px",
						borderRadius: "20px",
						background: percentage >= 60 ? "#d4edda" : "#f8d7da",
						color: percentage >= 60 ? "#155724" : "#721c24",
						fontWeight: "bold",
						marginBottom: "20px",
					}}
				>
					{percentage >= 60 ? "PASSED" : "FAILED"}
				</span>

				{/* Stats Grid */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-around",
						marginTop: "20px",
						fontSize: "14px",
						color: "#333",
					}}
				>
					<div>
						<strong>Time Taken</strong>
						<div>
							{Math.floor(timeTaken / 60)}:
							{(timeTaken % 60).toString().padStart(2, "0")}
						</div>
					</div>
					<div>
						<strong>Questions Answered</strong>
						<div>{totalQuestions}</div>
					</div>
					<div>
						<strong>Accuracy</strong>
						<div>{accuracy}%</div>
					</div>
				</div>

				{/* Close Button */}
				<button
					onClick={handleCloseAssessment}
					style={{
						marginTop: "30px",
						padding: "10px 20px",
						border: "none",
						borderRadius: "8px",
						background: "#000",
						color: "#fff",
						cursor: "pointer",
					}}
				>
					Close Assessment
				</button>
			</div>
		</div>
	);
};

export default AssessmentResults;

