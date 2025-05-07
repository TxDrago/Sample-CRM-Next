"use client";

//react
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import PropTypes from "prop-types";

const SalesCircle = ({ todaysGrowthPercentage, color }) => {
  // Data for the pie chart using the direct todaysGrowthPercentage prop
  const data = [
    {
      name: "Growth",
      value:
        todaysGrowthPercentage >= 0
          ? Math.min(todaysGrowthPercentage, 100)
          : Math.abs(todaysGrowthPercentage),
    },
    {
      name: "Remaining",
      value: Math.max(0, 100 - Math.abs(todaysGrowthPercentage)),
    },
  ];

  const COLORS = color === "green" ? ["green", "#EBF8FF"] : ["red", "#FFCCCC"];

  return (
    <PieChart width={80} height={80}>
      <Pie
        data={data}
        dataKey="value"
        startAngle={360}
        endAngle={0}
        innerRadius={25}
        outerRadius={38}
        stroke="none"
        isAnimationActive={true} // Enable animation
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value, name) => `${name}: ${value}%`} />{" "}
      {/* Optional Tooltip */}
    </PieChart>
  );
};

// Prop validation
SalesCircle.propTypes = {
  todaysGrowthPercentage: PropTypes.number.isRequired,
  color: PropTypes.oneOf(["green", "red"]).isRequired,
};

export default SalesCircle;
