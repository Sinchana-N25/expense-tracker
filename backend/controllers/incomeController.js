const xlsx = require("xlsx");
const Income = require("../models/Income");

// Add Income Source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    //Validation: Check for missing fields
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Income Source
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income Source
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Excel
exports.downloadIncomeExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    if (!incomes || incomes.length === 0) {
      return res
        .status(404)
        .json({ message: "No income data found to download." });
    }

    // Prepare data for the worksheet, ensuring correct date formatting
    const dataForSheet = incomes.map((income) => ({
      Source: income.source,
      Amount: income.amount,
      Date: new Date(income.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

    // Create a new workbook and add the worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(dataForSheet);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Income");

    // Write the workbook to a buffer in memory
    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set the headers to prompt a download on the client-side
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx"
    );

    // Send the buffer as the response
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error generating income Excel file:", error);
    res
      .status(500)
      .json({ message: "Server error while creating Excel file." });
  }
};
