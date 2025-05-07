"use client";

//react

import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Group A", value: 50 },
  { name: "Group B", value: 50 },
];

const COLORS = ["#CFFAFE", "#06B6D4"];

const TeamCircle = () => {
  return (
    <PieChart width={80} height={80}>
      <Pie
        data={data}
        dataKey="value"
        startAngle={360}
        endAngle={0}
        innerRadius={25}
        outerRadius={38}
        fill="#8884d8"
        paddingAngle={0}
        stroke="none"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default TeamCircle;
