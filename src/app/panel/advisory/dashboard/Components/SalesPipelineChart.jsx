import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Example data
const data = [
  { month: "Jan", prospecting: 200, proposal: 300, negotiation: 100 },
  { month: "Feb", prospecting: 250, proposal: 200, negotiation: 150 },
  { month: "Mar", prospecting: 150, proposal: 400, negotiation: 200 },
  { month: "Apr", prospecting: 280, proposal: 250, negotiation: 180 },
  { month: "May", prospecting: 180, proposal: 300, negotiation: 220 },
  { month: "Jun", prospecting: 320, proposal: 240, negotiation: 270 },
  { month: "Jul", prospecting: 200, proposal: 150, negotiation: 120 },
];

const SalesPipelineChart = () => {
  const [text, setText] = useState({
    filter: "",
  });
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [filterDropdownText, setFilterDropdownText] = useState("6 Months");

  // TOGGLE FILTER DATE DROPDOWN
  const toggleFilterDropdown = () => {
    setFilterDropdown(!filterDropdown);
  };

  const handleFilterDropdown = (name) => {
    setFilterDropdownText(name);
    setFilterDropdown(!filterDropdown);
    setText((prev) => ({
      ...prev,
      [name]: name,
    }));
  };

  const filterData = [
    { id: 1, name: "3 months" },
    { id: 1, name: "6 months" },
    { id: 1, name: "1 years" },
  ];

  return (
    <div className="mx-auto w-full sm:max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-left text-lg font-normal">Sales Pipeline</h2>
        <div className="grid grid-cols-2 items-center sm:flex sm:gap-2">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-[#8884d8]"></div>
            <span>Prospecting</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-[#82ca9d]"></div>
            <span>Proposal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
            <span>Negotiation</span>
          </div>
          {/* ------------- FILTER DROPDOWN */}
          <div
            className="relative"
            onClick={toggleFilterDropdown}
            onMouseLeave={() => setFilterDropdown(false)}
          >
            <button
              className="flex w-28 items-center justify-between truncate rounded-md border px-2 py-2 text-sm"
              id="filter"
              type="button"
            >
              {filterDropdownText}
              <FaAngleDown className="ml-2 text-gray-900" />
            </button>
            {filterDropdown && (
              <div className="absolute top-10 z-10 rounded-md border border-gray-300 bg-white">
                <ul className="py-2 text-sm text-gray-700">
                  {filterData.map(({ id, name }) => (
                    <li
                      key={id}
                      className="block w-56 cursor-pointer border-b px-4 py-2 hover:bg-cyan-500 hover:text-white"
                      onClick={() => handleFilterDropdown(name)}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* -------------- END FILTER DROPDOWN ------------ */}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Bars for different stages */}
          <Bar dataKey="prospecting" fill="#8884d8" barSize={20} />
          <Bar dataKey="proposal" fill="#82ca9d" barSize={20} />
          <Bar dataKey="negotiation" fill="#2196F3" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPipelineChart;
