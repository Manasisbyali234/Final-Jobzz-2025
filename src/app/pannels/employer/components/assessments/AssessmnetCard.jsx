


import React, { useState } from "react";
import { FaClock, FaQuestionCircle } from "react-icons/fa";

// Your Assessment Card Component
function AssessmentCard({ data, onClick }) {
	return (
		<div
			style={{
				background: "#fff",
				borderRadius: "10px",
				border: "1px solid #e0e0e0",
				padding: "17px",
				marginBottom: "12px",
				width: "100%",
				cursor: "pointer",
				boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
				transition: "box-shadow 0.3s ease",
			}}
			onMouseEnter={(e) =>
				(e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)")
			}
			onMouseLeave={(e) =>
				(e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)")
			}
			onClick={() => onClick(data)}
		>
			{/* Top Row: Title + Badge */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "8px",
				}}
			>
				<h3
					style={{
						fontSize: "16px",
						fontWeight: "600",
						color: "#333",
						margin: 0,
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					{data.title}
				</h3>
				<span
					style={{
						fontSize: "11px",
						fontWeight: "500",
						padding: "3px 8px",
						borderRadius: "12px",
						background:
							data.type === "Technical"
								? "#e0f0ff"
								: data.type === "Soft Skill"
								? "#e0f9e5"
								: "#fff7e0",
						color:
							data.type === "Technical"
								? "#0073e6"
								: data.type === "Soft Skill"
								? "#2d8a4b"
								: "#b38b00",
					}}
				>
					{data.type}
				</span>
			</div>

			{/* Bottom Row: Time & Questions */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					fontSize: "13px",
					color: "#666",
					gap: "15px",
				}}
			>
				<div style={{ display: "flex", alignItems: "center" }}>
					<FaClock style={{ marginRight: "6px", color: "#0073e6" }} />
					{data.timeLimit} min
				</div>
				<div style={{ display: "flex", alignItems: "center" }}>
					<FaQuestionCircle style={{ marginRight: "5px", color: "#f39c12" }} />
					{data.questions?.length || 0} questions
				</div>
			</div>
		</div>
	);
}

// Question Viewer (Right Side)
function QuestionViewer({ questionData, onClose }) {
	if (!questionData) {
		return (
			<div
				style={{
					flex: 1,
					background: "#fafafa",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "#999",
					fontSize: "14px",
				}}
			>
				Select an assessment to view questions
			</div>
		);
	}

	return (
		<div style={{ flex: 1, background: "#fff", padding: "20px" }}>
			<h2 style={{ fontSize: "18px", marginBottom: "10px" }}>
				{questionData.title}
			</h2>
			{questionData.questions.map((q, idx) => (
				<div
					key={idx}
					style={{
						marginBottom: "20px",
						padding: "15px",
						border: "1px solid #ddd",
						borderRadius: "8px",
						background: "#f9f9f9",
					}}
				>
					<p style={{ fontWeight: "600", marginBottom: "10px" }}>
						{idx + 1}. {q.question}
					</p>
					{q.options.map((opt, oIdx) => (
						<div key={oIdx} style={{ marginBottom: "5px" }}>
							<label>
								<input
									type="radio"
									name={`q-${idx}`}
									value={opt}
									style={{ marginRight: "8px" }}
								/>
								{opt}
							</label>
						</div>
					))}
				</div>
			))}
			<button
				onClick={onClose}
				style={{
					padding: "8px 14px",
					background: "#0073e6",
					color: "#fff",
					border: "none",
					borderRadius: "6px",
					cursor: "pointer",
				}}
			>
				Close
			</button>
		</div>
	);
}

// Main Component
export default function SinglePageAssessments() {
	const [selectedAssessment, setSelectedAssessment] = useState(null);

	const assessments = [
		{
			title: "JavaScript Basics",
			type: "Technical",
			timeLimit: 30,
			questions: [
				{
					question: "What is the output of 2 + '2' in JavaScript?",
					options: ["4", "22", "NaN", "Error"],
				},
				{
					question: "Which keyword is used to declare a constant?",
					options: ["var", "let", "const", "constant"],
				},
			],
		},
		{
			title: "Communication Skills",
			type: "Soft Skill",
			timeLimit: 20,
			questions: [
				{
					question: "Which is an example of active listening?",
					options: [
						"Interrupting to share your view",
						"Maintaining eye contact",
						"Looking at your phone",
						"Speaking over someone",
					],
				},
			],
		},
	];

	return (
		<div style={{ display: "flex", height: "100vh", background: "#f5f5f5" }}>
			{/* Left Side: List */}
			<div
				style={{
					flex: 1,
					padding: "20px",
					borderRight: "1px solid #ddd",
					overflowY: "auto",
				}}
			>
				<h1 style={{ fontSize: "20px", marginBottom: "15px" }}>Assessments</h1>
				{assessments.map((a, idx) => (
					<AssessmentCard key={idx} data={a} onClick={setSelectedAssessment} />
				))}
			</div>

			{/* Right Side: Question Viewer */}
			<QuestionViewer
				questionData={selectedAssessment}
				onClose={() => setSelectedAssessment(null)}
			/>
		</div>
	);
}
