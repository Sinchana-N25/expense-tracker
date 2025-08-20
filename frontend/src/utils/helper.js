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
  return data.map((item, index) => {
    const dateObj = new Date(item.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });

    // Create a unique key but keep the display value as the full date
    const displayDate = `${day} ${month}`; // e.g., "20 Aug"

    return {
      xKey: `${displayDate}-${index}`, // unique key internally
      displayDate, // for X-axis label
      day,
      month,
      category: item.category,
      amount: item.amount,
    };
  });
};

export const prepareIncomeBarChartData = (data = []) => {
  return data.map((item, index) => {
    const dateObj = new Date(item.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const displayDate = `${day} ${month}`;

    return {
      xKey: `${displayDate}-${index}`, // unique key internally
      displayDate, // for X-axis label
      day,
      month,
      category: item.source || "No Source", // <-- use 'source' for income
      amount: item.amount,
    };
  });
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return sortedData.map((item, index) => ({
    _uniqueKey: `${item.date}-${index}`, // unique for Recharts
    displayMonth: moment(item.date).format("Do MMM"), // for X-axis
    category: item.category,
    amount: item.amount,
  }));
};
