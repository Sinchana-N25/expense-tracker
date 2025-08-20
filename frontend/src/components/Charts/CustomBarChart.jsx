import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {
  // Alternate bar colors
  const getBarColor = (index) => (index % 2 === 0 ? "#0059BF" : "#558dc9");

  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Access the data for the specific bar being hovered over
      const barData = payload[0]?.payload;

      if (!barData) return null;

      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          {/* Display the correct category and amount from the unique data point */}
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {barData.category || "No Category"}
          </p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="text-sm font-medium text-gray-900">
              ₹{barData.amount || 0}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />

          {/* This is the only change: use the unique xKey for the X-axis */}
          <XAxis
            dataKey="xKey"
            tickFormatter={(xKey) => {
              // Only show the actual date
              return xKey.split("-").slice(0, -1).join("-"); // removes the index
            }}
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />

          <Tooltip content={CustomToolTip} />

          <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
