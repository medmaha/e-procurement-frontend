"use client";
import React from 'react';
import {
    Bar, BarChart, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';


const data = [
	{
		year: "2021",
		Accepted: 33,
		Rejected: 8,
		Invites: 50,
	},
	{
		year: "2022",
		Accepted: 55,
		Rejected: 10,
		Invites: 70,
	},
	{
		year: "2023",
		Accepted: 61,
		Rejected: 4,
		Invites: 65,
	},
];

export default function QuotesChart() {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart width={150} height={40} data={data} dataKey={"year"}>
				<Bar
					dataKey="Invites"
					fill="#2388e7"
					activeBar={<Rectangle fill="#2388e7" stroke="#fff" />}
				/>
				<Bar
					dataKey="Accepted"
					fill="#13ad13"
					activeBar={<Rectangle fill="#13ad13" stroke="#fff" />}
				/>
				<Bar
					dataKey="Rejected"
					fill="#e7ab3c"
					activeBar={<Rectangle fill="#e7ab3c" stroke="#fff" />}
				/>
				<XAxis dataKey="year" />
				<Tooltip />
				<Legend />
			</BarChart>
		</ResponsiveContainer>
	);
}
