import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^s@]+$/;
  return regex.test(email);
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  return data.map((item) => {
    const dateObj = new Date(item.date); // parse ISO date
    const month = dateObj.toLocaleString("default", { month: "short" }); // e.g., "Aug"
    return {
      month, // X-axis key expected by CustomBarChart
      category: item.category, // Tooltip
      amount: item.amount, // Bar height
    };
  });
};
export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    source: item?.source,
    amount: item?.amount,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    category: item?.category,
    amount: item?.amount,
  }));

  return chartData;
};
