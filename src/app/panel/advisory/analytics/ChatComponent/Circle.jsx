"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";
import PropTypes from "prop-types";

const Circle = ({ growthPercentage, color }) => {
  // Data for the pie chart using the direct growthPercentage prop
  const data = [
    {
      name: "Growth",
      value:
        growthPercentage >= 0
          ? Math.min(growthPercentage, 100)
          : Math.abs(growthPercentage),
    },
    { name: "Remaining", value: Math.max(0, 100 - Math.abs(growthPercentage)) },
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
Circle.propTypes = {
  growthPercentage: PropTypes.number.isRequired,
  color: PropTypes.oneOf(["green", "red"]).isRequired,
};

export default Circle;
