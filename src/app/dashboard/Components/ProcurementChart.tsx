"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';


const data1 = [
	{
		name: "Request For Quote",
		year: 2022,
		value: 130,
	},
	{
		name: "Direct Procurement",
		year: 2022,
		value: 600,
	},
	{
		name: "Local Tender",
		year: 2022,
		value: 80,
	},
	{
		name: "International Tender",
		year: 2022,
		value: 130,
	},
];
const data2 = [
	{
		name: "Request For Quote",
		year: 2023,
		value: 400,
	},
	{
		name: "Direct Procurement",
		year: 2023,
		value: 300,
	},
	{
		name: "Local Tender",
		year: 2023,
		value: 300,
	},
	{
		name: "International Tender",
		year: 2023,
		value: 450,
	},
];

const COLORS = ["#EEF5FF", "#B4D4FF", "#86B6F6", "#176B87"];

export default function ProcurementChart() {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<PieChart width={400} height={400}>
				<Pie
					data={data1}
					dataKey="value"
					cx="50%"
					cy="50%"
					name="2023"
					outerRadius={65}
					fill="#8884d8"
					label={renderLastYearLabel}
				>
					{data2.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>

				<Pie
					className="text-card-foreground"
					data={data2}
					dataKey="value"
					cx="50%"
					cy="50%"
					name="2024"
					innerRadius={70}
					outerRadius={90}
					fill="#82ca9d"
					label
				>
					{data2.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip content={<RenderTooltip />} />
			</PieChart>
		</ResponsiveContainer>
	);
}

const RADIAN = Math.PI / 180;

const renderLastYearLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
}: any) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			className="text-xs mt-1"
			x={x}
			y={y}
			fill={index > 2 ? "white" : "black"}
			// textAnchor={x > cx ? "start" : "end"}
			textAnchor={"start"}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

const RenderTooltip = (props: any) => {
	const payload = props.payload as undefined | typeof data1;

	const { active } = props;

	if (active && payload && payload.length) {
		const pData = payload.at(-1)!;
		const data = [...data1, ...data2].find(
			(d) => d.name === pData.name && d.value === pData.value
		)!;

		return (
			<div className="bg-card shadow text-card-foreground p-2 px-4 rounded-md border">
				<p className="label text-sm text-blue-500 font-semibold">
					{payload[0].name}
				</p>
				<div className="space-y-0.5 pt-2">
					<p className="text-xs">Val: {(data || pData).value}</p>
					<p className="text-xs">Year: {(data || pData).year}</p>
				</div>
			</div>
		);
	}
	return null;
};
