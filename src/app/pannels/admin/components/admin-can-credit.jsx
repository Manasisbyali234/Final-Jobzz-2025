

import React, { useState } from "react";

function AdminCreditsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [assignAllCount, setAssignAllCount] = useState(0);
	const [users, setUsers] = useState([
		{
			id: 1,
			name: "srah",
			email: "srah@metromindz.com",
			credits: 2,
			assignCount: 2,
		},
		{
			id: 1,
			name: "can",
			email: "can@metromindz.com",
			credits: 2,
			assignCount: 2,
		},
	]);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleIncrement = (userId) => {
		setUsers(
			users.map((user) =>
				user.id === userId
					? {
							...user,
							assignCount: user.assignCount + 1,
							credits: user.credits + 1,
					  }
					: user
			)
		);
	};

	const handleDecrement = (userId) => {
		setUsers(
			users.map((user) =>
				user.id === userId && user.assignCount > 0
					? {
							...user,
							assignCount: user.assignCount - 1,
							credits: user.credits - 1 >= 0 ? user.credits - 1 : 0,
					  }
					: user
			)
		);
	};

	const handleAssignAllChange = (e) => {
		const value = parseInt(e.target.value) || 0;
		setAssignAllCount(value);
	};

	const assignToAll = () => {
		const value = assignAllCount;
		setUsers(
			users.map((user) => ({
				...user,
				assignCount: value,
				credits: value,
			}))
		);
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="container py-4">
			<div className="card shadow-sm border-0 mb-4">
				<div className="card-body">
					<h4 className="fw-bold mb-2">Credit Management</h4>
					<p className="text-muted mb-4">
						Assign and manage credits for candidates
					</p>

					<div className="row align-items-end mb-4">
						<div className="col-md-6 mb-2">
							<input
								type="text"
								className="form-control"
								placeholder="Search candidates..."
								value={searchTerm}
								onChange={handleSearchChange}
							/>
						</div>
						<div className="col-md-6 d-flex justify-content-end gap-2">
							<input
								type="number"
								className="form-control"
								style={{ width: "100px" }}
								value={assignAllCount}
								onChange={handleAssignAllChange}
							/>
							<button className="btn btn-dark" onClick={assignToAll}>
								+ Assign to All
							</button>
						</div>
					</div>

					{filteredUsers.length === 0 ? (
						<p className="text-muted">No candidates found.</p>
					) : (
						<div className="list-group">
							{filteredUsers.map((user) => (
								<div
									key={user.id}
									className="list-group-item list-group-item-light rounded mb-3 shadow-sm d-flex justify-content-between align-items-center"
								>
									<div>
										<h6 className="mb-1 fw-semibold">{user.name}</h6>
										<small className="text-muted">{user.email}</small>
									</div>
									<div className="d-flex align-items-center gap-3">
										<span className="badge bg-light text-dark border px-3 py-2">
											<i className="fa fa-key me-1" />
											{user.credits} credits
										</span>
										<div className="input-group" style={{ width: "120px" }}>
											<button
												className="btn btn-outline-secondary"
												onClick={() => handleDecrement(user.id)}
											>
												-
											</button>
											<input
												type="text"
												className="form-control text-center"
												value={user.assignCount}
												readOnly
											/>
											<button
												className="btn btn-outline-secondary"
												onClick={() => handleIncrement(user.id)}
											>
												+
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default AdminCreditsPage;


