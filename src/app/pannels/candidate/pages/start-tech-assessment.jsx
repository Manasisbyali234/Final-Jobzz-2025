import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StartAssessment = () => {
    const navigate = useNavigate();

    const handleSubmit = () => {
			navigate("/candidate/assessment-result", {
				state: {
					answers,
					totalQuestions: assessment.questions.length,
				},
			});
		};
	// Hardcoded data for demo
	const assessment = {
		title: "Technical Assessment - React & JavaScript",
		timeLimit: 30, // minutes
		questions: [
			{
				question: "Which method is used to update state in React?",
				options: [
					"updateState()",
					"setState()",
					"changeState()",
					"modifyState()",
				],
			},
			{
				question: "What does `===` mean in JavaScript?",
				options: [
					"Loose equality",
					"Strict equality",
					"Assignment",
					"Type coercion",
				],
			},
			{
				question: "What is a closure?",
				options: [
					"A function inside a function",
					"A loop",
					"A variable",
					"None",
				],
			},
			{
				question: "Which hook is used for side effects in React?",
				options: ["useEffect", "useState", "useReducer", "useMemo"],
			},
			{
				question: "What is JSX?",
				options: [
					"A JavaScript syntax extension",
					"A JavaScript compiler",
					"A JSON format",
					"A CSS preprocessor",
				],
			},
		],
	};

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState(
		Array(assessment.questions.length).fill(null)
	);
	const [timeLeft, setTimeLeft] = useState(assessment.timeLimit * 60);
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					setIsSubmitted(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	};

	const handleOptionChange = (option) => {
		if (isSubmitted) return;
		const updated = [...answers];
		updated[currentQuestionIndex] = option;
		setAnswers(updated);
	};

	const question = assessment.questions[currentQuestionIndex];

	return (
		<div
			style={{
				padding: "20px",
				fontFamily: "Arial, sans-serif",
				backgroundColor: "#f5f6fa",
				minHeight: "100vh",
			}}
		>
			<div style={{ maxWidth: "900px", margin: "0 auto" }}>
				{/* Title Bar */}
				<div
					style={{
						background: "#fff",
						padding: "20px",
						borderRadius: "8px",
						boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
						marginBottom: "15px",
					}}
				>
					<h2 style={{ margin: "0", fontSize: "20px", fontWeight: "bold" }}>
						{assessment.title}
					</h2>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: "10px",
							alignItems: "center",
						}}
					>
						<div style={{ fontSize: "14px", color: "#555" }}>
							Progress:{" "}
							{Math.round(
								((currentQuestionIndex + 1) / assessment.questions.length) * 100
							)}
							% complete
						</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								fontWeight: "bold",
								color: "#e74c3c",
							}}
						>
							<FaClock style={{ marginRight: "5px" }} />
							{formatTime(timeLeft)}
						</div>
					</div>
					{/* Progress Bar */}
					<div
						style={{
							height: "6px",
							background: "#e0e0e0",
							borderRadius: "3px",
							marginTop: "10px",
						}}
					>
						<div
							style={{
								width: `${
									((currentQuestionIndex + 1) / assessment.questions.length) *
									100
								}%`,
								height: "100%",
								background: "#2c3e50",
								borderRadius: "3px",
							}}
						></div>
					</div>
				</div>

				{/* Question Card */}
				<div
					style={{
						background: "#fff",
						padding: "20px",
						borderRadius: "8px",
						boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
					}}
				>
					<div
						style={{
							marginBottom: "10px",
							fontSize: "16px",
							fontWeight: "bold",
						}}
					>
						{currentQuestionIndex + 1}. {question.question}
					</div>
					<div style={{ display: "flex", flexDirection: "column" }}>
						{question.options.map((option, idx) => (
							<label
								key={idx}
								style={{
									border:
										answers[currentQuestionIndex] === option
											? "2px solid #3498db"
											: "1px solid #ccc",
									borderRadius: "5px",
									padding: "10px",
									marginBottom: "8px",
									cursor: isSubmitted ? "not-allowed" : "pointer",
									backgroundColor:
										answers[currentQuestionIndex] === option
											? "#ecf6fd"
											: "#fff",
									display: "flex",
									alignItems: "center",
								}}
							>
								<input
									type="radio"
									name={`q-${currentQuestionIndex}`}
									value={option}
									checked={answers[currentQuestionIndex] === option}
									onChange={() => handleOptionChange(option)}
									disabled={isSubmitted}
									style={{ marginRight: "10px" }}
								/>
								{option}
							</label>
						))}
					</div>

					{/* Navigation */}
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: "20px",
							alignItems: "center",
						}}
					>
						<button
							onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
							disabled={currentQuestionIndex === 0 || isSubmitted}
							style={{
								background: "transparent",
								border: "1px solid #ccc",
								padding: "8px 15px",
								borderRadius: "5px",
								cursor:
									currentQuestionIndex === 0 || isSubmitted
										? "not-allowed"
										: "pointer",
							}}
						>
							← Previous
						</button>

						{/* Question Navigator */}
						<div style={{ display: "flex", gap: "5px" }}>
							{assessment.questions.map((_, idx) => (
								<button
									key={idx}
									onClick={() => setCurrentQuestionIndex(idx)}
									disabled={isSubmitted}
									style={{
										padding: "5px 10px",
										borderRadius: "4px",
										border:
											idx === currentQuestionIndex ? "none" : "1px solid #ccc",
										background:
											idx === currentQuestionIndex ? "#3498db" : "#fff",
										color: idx === currentQuestionIndex ? "#fff" : "#000",
										cursor: isSubmitted ? "not-allowed" : "pointer",
									}}
								>
									{idx + 1}
								</button>
							))}
						</div>
						<button
							onClick={handleSubmit}
							disabled={isSubmitted}
							style={{
								background: "#2ecc71",
								color: "#fff",
								border: "none",
								padding: "8px 15px",
								borderRadius: "5px",
								cursor: isSubmitted ? "not-allowed" : "pointer",
							}}
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StartAssessment;
