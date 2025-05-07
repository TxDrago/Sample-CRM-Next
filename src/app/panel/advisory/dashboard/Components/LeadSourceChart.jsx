import { FaRupeeSign } from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Revenue", value: 45456 },
  { name: "Sales", value: 8550 },
  { name: "Views", value: 28550 },
];

const LeadSourceChart = () => {
  return (
    <>
      <div style={{ width: "100%", height: 300 }}>
        <h3 className="mb-1 text-xl font-thin">Lead Source</h3>
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-md bg-cyan-400"></div>
              <span className="text-md">Total Revenue</span>
            </div>
            <p className="jusitify-center my-1 flex items-center text-xs">
              <FaRupeeSign />
              45,456.00 Rs
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-md bg-cyan-400"></div>
              <span className="text-sm">Total Sales</span>
            </div>
            <p className="jusitify-center my-1 flex items-center text-xs">
              <FaRupeeSign />
              45,456.00 Rs
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-md bg-cyan-400"></div>
              <span className="text-sm">Total Views</span>
            </div>
            <p className="jusitify-center my-1 flex items-center text-xs">
              <FaRupeeSign />
              45,456.00 Rs
            </p>
          </div>
        </div>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fillOpacity={0.3}
              fill="rgba(136, 132, 216, 0.5)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default LeadSourceChart;
