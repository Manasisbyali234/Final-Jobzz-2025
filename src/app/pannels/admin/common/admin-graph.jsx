
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboardActivityChart() {
	// Bar chart data
	const barData = {
		labels: ["January", "February", "March", "April", "May", "June"],
		datasets: [
			{
				label: "Applications",
				data: [120, 190, 300, 250, 320, 400],
				backgroundColor: "rgba(78, 115, 223, 0.7)",
				borderColor: "#4e73df",
				borderWidth: 2,
			},
			{
				label: "Active Employers",
				data: [10, 18, 22, 19, 25, 30],
				backgroundColor: "rgba(28, 200, 138, 0.7)",
				borderColor: "#1cc88a",
				borderWidth: 2,
			},
		],
	};

	// Pie chart data
	const pieData = {
		labels: ["Company A", "Company B", "Company C", "Company D", "Company E"],
		datasets: [
			{
				data: [45, 25, 15, 10, 5],
				backgroundColor: [
					"#4e73df",
					"#1cc88a",
					"#36b9cc",
					"#f6c23e",
					"#e74a3b",
				],
				borderColor: "#fff",
				borderWidth: 2,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				labels: {
					color: "#333",
					font: { size: 14, weight: "bold" },
				},
			},
		},
	};

	return (
		<div
			className="row"
			style={{
				display: "flex",
				flexWrap: "nowrap",
				gap: "30px",
			}}
		>
			{/* Bar Chart */}
			<div className="col-md-6" style={{ flex: 1 }}>
				<div className="panel panel-default site-bg-white">
					<div className="panel-heading wt-panel-heading p-a25">
						<h4 className="panel-tittle m-a0">
							<i className="far fa-chart-bar" /> Application Trends
						</h4>
					</div>

					<div className="panel-body wt-panel-body" style={{ height: "350px" }}>
						<Bar data={barData} options={chartOptions} />
					</div>
				</div>
			</div>

			{/* Pie Chart */}
			<div className="col-md-6" style={{ flex: 1 }}>
				<div className="panel panel-default site-bg-white">
					<div className="panel-heading wt-panel-heading p-a25">
						<h4 className="panel-tittle m-a0">
							<i className="fas fa-chart-pie" /> Most Active Employers
						</h4>
					</div>
					
					<div className="panel-body wt-panel-body" style={{ height: "350px" }}>
						<Pie data={pieData} options={chartOptions} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboardActivityChart;


