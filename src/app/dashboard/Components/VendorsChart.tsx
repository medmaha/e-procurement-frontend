"use client";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Intrasoft",
    uv: 2500,
    pv: 3000,
    amt: 2400,
  },

  {
    name: "IntraSoft ICT",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "APS",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Netpage",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "DK",
    uv: 1000,
    pv: 2000,
    amt: 2500,
  },
  {
    name: "IIHT",
    uv: 3000,
    pv: 4300,
    amt: 1500,
  },
  {
    name: "LEM",
    uv: 2800,
    pv: 4000,
    amt: 2800,
  },
];

export default function VendorsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        {/* <CartesianGrid stroke="#f5f5f5" /> */}
        {/* <XAxis dataKey="name" scale="band" /> */}
        {/* <YAxis /> */}
        <Tooltip content={<RenderTooltip />} />
        <Legend />
        <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
        <Bar dataKey="pv" barSize={20} fill="#413ea0" />
        <Line type="monotone" dataKey="uv" stroke="#ff7300" />
        <Scatter dataKey="cnt" fill="red" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

const RenderTooltip = ({ active, payload, label }: any) => {
  const _data = data[Number(label)];
  if (active && payload && payload.length) {
    return (
      <div className="bg-card shadow text-card-foreground p-2 rounded-md border">
        <p className="label text-sm text-blue-500 font-semibold">
          {_data.name}
        </p>
        <div className="space-y-0.5">
          <p className="text-sm pb-1 border-b">{"Technology"}</p>
          <p className="text-xs">Sales: {_data.uv}</p>
          <p className="text-xs">Quotes: {_data.pv}</p>
          <p className="text-xs">Invoices: {_data.amt}</p>
        </div>
      </div>
    );
  }
  return null;
};
