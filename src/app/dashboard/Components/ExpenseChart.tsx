"use client";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { formatNumberAsCurrency } from '@/lib/helpers';


const data = [
	{
		month: "Jan",
		spent: 0,
		budget: 0,
	},
	{
		month: "Feb",
		spent: 185_000,
		budget: 200_000,
	},
	{
		month: "Mar",
		spent: 100_000,
		budget: 210_000,
	},
	{
		month: "Apr",
		spent: 225_000,
		budget: 250_000,
	},
	{
		month: "May",
		spent: 105_000,
		budget: 250_000,
	},
	{
		month: "Jun",
		spent: 75_000,
		budget: 150_000,
	},
	{
		month: "Jul",
		spent: 200_000,
		budget: 250_000,
	},
	{
		month: "Aug",
		spent: 220_000,
		budget: 225_000,
	},
	{
		month: "Sep",
		spent: 250_000,
		budget: 250_000,
	},
	{
		month: "Oct",
		spent: 250_000,
		budget: 220_000,
	},
	{
		month: "Nov",
		spent: 250_000,
		budget: 150_000,
	},
	{
		month: "Dec",
		spent: 60_000,
		budget: 250_000,
	},
];
export default function ExpenseChart() {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart width={400} height={400} data={data} dataKey={"month"}>
				<Line type="monotone" dataKey="spent" stroke="red" strokeWidth={3} />
				<Line
					type="monotone"
					dataKey="budget"
					stroke="#2388e7"
					strokeWidth={3}
				/>
				<XAxis dataKey="month" />
				<Tooltip content={<RenderTooltip />} />
				{/* <Legend /> */}
			</LineChart>
		</ResponsiveContainer>
	);
}

const RenderTooltip = ({ active, payload, label }: any) => {
	const _data = data.find((d) => d.month === label)!;
	if (active && payload && payload.length) {
		return (
			<div className="bg-card shadow text-card-foreground p-2 rounded-md border">
				<p className="label text-sm text-blue-500 font-semibold">
					{_data.month}
				</p>
				<div className="space-y-0.5 py-1">
					<p className="text-xs">
						Budget:{" "}
						<span className="font-semibold pl-1">
							D{formatNumberAsCurrency(Number(_data.budget))}
						</span>
					</p>
					<p className="text-xs">
						Expense:{" "}
						<span className="font-semibold pl-1">
							D{formatNumberAsCurrency(Number(_data.spent))}
						</span>
					</p>
				</div>
			</div>
		);
	}
	return null;
};
