"use client";

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

const data = [
  { name: "Conversation", value: 500 },
  { name: "FollowUp", value: 300 },
  { name: "Inpipeline", value: 500 },
];

const BottomChart = ({ text, color }) => {
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
    <div className="w-full px-4 py-6 bg-white rounded shadow-lg h-72">
      <div className="mt-[-.8rem] flex items-center justify-between">
        <h2 className="mb-[2px] text-lg font-semibold">{text}</h2>
        {/* ------------ FILTER DROPDOWN START -------------- */}
        <div
          className="relative"
          onClick={toggleFilterDropdown}
          onMouseLeave={() => setFilterDropdown(false)}
        >
          <button
            className="flex items-center justify-between px-4 py-2 truncate border rounded-md "
            id="filter"
            type="button"
          >
            {filterDropdownText}
            <FaAngleDown className="ml-2 text-gray-900" />
          </button>
          {filterDropdown && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded-md top-10">
              <ul className="py-2 text-sm text-gray-700">
                {filterData.map(({ id, name }) => (
                  <li
                    key={id}
                    className="block px-4 py-2 border-b cursor-pointer hover:bg-cyan-500 hover:text-white"
                    onClick={() => handleFilterDropdown(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* ------------ FILTER DROPDOWN END -------------- */}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 45, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
      </div>


  );
};

export default BottomChart;
