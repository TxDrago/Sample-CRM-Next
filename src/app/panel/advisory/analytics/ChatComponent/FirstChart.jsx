"use client";

import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";

const data = [
  { name: "Khusi Rana", salesRevenue: 293380, salesVolume: 80000 },
  { name: "Rajat", salesRevenue: 120000, salesVolume: 60000 },
  { name: "Suyash", salesRevenue: 150000, salesVolume: 30000 },
  { name: "Rajesh", salesRevenue: 120000, salesVolume: 40000 },
  { name: "Suyash", salesRevenue: 180000, salesVolume: 50000 },
];

const SalesChart = ({ text }) => {
  return (
    <div className="px-2 py-4 bg-white rounded-md shadow-lg">
      <h1 className="mb-1 text-xl font-medium">{text}</h1>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorSalesRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="salesVolume" fill="#00C49F" radius={[10, 10, 10, 10]} />
          <Area
            type="monotone"
            dataKey="salesRevenue"
            stroke="#8884d8"
            fill="url(#colorSalesRevenue)"
            fillOpacity={1}
            name="Sales Revenue"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
