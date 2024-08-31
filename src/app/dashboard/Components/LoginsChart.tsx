"use client";
import {
    PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip
} from 'recharts';


const data = [
	{
		month: "Jan",
		A: 120,
		B: 110,
		fullMark: 150,
	},
	{
		month: "Feb",
		A: 98,
		B: 130,
		fullMark: 150,
	},
	{
		month: "Mar",
		A: 86,
		B: 130,
		fullMark: 150,
	},
	{
		month: "Apr",
		A: 99,
		B: 100,
		fullMark: 150,
	},
	{
		month: "May",
		A: 85,
		B: 90,
		fullMark: 150,
	},
	{
		month: "Jun",
		A: 65,
		B: 85,
		fullMark: 150,
	},
	{
		month: "Jul",
		A: 35,
		B: 85,
		fullMark: 150,
	},
	{
		month: "Aug",
		A: 80,
		B: 85,
		fullMark: 150,
	},
	{
		month: "Sep",
		A: 75,
		B: 85,
		fullMark: 150,
	},
	{
		month: "Oct",
		A: 20,
		B: 85,
		fullMark: 150,
	},
	{
		month: "Nov",
		A: 50,
		B: 85,
		fullMark: 150,
	},
	{
		month: "Dec",
		A: 100,
		B: 85,
		fullMark: 150,
	},
];

export default function LoginsChart() {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
				<PolarGrid />
				<PolarAngleAxis dataKey="month" />
				{/* <PolarRadiusAxis /> */}
				<Radar
					name="Active Users"
					dataKey="A"
					stroke="#8884d8"
					fill="#8884d8"
					fillOpacity={0.6}
				/>

				<Tooltip content={<RenderTooltip />} />
			</RadarChart>
		</ResponsiveContainer>
	);
}

const RenderTooltip = ({ active, payload, label }: any) => {
	const _data = data.find((d) => d.month === label)!;
	if (active && payload && payload.length) {
		return (
			<div className="bg-card shadow text-card-foreground p-2 px-4 rounded-md border">
				<p className="label text-sm text-blue-500 font-semibold">{label}</p>
				<div className="space-y-0.5">
					<p className="text-sm pb-1 border-b text-center">{"Active Users"}</p>
					<p className="text-xs">Staffs: {_data.A}</p>
					<p className="text-xs">Vendors: {_data.B}</p>
					<p className="text-xs">Total: {_data.fullMark}</p>
				</div>
			</div>
		);
		// return label;
	}
	return null;
};
