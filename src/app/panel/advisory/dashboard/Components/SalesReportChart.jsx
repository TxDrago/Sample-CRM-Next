import { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

const SalesReportChart = ({ businessType, totalBrokerage, targetAchieved }) => {
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    generateDynamicData();
  }, [totalBrokerage, targetAchieved]);

  const generateDynamicData = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();
    const weeksInMonth = Math.ceil(daysInMonth / 7);
    const brokeragePerWeek = totalBrokerage / daysInMonth;
    const totalTargetAchieved = targetAchieved / daysInMonth;
    let weeklyProgress = [];
    let weekCount = 1;
    let totalCount = 0;
    let total = 0;
    console.log("Today : ", currentDay);

    // Generate data for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      if (day % 7 === 0) {
        weeklyProgress.push({
          name: `Week ${weekCount}`,
          target: brokeragePerWeek * totalCount,
          targetAchieved:
            day <= currentDay ? totalTargetAchieved * total : null,
        });
        weekCount++;
        totalCount++;
      } else {
        weeklyProgress.push({
          name: null,
          target: brokeragePerWeek * totalCount,
          targetAchieved:
            day <= currentDay ? totalTargetAchieved * total : null,
        });
        totalCount++;
      }

      if (day <= currentDay) {
        total++;
      }
    }

    // Set the generated data to the state
    setWeeklyData(weeklyProgress);
  };

  // Data for Income/Expense (non-Brokerage)
  const incomeExpenseData = [
    { time: "01:00", income: 250, expenses: 93 },
    { time: "02:00", income: 200, expenses: 100 },
    { time: "03:00", income: 180, expenses: 110 },
    { time: "04:00", income: 250, expenses: 150 },
    { time: "05:00", income: 250, expenses: 150 },
  ];

  // Select data based on businessType
  const data = businessType === "Brokerage" ? weeklyData : incomeExpenseData;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex w-full items-center justify-between">
        <h2 className="mb-4 text-left text-xl font-normal">Sales Report</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#8884d8]"></div>
            <span>{businessType === "Brokerage" ? "Target" : "Income"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#82ca9d]"></div>
            <span>
              {businessType === "Brokerage" ? "Target Achieved" : "Expenses"}
            </span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fontSize: 6 }} tickLine={false} />{" "}
          {/* Show only weeks on X-axis */}
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {/* Area for Target or Income */}
          <Area
            type="monotone"
            dataKey={businessType === "Brokerage" ? "target" : "income"}
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorIncome)"
            strokeWidth={3}
            dot={{ stroke: "#8884d8", strokeWidth: 2, fill: "#8884d8" }}
            activeDot={{ r: 6 }}
          />
          {/* Area for Target Achieved or Expenses */}
          <Area
            type="monotone"
            dataKey={
              businessType === "Brokerage" ? "targetAchieved" : "expenses"
            }
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

SalesReportChart.propTypes = {
  businessType: PropTypes.string.isRequired,
  totalBrokerage: PropTypes.number.isRequired,
  targetAchieved: PropTypes.number.isRequired,
};

export default SalesReportChart;
