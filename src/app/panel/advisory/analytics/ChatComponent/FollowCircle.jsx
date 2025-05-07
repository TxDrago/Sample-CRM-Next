"use client";

//react
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import PropTypes from "prop-types";

const FollowCircle = ({ followUpGrowthPercentage, color }) => {
  // Data for the pie chart using the direct followUpGrowthPercentage prop
  const data = [
    {
      name: "Growth",
      value:
        followUpGrowthPercentage >= 0
          ? Math.min(followUpGrowthPercentage, 100)
          : Math.abs(followUpGrowthPercentage),
    },
    {
      name: "Remaining",
      value: Math.max(0, 100 - Math.abs(followUpGrowthPercentage)),
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
FollowCircle.propTypes = {
  followUpGrowthPercentage: PropTypes.number.isRequired,
  color: PropTypes.oneOf(["green", "red"]).isRequired,
};

export default FollowCircle;
