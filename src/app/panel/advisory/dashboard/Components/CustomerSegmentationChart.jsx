import { PieChart, Pie, Cell } from "recharts";
import PropTypes from "prop-types";

const CustomerSegmentationChart = ({
  totalBrokerage,
  businessType,
  targetAchieved,
}) => {
  const achievedPercentage = Math.min(
    (targetAchieved / totalBrokerage) * 100,
    100,
  );
  const remainingPercentage = 100 - achievedPercentage;

  const Percentage = ((targetAchieved * 100) / totalBrokerage).toFixed(2);

  const data = [
    {
      name: "Small Business",
      value: 1650,
      color: "#2563eb",
      change: 424,
      increase: true,
    },
    {
      name: "Enterprise",
      value: 350,
      color: "#fdba74",
      change: 24,
      increase: true,
    },
    {
      name: "Company",
      value: 350,
      color: "#ef4444",
      change: 24,
      increase: false,
    },
  ];

  const data1 = [
    {
      name: "Target Achieved",
      value: achievedPercentage,
      color: "green",
    },
    {
      name: "Remaining Target",
      value: remainingPercentage,
      color: "#ef4444",
    },
  ];

  const activeData = businessType === "Brokerage" ? data1 : data;

  return (
    <div className="relative flex flex-col items-center">
      <PieChart width={160} height={160}>
        <Pie
          data={activeData}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          startAngle={360}
          endAngle={0}
          stroke="none"
          isAnimationActive={true}
        >
          {activeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>

      <div className="absolute bottom-8 top-14 text-center text-sm">
        <p>Target Achieved</p>
        <p className="text-lg font-normal">{Percentage} %</p>
      </div>
    </div>
  );
};

CustomerSegmentationChart.propTypes = {
  totalBrokerage: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  businessType: PropTypes.string.isRequired,
  targetAchieved: PropTypes.number.isRequired,
};

export default CustomerSegmentationChart;
