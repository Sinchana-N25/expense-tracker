import React, { useEffect, useState } from "react";
import { prepareExpenseBarChartData } from "../../utils/helper";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const Last30DaysExpenses = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const result = prepareExpenseBarChartData(data);
    setChartData(result);

    // Calculate total expense
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    setTotalExpense(total);

    return () => {};
  }, [data]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
        <span className="text-[13px] font-semibold bg-red-50 text-red-500 px-3 py-1 rounded-md">
          ₹{totalExpense}
        </span>
      </div>

      <CustomBarChart data={chartData} />
    </div>
  );
};

export default Last30DaysExpenses;
