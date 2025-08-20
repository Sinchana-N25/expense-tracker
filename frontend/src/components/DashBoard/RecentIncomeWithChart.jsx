import React, { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";
const COLORS = ["#2e3bab", "#b32d8c", "#e35461", "#e59249"];

const RecentIncomeWithChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [last60DaysTotal, setLast60DaysTotal] = useState(0);

  useEffect(() => {
    const preparedData =
      data?.map((item) => ({
        name: item?.source,
        amount: item?.amount,
      })) || [];

    setChartData(preparedData);

    const total = preparedData.reduce((sum, item) => sum + item.amount, 0);
    setLast60DaysTotal(total);
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Last 60 Days"
        totalAmount={`₹${last60DaysTotal}`} // center now shows sum of last 60 days
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
