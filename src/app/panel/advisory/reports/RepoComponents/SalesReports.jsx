"use client";

//react
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Example data
const data = [
  { time: "00:00", income: 80, expenses: 60 },
  { time: "01:00", income: 105, expenses: 93 },
  { time: "02:00", income: 95, expenses: 70 },
  { time: "03:00", income: 110, expenses: 80 },
  { time: "04:00", income: 125, expenses: 115 },
  { time: "05:00", income: 130, expenses: 120 },
  { time: "06:00", income: 145, expenses: 125 },
  { time: "07:00", income: 140, expenses: 130 },
];

const SalesReportChart = () => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex w-full items-center justify-between">
        <h2 className="mb-4 text-left text-xl font-thin">Sales Report</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#8884d8]"></div>
            <span>Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#82ca9d]"></div>
            <span>Expenses</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Gradient for Incomes */}
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            {/* Gradient for Expenses */}
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="time" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />

          {/* Area for Incomes */}
          <Area
            type="monotone"
            dataKey="income"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorIncome)"
            strokeWidth={3}
            dot={{ stroke: "#8884d8", strokeWidth: 2, fill: "#8884d8" }}
            activeDot={{ r: 6 }}
          />

          {/* Area for Expenses */}
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorExpenses)"
            strokeWidth={3}
            dot={{ stroke: "#82ca9d", strokeWidth: 2, fill: "#82ca9d" }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesReportChart;
