
import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useParams } from "react-router-dom";
import { employer, empRoute, publicUser } from "../../../../../globals/route-names";

export default function EmpPostJob({ onNext }) {
	const { id } = useParams();
	const isEditMode = Boolean(id);
	const [formData, setFormData] = useState({
		jobTitle: "",
		jobLocation: "",
		jobType: "",
		netSalary: "",
		ctc: "",
		vacancies: "",
		applicationLimit: "",
		jobDescription: "",
		education: "", // dropdown
		backlogsAllowed: false,
		requiredSkills: [],
		skillInput: "",
		experienceLevel: "freshers", // 'freshers' | 'minimum'
		minExperience: "",
		interviewRoundsCount: "",
		interviewRoundTypes: {
			technical: false,
			managerial: false,
			nonTechnical: false,
			final: false,
			hr: false,
		},
		interviewRoundOrder: [],
		interviewRoundDetails: {
			technical: { description: '', fromDate: '', toDate: '', time: '' },
			nonTechnical: { description: '', fromDate: '', toDate: '', time: '' },
			managerial: { description: '', fromDate: '', toDate: '', time: '' },
			final: { description: '', fromDate: '', toDate: '', time: '' },
			hr: { description: '', fromDate: '', toDate: '', time: '' }
		},
		offerLetterDate: "",
		joiningDate: "",
		transportation: {
			oneWay: false,
			twoWay: false,
			noCab: false,
		},
		interviewMode: {
			faceToFace: false,
			phone: false,
			videoCall: false,
			documentVerification: false,
		},
		// Consultant-specific fields
		companyLogo: "",
		companyName: "",
		companyDescription: "",
		category: ""
	});

	const [employerType, setEmployerType] = useState('company');
	const [logoFile, setLogoFile] = useState(null);

	/* Helpers */
	const update = (patch) => setFormData((s) => ({ ...s, ...patch }));

	// Auto-save CTC to localStorage with debouncing
	const autoSaveCTC = useCallback((ctcValue) => {
		if (ctcValue && String(ctcValue).trim()) {
			localStorage.setItem('draft_ctc', ctcValue);
			console.log('CTC auto-saved:', ctcValue);
		}
	}, []);

	// Debounced auto-save
	useEffect(() => {
		const timer = setTimeout(() => {
			if (formData.ctc) {
				autoSaveCTC(formData.ctc);
			}
		}, 500); // Save after 500ms of no typing

		return () => clearTimeout(timer);
	}, [formData.ctc, autoSaveCTC]);

	useEffect(() => {
		if (isEditMode) {
			fetchJobData();
		} else {
			// Load saved CTC from localStorage for new jobs
			const savedCTC = localStorage.getItem('draft_ctc');
			if (savedCTC) {
				update({ ctc: savedCTC });
			}
		}
		fetchEmployerType();
	}, [id, isEditMode]);

	const fetchEmployerType = async () => {
		try {
			const token = localStorage.getItem('employerToken');
			const response = await fetch('http://localhost:5000/api/employer/profile', {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();
			console.log('Profile data:', data);
			if (data.success && data.profile?.employerId) {
				const empType = data.profile.employerId.employerType || 'company';
				const empCategory = data.profile.employerCategory;
				console.log('Employer Type from DB:', empType);
				console.log('Employer Category from DB:', empCategory);
				// Check both employerType and employerCategory
				const finalType = (empType === 'consultant' || empCategory === 'consultancy') ? 'consultant' : 'company';
				console.log('Final employer type set to:', finalType);
				setEmployerType(finalType);
				// For consultants, check if they have default company info in profile
				if (empType === 'consultant' && data.profile.consultantCompanyName) {
					update({
						companyLogo: data.profile.consultantCompanyLogo || '',
						companyName: data.profile.consultantCompanyName || '',
						companyDescription: data.profile.consultantCompanyDescription || ''
					});
				}
			}
		} catch (error) {
			console.error('Error fetching employer type:', error);
		}
	};

	const fetchJobData = async () => {
		try {
			const token = localStorage.getItem('employerToken');
			const response = await fetch('http://localhost:5000/api/employer/jobs', {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();
			if (data.success) {
				const job = data.jobs.find(j => j._id === id);
				if (job) {
					setFormData({
						jobTitle: job.title || '',
						jobLocation: job.location || '',
						jobType: job.jobType || '',
						ctc: job.ctc && job.ctc.min ? (job.ctc.min === job.ctc.max ? (job.ctc.min/100000).toString() : `${(job.ctc.min/100000).toFixed(1)}-${(job.ctc.max/100000).toFixed(1)}`) : '',
						netSalary: job.netSalary && job.netSalary.min ? (job.netSalary.min === job.netSalary.max ? (job.netSalary.min/1000).toString() : `${(job.netSalary.min/1000).toFixed(0)}-${(job.netSalary.max/1000).toFixed(0)}`) : '',
						vacancies: job.vacancies || '',
						applicationLimit: job.applicationLimit || '',
						jobDescription: job.description || '',
						education: job.education || '',
						backlogsAllowed: job.backlogsAllowed || false,
						requiredSkills: job.requiredSkills || [],
						experienceLevel: job.experienceLevel || 'freshers',
						minExperience: job.minExperience || '',
						interviewRoundsCount: job.interviewRoundsCount || '',
						interviewRoundTypes: job.interviewRoundTypes || {
							technical: false,
							managerial: false,
							nonTechnical: false,
							final: false,
							hr: false,
						},
						interviewRoundOrder: job.interviewRoundOrder || [],
						interviewRoundDetails: job.interviewRoundDetails || {
							technical: { description: '', fromDate: '', toDate: '', time: '' },
							nonTechnical: { description: '', fromDate: '', toDate: '', time: '' },
							managerial: { description: '', fromDate: '', toDate: '', time: '' },
							final: { description: '', fromDate: '', toDate: '', time: '' },
							hr: { description: '', fromDate: '', toDate: '', time: '' }
						},
						offerLetterDate: job.offerLetterDate ? job.offerLetterDate.split('T')[0] : '',
						transportation: job.transportation || {
							oneWay: false,
							twoWay: false,
							noCab: false,
						},
						// Consultant fields
						companyLogo: job.companyLogo || '',
						companyName: job.companyName || '',
						companyDescription: job.companyDescription || '',
						category: job.category || '',
						skillInput: '',
						joiningDate: '',
						interviewMode: {
							faceToFace: false,
							phone: false,
							videoCall: false,
							documentVerification: false,
						}
					});
				}
			}
		} catch (error) {
			console.error('Error fetching job data:', error);
		}
	};

	/* Skills logic */
	const addSkill = () => {
		const v = formData.skillInput.trim();
		if (!v) return;
		if (formData.requiredSkills.includes(v)) {
			update({ skillInput: "" });
			return;
		}
		update({
			requiredSkills: [...formData.requiredSkills, v],
			skillInput: "",
		});
	};
	const removeSkill = (skill) =>
		update({
			requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
		});

	/* Toggle nested checkbox groups */
	const toggleNested = (group, key) => {
		if (group === 'interviewRoundTypes') {
			setFormData((s) => {
				const isCurrentlyChecked = s[group][key];
				let newOrder = [...s.interviewRoundOrder];
				
				if (isCurrentlyChecked) {
					// Remove from order if unchecking
					newOrder = newOrder.filter(item => item !== key);
				} else {
					// Add to order if checking
					newOrder.push(key);
				}
				
				return {
					...s,
					[group]: { ...s[group], [key]: !s[group][key] },
					interviewRoundOrder: newOrder
				};
			});
		} else {
			setFormData((s) => ({
				...s,
				[group]: { ...s[group], [key]: !s[group][key] },
			}));
		}
	};

	/* Update interview round details */
	const updateRoundDetails = (roundType, field, value) => {
		setFormData(s => ({
			...s,
			interviewRoundDetails: {
				...s.interviewRoundDetails,
				[roundType]: {
					...s.interviewRoundDetails[roundType],
					[field]: value
				}
			}
		}));
	};

	const handleLogoUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setLogoFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				update({ companyLogo: e.target.result });
			};
			reader.readAsDataURL(file);
		}
	};

	const submitNext = async () => {
		try {
			const token = localStorage.getItem('employerToken');
			if (!token) {
				alert('Please login first');
				return;
			}

			// Validate required fields
			if (!formData.jobTitle.trim()) {
				alert('Please enter Job Title');
				return;
			}
			if (!formData.category.trim()) {
				alert('Please select Job Category');
				return;
			}
			if (!formData.jobType.trim()) {
				alert('Please select Job Type');
				return;
			}
			if (!formData.jobLocation.trim()) {
				alert('Please enter Job Location');
				return;
			}
			if (!formData.vacancies || parseInt(formData.vacancies) <= 0) {
				alert('Please enter valid Number of Vacancies');
				return;
			}
			if (!formData.applicationLimit || parseInt(formData.applicationLimit) <= 0) {
				alert('Please enter valid Application Limit');
				return;
			}
			if (!formData.education.trim()) {
				alert('Please select Required Educational Background');
				return;
			}
			if (!formData.interviewRoundsCount || parseInt(formData.interviewRoundsCount) <= 0) {
				alert('Please enter valid Number of Interview Rounds');
				return;
			}
			if (!formData.offerLetterDate.trim()) {
				alert('Please select Offer Letter Release Date');
				return;
			}
			if (!formData.jobDescription.trim()) {
				alert('Please enter Job Description');
				return;
			}

			// Validate consultant fields
			if (employerType === 'consultant') {
				if (!formData.companyName.trim()) {
					alert('Please enter Company Name (required for consultants)');
					return;
				}
				if (!formData.companyDescription.trim()) {
					alert('Please enter Company Description (required for consultants)');
					return;
				}
			}

			// Debug logging
			console.log('Employer Type:', employerType);
			console.log('Form Data:', formData);

			const jobData = {
				title: formData.jobTitle,
				location: formData.jobLocation,
				jobType: formData.jobType.toLowerCase().replace(/\s+/g, '-'),
				ctc: formData.ctc,
				netSalary: formData.netSalary,
				vacancies: parseInt(formData.vacancies) || 0,
				applicationLimit: parseInt(formData.applicationLimit) || 0,
				description: formData.jobDescription || 'Job description to be updated',
				requiredSkills: formData.requiredSkills,
				experienceLevel: formData.experienceLevel,
				minExperience: formData.minExperience ? parseInt(formData.minExperience) : 0,
				education: formData.education,
				backlogsAllowed: formData.backlogsAllowed,
				interviewRoundsCount: parseInt(formData.interviewRoundsCount) || 0,
				interviewRoundTypes: formData.interviewRoundTypes,
				interviewRoundDetails: formData.interviewRoundDetails,
				offerLetterDate: formData.offerLetterDate || null,
				transportation: formData.transportation,
				category: formData.category,
				companyLogo: formData.companyLogo,
				companyName: formData.companyName,
				companyDescription: formData.companyDescription
			};

			// Add consultant-specific fields if employer is consultant
			if (employerType === 'consultant') {
				console.log('Adding consultant fields:', {
					companyLogo: formData.companyLogo,
					companyName: formData.companyName,
					companyDescription: formData.companyDescription
				});
				jobData.companyLogo = formData.companyLogo;
				jobData.companyName = formData.companyName;
				jobData.companyDescription = formData.companyDescription;
			}

			console.log('Final job data being sent:', jobData);

			const url = isEditMode 
				? `http://localhost:5000/api/employer/jobs/${id}`
				: 'http://localhost:5000/api/employer/jobs';
			
			const method = isEditMode ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(jobData)
			});

			console.log('Response status:', response.status);

			if (response.ok) {
				const data = await response.json();
				// Clear saved CTC from localStorage after successful submission
				localStorage.removeItem('draft_ctc');
				alert(isEditMode ? 'Job updated successfully!' : 'Job posted successfully!');
				window.location.href = '/employer/manage-jobs';
			} else {
				const error = await response.json();
				alert(error.message || `Failed to ${isEditMode ? 'update' : 'post'} job`);
			}
		} catch (error) {
			console.error('Error posting job:', error);
			alert('Failed to post job. Please try again.');
		}
	};

	/* Inline style objects */
	const page = {
		padding: 20,
		maxWidth: 1100,
		margin: "10px auto",
		fontFamily: "Inter, Arial, sans-serif",
	};
	const card = {
		background: "#fff",
		padding: 20,
		borderRadius: 8,
		boxShadow: "0 0 0 1px rgba(15,23,42,0.03)",
	};
	const heading = {
		margin: 0,
		marginBottom: 6,
		fontSize: 18,
		color: "#111827",
	};
	const sub = { color: "#6b7280", marginBottom: 12, fontSize: 13 };
	const progressWrap = {
		display: "flex",
		alignItems: "center",
		gap: 12,
		marginBottom: 18,
	};
	const progressBar = {
		flex: 1,
		height: 8,
		background: "#f3f4f6",
		borderRadius: 6,
		position: "relative",
		overflow: "hidden",
	};
	const progressFill = {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		width: "33%",
		background: "#0f172a",
	};
	const stepCircle = (active) => ({
		width: 28,
		height: 28,
		borderRadius: "50%",
		background: active ? "#0f172a" : "#fff",
		color: active ? "#fff" : "#6b7280",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: active ? "none" : "1px solid #e5e7eb",
		fontSize: 13,
		fontWeight: 600,
	});

	const grid = {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: 16,
		alignItems: "start",
	};
	const fullRow = { gridColumn: "1 / -1" };
	const label = {
		display: "block",
		fontSize: 13,
		color: "#374151",
		marginBottom: 6,
	};
	const input = {
		width: "100%",
		padding: "10px 12px",
		borderRadius: 8,
		border: "1px solid #e6eef6",
		background: "#f6fbff",
		outline: "none",
		fontSize: 14,
		boxSizing: "border-box",
	};
	const smallInput = { ...input, width: 180 };
	const plusBtn = {
		marginLeft: 8,
		width: 38,
		height: 38,
		borderRadius: 8,
		border: "none",
		background: "#0f172a",
		color: "#fff",
		cursor: "pointer",
		fontSize: 20,
		lineHeight: 1,
	};
	const chip = {
		padding: "6px 10px",
		background: "#eef2ff",
		borderRadius: 999,
		display: "inline-flex",
		gap: 8,
		alignItems: "center",
		fontSize: 13,
	};
	const chipX = {
		marginLeft: 6,
		cursor: "pointer",
		color: "#ef4444",
		fontWeight: 700,
	};

	return (
		<div style={page}>
			{/* Card */}
			<div style={card}>
				<h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 16 }}>
					{isEditMode ? 'Edit Job Information' : 'Job Information'}
				</h3>

				<div style={grid}>
					{/* Consultant Fields */}
					{employerType === 'consultant' && (
						<>
							<div style={fullRow}>
								<h4 style={{ margin: "12px 0", fontSize: 15, color: "#0f172a", background: '#e8f5e8', padding: '8px', borderRadius: '4px' }}>
									✓ Company Information (Consultant Mode)
								</h4>
							</div>
							<div>
								<label style={label}><i className="fa fa-image" style={{marginRight: '6px', color: '#ff6b35'}}></i>Company Logo</label>
								<input
									style={input}
									type="file"
									accept="image/*"
									onChange={handleLogoUpload}
								/>
								{formData.companyLogo && (
									<img src={formData.companyLogo} alt="Company Logo" style={{width: '60px', height: '60px', marginTop: '8px', objectFit: 'cover'}} />
								)}
							</div>
							<div>
								<label style={{...label, color: '#d32f2f', fontWeight: 'bold'}}><i className="fa fa-building" style={{marginRight: '6px', color: '#d32f2f'}}></i>Company Name * (Required for Consultants)</label>
								<input
									style={{...input, borderColor: formData.companyName ? '#4caf50' : '#f44336'}}
									placeholder="e.g., Tech Solutions Inc."
									value={formData.companyName}
									onChange={(e) => update({ companyName: e.target.value })}
									required
								/>
								{!formData.companyName && <p style={{color: '#f44336', fontSize: '12px', margin: '4px 0 0 0'}}>Please enter company name</p>}
							</div>
							<div style={fullRow}>
								<label style={{...label, color: '#d32f2f', fontWeight: 'bold'}}><i className="fa fa-info-circle" style={{marginRight: '6px', color: '#d32f2f'}}></i>Company Description * (Required for Consultants)</label>
								<textarea
									style={{...input, minHeight: '80px', borderColor: formData.companyDescription ? '#4caf50' : '#f44336'}}
									placeholder="Brief description about the company..."
									value={formData.companyDescription}
									onChange={(e) => update({ companyDescription: e.target.value })}
									required
								/>
								{!formData.companyDescription && <p style={{color: '#f44336', fontSize: '12px', margin: '4px 0 0 0'}}>Please enter company description</p>}
							</div>
						</>
					)}

					{/* Row 1 */}
					<div>
						<label style={label}><i className="fa fa-briefcase" style={{marginRight: '6px', color: '#ff6b35'}}></i>Job Title / Designation *</label>
						<input
							style={input}
							placeholder="e.g., Senior Software Engineer"
							value={formData.jobTitle}
							onChange={(e) => update({ jobTitle: e.target.value })}
						/>
					</div>

					<div>
						<label style={label}><i className="fa fa-tags" style={{marginRight: '6px', color: '#ff6b35'}}></i>Job Category *</label>
						<select
							style={{ ...input, appearance: "none", backgroundImage: "none" }}
							value={formData.category}
							onChange={(e) => update({ category: e.target.value })}
						>
							<option value="" disabled>Select Category</option>
							<option value="IT">IT</option>
							<option value="Sales">Sales</option>
							<option value="Marketing">Marketing</option>
							<option value="Finance">Finance</option>
							<option value="HR">HR</option>
							<option value="Operations">Operations</option>
							<option value="Design">Design</option>
							<option value="Content">Content</option>
							<option value="Healthcare">Healthcare</option>
							<option value="Education">Education</option>
							<option value="Other">Other</option>
						</select>
					</div>

					<div>
						<label style={label}><i className="fa fa-clock" style={{marginRight: '6px', color: '#ff6b35'}}></i>Job Type *</label>
						<select
							style={{ ...input, appearance: "none", backgroundImage: "none" }}
							value={formData.jobType}
							onChange={(e) => update({ jobType: e.target.value })}
						>
							<option value="" disabled>Select Job Type</option>
							<option>Full-Time</option>
							<option>Part-Time</option>
							<option>Internship (Paid)</option>
							<option>Internship (Unpaid)</option>
							<option>Work From Home</option>
							<option>Contract</option>
							<option>Design</option>
							<option>Healthcare</option>
							<option>Marketing</option>
						</select>
					</div>

					{/* Row 2 */}
					<div>
						<label style={label}><i className="fa fa-map-marker-alt" style={{marginRight: '6px', color: '#ff6b35'}}></i>Job Location *</label>
						<input
							style={input}
							placeholder="e.g., Bangalore, Mumbai, Remote"
							value={formData.jobLocation}
							onChange={(e) => update({ jobLocation: e.target.value })}
						/>
					</div>

					<div>
						<label style={label}><i className="fa fa-rupee-sign" style={{marginRight: '6px', color: '#ff6b35'}}></i>CTC (Annual) 
							<span style={{fontSize: '11px', color: '#10b981', fontWeight: 'normal'}}>✓ Auto-saved</span>
						</label>
						<input
							style={input}
							placeholder="e.g., 8 L.P.A"
							value={formData.ctc}
							onChange={(e) => update({ ctc: e.target.value })}
						/>
					</div>

					{/* Row 3 */}
					<div>
						<label style={label}><i className="fa fa-money-bill-wave" style={{marginRight: '6px', color: '#ff6b35'}}></i>Net Salary (Monthly)</label>
						<input
							style={input}
							placeholder="e.g., ₹50,000"
							value={formData.netSalary}
							onChange={(e) => update({ netSalary: e.target.value })}
						/>
					</div>

					<div>
						<label style={label}><i className="fa fa-users" style={{marginRight: '6px', color: '#ff6b35'}}></i>Number of Vacancies *</label>
						<input
							style={input}
							type="number"
							placeholder="e.g., 5"
							value={formData.vacancies}
							onChange={(e) => update({ vacancies: e.target.value })}
						/>
					</div>

					<div>
						<label style={label}><i className="fa fa-file-alt" style={{marginRight: '6px', color: '#ff6b35'}}></i>Application Limit *</label>
						<input
							style={input}
							type="number"
							placeholder="e.g., 100"
							value={formData.applicationLimit}
							onChange={(e) => update({ applicationLimit: e.target.value })}
						/>
					</div>

					{/* Row 4 */}
					<div>
						<label style={label}><i className="fa fa-question-circle" style={{marginRight: '6px', color: '#ff6b35'}}></i>Are Backlogs Allowed?</label>
						<select
							style={{ ...input, appearance: "none" }}
							value={formData.backlogsAllowed ? "Yes" : "No"}
							onChange={(e) =>
								update({ backlogsAllowed: e.target.value === "Yes" })
							}
						>
							<option value="No">No</option>
							<option value="Yes">Yes</option>
						</select>
					</div>

					<div>
						<label style={label}><i className="fa fa-graduation-cap" style={{marginRight: '6px', color: '#ff6b35'}}></i>Required Educational Background *</label>
						<select
							style={{ ...input, appearance: "none" }}
							value={formData.education}
							onChange={(e) => update({ education: e.target.value })}
						>
							<option value="" disabled>
								Select Education Level
							</option>
							<option value="Any">Any</option>
							<option value="B.Tech">B.Tech</option>
							<option value="M.Tech">M.Tech</option>
							<option value="B.Sc">B.Sc</option>
							<option value="M.Sc">M.Sc</option>
							<option value="MBA">MBA</option>
						</select>
					</div>

					{/* Skills (full width) */}
					<div style={fullRow}>
						<label style={label}><i className="fa fa-cogs" style={{marginRight: '6px', color: '#ff6b35'}}></i>Required Skills</label>
						<div style={{ display: "flex", alignItems: "center" }}>
							<input
								style={{ ...input, marginBottom: 0 }}
								placeholder="Add a skill (e.g., React, Java, Python)"
								value={formData.skillInput}
								onChange={(e) => update({ skillInput: e.target.value })}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addSkill();
									}
								}}
							/>
							<button
								type="button"
								onClick={addSkill}
								style={plusBtn}
								aria-label="Add skill"
								title="Add skill"
							>
								+
							</button>
						</div>

						{/* chips */}
						<div
							style={{
								marginTop: 10,
								display: "flex",
								gap: 8,
								flexWrap: "wrap",
							}}
						>
							{formData.requiredSkills.map((s, i) => (
								<div key={i} style={chip}>
									<span>{s}</span>
									<span style={chipX} onClick={() => removeSkill(s)}>
										×
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Experience & Rounds */}
					<div>
						<label style={label}><i className="fa fa-chart-line" style={{marginRight: '6px', color: '#ff6b35'}}></i>Experience Level</label>
						<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
							<label style={{ fontSize: 14, color: "#374151" }}>
								<input
									type="radio"
									name="experience"
									checked={formData.experienceLevel === "freshers"}
									onChange={() =>
										update({ experienceLevel: "freshers", minExperience: "" })
									}
								/>{" "}
								Fresher
							</label>

							<label style={{ fontSize: 14, color: "#374151" }}>
								<input
									type="radio"
									name="experience"
									checked={formData.experienceLevel === "minimum"}
									onChange={() => update({ experienceLevel: "minimum" })}
								/>{" "}
								Experienced
							</label>

							<label style={{ fontSize: 14, color: "#374151" }}>
								<input
									type="radio"
									name="both"
									checked={formData.experienceLevel === "both"}
									onChange={() =>
										update({ experienceLevel: "both", minExperience: "" })
									}
								/>{" "}
								Both
							</label>

							{formData.experienceLevel === "minimum" && (
								<input
									style={{ ...smallInput, marginLeft: 8 }}
									type="number"
									placeholder="Years"
									value={formData.minExperience}
									onChange={(e) => update({ minExperience: e.target.value })}
								/>
							)}
						</div>
					</div>

					<div>
						<label style={label}><i className="fa fa-comments" style={{marginRight: '6px', color: '#ff6b35'}}></i>Number of Interview Rounds *</label>
						<input
							style={input}
							type="number"
							placeholder="e.g., 3"
							value={formData.interviewRoundsCount}
							onChange={(e) => update({ interviewRoundsCount: e.target.value })}
						/>
					</div>

					{/* Interview Round Types - full row */}
					<div style={fullRow}>
						<label style={label}><i className="fa fa-list-check" style={{marginRight: '6px', color: '#ff6b35'}}></i>Interview Round Types 
							<span style={{fontSize: '11px', color: '#6b7280', fontWeight: 'normal'}}>
								({Object.values(formData.interviewRoundTypes).filter(Boolean).length} selected)
							</span>
						</label>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(2, 1fr)",
								gap: 8,
							}}
						>
							<label style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<span style={{fontSize: '11px', color: '#6b7280', minWidth: '15px'}}>
									{formData.interviewRoundTypes.technical ? (formData.interviewRoundOrder || []).indexOf('technical') + 1 : ''}
								</span>
								<input
									type="checkbox"
									checked={formData.interviewRoundTypes.technical}
									onChange={() =>
										toggleNested("interviewRoundTypes", "technical")
									}
								/>
								Technical
							</label>

							<label style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<span style={{fontSize: '11px', color: '#6b7280', minWidth: '15px'}}>
									{formData.interviewRoundTypes.nonTechnical ? (formData.interviewRoundOrder || []).indexOf('nonTechnical') + 1 : ''}
								</span>
								<input
									type="checkbox"
									checked={formData.interviewRoundTypes.nonTechnical}
									onChange={() =>
										toggleNested("interviewRoundTypes", "nonTechnical")
									}
								/>
								Non-Technical
							</label>

							<label style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<span style={{fontSize: '11px', color: '#6b7280', minWidth: '15px'}}>
									{formData.interviewRoundTypes.managerial ? (formData.interviewRoundOrder || []).indexOf('managerial') + 1 : ''}
								</span>
								<input
									type="checkbox"
									checked={formData.interviewRoundTypes.managerial}
									onChange={() =>
										toggleNested("interviewRoundTypes", "managerial")
									}
								/>
								Managerial Round
							</label>

							<label style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<span style={{fontSize: '11px', color: '#6b7280', minWidth: '15px'}}>
									{formData.interviewRoundTypes.final ? (formData.interviewRoundOrder || []).indexOf('final') + 1 : ''}
								</span>
								<input
									type="checkbox"
									checked={formData.interviewRoundTypes.final}
									onChange={() => toggleNested("interviewRoundTypes", "final")}
								/>
								Final Round
							</label>

							<label style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<span style={{fontSize: '11px', color: '#6b7280', minWidth: '15px'}}>
									{formData.interviewRoundTypes.hr ? (formData.interviewRoundOrder || []).indexOf('hr') + 1 : ''}
								</span>
								<input
									type="checkbox"
									checked={formData.interviewRoundTypes.hr}
									onChange={() => toggleNested("interviewRoundTypes", "hr")}
								/>
								HR Round
							</label>
						</div>
					</div>

					{/* Interview Round Details */}
					{Object.entries(formData.interviewRoundTypes).some(([key, value]) => value) && (
						<div style={fullRow}>
							<h4 style={{ margin: "16px 0 12px 0", fontSize: 15, color: "#0f172a" }}>
								Interview Round Details
							</h4>
							{Object.entries(formData.interviewRoundTypes)
								.filter(([key, value]) => value)
								.map(([roundType]) => {
									const roundNames = {
										technical: 'Technical Round',
										nonTechnical: 'Non-Technical Round',
										managerial: 'Managerial Round',
										final: 'Final Round',
										hr: 'HR Round'
									};
									return (
										<div key={roundType} style={{ 
											marginBottom: 16, 
											padding: 12, 
											border: '1px solid #e5e7eb', 
											borderRadius: 8,
											background: '#f9fafb'
										}}>
											<h5 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#374151' }}>
												{roundNames[roundType]}
											</h5>
											<div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 100px', gap: 12, alignItems: 'end' }}>
												<div>
													<label style={{...label, marginBottom: 4}}>Description</label>
													<textarea
														style={{...input, minHeight: '60px', fontSize: 13}}
														placeholder={`Describe the ${roundNames[roundType].toLowerCase()}...`}
														value={formData.interviewRoundDetails[roundType].description}
														onChange={(e) => updateRoundDetails(roundType, 'description', e.target.value)}
													/>
												</div>
												<div>
													<label style={{...label, marginBottom: 4}}>From Date</label>
													<input
														style={{...input, fontSize: 13}}
														type="date"
														value={formData.interviewRoundDetails[roundType].fromDate}
														onChange={(e) => updateRoundDetails(roundType, 'fromDate', e.target.value)}
													/>
												</div>
												<div>
													<label style={{...label, marginBottom: 4}}>To Date</label>
													<input
														style={{...input, fontSize: 13}}
														type="date"
														value={formData.interviewRoundDetails[roundType].toDate}
														onChange={(e) => updateRoundDetails(roundType, 'toDate', e.target.value)}
													/>
												</div>
												<div>
													<label style={{...label, marginBottom: 4}}>Time</label>
													<input
														style={{...input, fontSize: 13}}
														type="time"
														value={formData.interviewRoundDetails[roundType].time}
														onChange={(e) => updateRoundDetails(roundType, 'time', e.target.value)}
													/>
												</div>
											</div>
										</div>
									);
								})
							}
						</div>
					)}

					{/* Dates */}
					<div>
						<label style={label}><i className="fa fa-calendar-alt" style={{marginRight: '6px', color: '#ff6b35'}}></i>Offer Letter Release Date *</label>
						<input
							style={input}
							type="date"
							value={formData.offerLetterDate}
							onChange={(e) => update({ offerLetterDate: e.target.value })}
							placeholder="dd/mm/yyyy"
						/>
					</div>
					
					{/* Job Description */}
					<div style={fullRow}>
						<label style={label}><i className="fa fa-align-left" style={{marginRight: '6px', color: '#ff6b35'}}></i>Job Description *</label>
						<textarea 
							style={{...input, minHeight: '100px'}} 
							value={formData.jobDescription}
							onChange={(e) => update({ jobDescription: e.target.value })}
							placeholder="Enter detailed job description..."
						/>
					</div>

					{/* Candidate Transportation & Interview Facility (full row) */}
					<div style={fullRow}>
						<h4 style={{ margin: "12px 0", fontSize: 15 }}>
							<i className="fa fa-car" style={{marginRight: '8px', color: '#ff6b35'}}></i>Candidate Transportation Options
						</h4>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr 1fr",
								gap: 16,
							}}
						>
							<div>
								<label style={{ display: "block" }}>
									<input
										type="checkbox"
										checked={formData.transportation.oneWay}
										onChange={() => toggleNested("transportation", "oneWay")}
									/>{" "}
									One-way Cab
								</label>

								<label style={{ display: "block" }}>
									<input
										type="checkbox"
										checked={formData.transportation.twoWay}
										onChange={() => toggleNested("transportation", "twoWay")}
									/>{" "}
									Two-way Cab
								</label>

								<label style={{ display: "block" }}>
									<input
										type="checkbox"
										checked={formData.transportation.noCab}
										onChange={() => toggleNested("transportation", "noCab")}
									/>{" "}
									No Cab
								</label>
							</div>
						</div>
					</div>
				</div>

				<div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
					<NavLink to={empRoute(employer.MANAGE_JOBS)}>
						<button
						style={{
							background: "#0f172a",
							color: "#fff",
							border: "none",
							padding: "10px 18px",
							borderRadius: 8,
							cursor: "pointer",
							}}
						>
							Back
						</button>
					</NavLink>
					
					<button
						onClick={submitNext}
						style={{
							background: "#0f172a",
							color: "#fff",
							border: "none",
							padding: "10px 18px",
							borderRadius: 8,
							cursor: "pointer",
						}}
					>
						{isEditMode ? 'Update Job' : 'Next'}
					</button>
				</div>
			</div>
		</div>
	);
}

