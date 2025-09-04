const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense Source
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    //Validation: Check for missing fields
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Expense Source
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense Source
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    if (!expenses || expenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No expense data found to download." });
    }

    // Prepare data for the worksheet, ensuring correct date formatting
    const dataForSheet = expenses.map((expense) => ({
      Category: expense.category,
      Amount: expense.amount,
      Date: new Date(expense.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

    // Create a new workbook and add the worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(dataForSheet);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Expenses");

    // Write the workbook to a buffer in memory
    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set the headers to prompt a download on the client-side
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense_details.xlsx"
    );

    // Send the buffer as the response
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error generating expense Excel file:", error);
    res
      .status(500)
      .json({ message: "Server error while creating Excel file." });
  }
};
