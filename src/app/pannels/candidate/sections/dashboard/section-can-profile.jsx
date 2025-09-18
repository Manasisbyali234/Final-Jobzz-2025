// function CompleteProfileCard({ profileCompletion = 85 }) {
//   return (
//     <div className="panel panel-default">
//       <div className="panel-body wt-panel-body">
//         <h2 className="text-primary">Complete Your Profile</h2>
//         <p className="m-b10">A complete profile increases your chances of getting hired</p>

//         <div className="m-b10">
//           <strong>Profile Completion</strong>
//           <span>{profileCompletion}%</span>
//         </div>

//         <div className="progress wt-progress mb-3" style={{ height: '10px', borderRadius: '10px' }}>
//           <div
//             className="progress-bar"
//             role="progressbar"
//             style={{
//               width: `${profileCompletion}%`,
//               backgroundColor: '#2563eb', // Blue color
//               height: '100%',
//               borderRadius: '10px',
//             }}
//           />
//         </div>

//         <div className="d-flex gap-2">
//           <button
//             className="btn btn-primary btn-sm"
//             onClick={() => (window.location.href = '/candidate/profile')}
//           >
//             Update Profile
//           </button>
//           <button
//             className="btn btn-outline-secondary btn-sm"
//             onClick={() => (window.location.href = '/candidate/my-resume')}
//           >
//             Upload Documents
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CompleteProfileCard;

function CompleteProfileCard({ profileCompletion = 85 }) {
	return (
		<div className="bg-white p-4 rounded shadow-sm mb-4">
			<h4 className="text-primary mb-2">Complete Your Profile</h4>
			<p className="text-muted mb-3" style={{ fontSize: "14px" }}>
				A complete profile increases your chances of getting hired
			</p>

			{/* Profile Completion Label */}
			<div className="d-flex justify-content-between align-items-center mb-1">
				<span className="fw-semibold">Profile Completion</span>
				<span className="text-primary fw-semibold">{profileCompletion}%</span>
			</div>

			{/* Progress Bar */}
			<div
				className="progress"
				style={{ height: "10px", borderRadius: "10px" }}
			>
				<div
					className="progress-bar"
					role="progressbar"
					style={{
						width: `${profileCompletion}%`,
						backgroundColor: "#2563eb", // consistent blue
						borderRadius: "10px",
					}}
				/>
			</div>

			{/* Action Buttons */}
			<div className="mt-3 d-flex flex-wrap gap-2">
				<button
					className="btn btn-primary btn-sm"
					onClick={() => (window.location.href = "/candidate/profile")}
				>
					Update Profile
				</button>
				{/* <button
					className="btn btn-outline-secondary btn-sm"
					onClick={() => (window.location.href = "/candidate/my-resume")}
				>
					Upload Documents
				</button> */}
			</div>
		</div>
	);
}

export default CompleteProfileCard;

