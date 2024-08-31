"use client";
import React from 'react';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


const data = [
	{
		year: "2020",
		Sent: 0,
		Paid: 0,
		Declined: 0,
	},
	{
		year: "2021",
		Sent: 37,
		Paid: 3,
		Declined: 20,
	},
	{
		year: "2022",
		Sent: 70,
		Paid: 20,
		Declined: 35,
	},
	{
		year: "2023",
		Sent: 50,
		Paid: 50,
		Declined: 0,
	},
];
export default function InvoicesChart() {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart width={150} height={40} data={data} dataKey={"year"}>
				<Line type="monotone" dataKey="Sent" stroke="#898585" />
				<Line type="monotone" dataKey="Paid" stroke="#2388e7" />
				<Line type="monotone" dataKey="Declined" stroke="#ec3737" />
				<YAxis />
				<XAxis dataKey="year" />
				<Tooltip />
				<Legend />
			</LineChart>
		</ResponsiveContainer>
	);
}
