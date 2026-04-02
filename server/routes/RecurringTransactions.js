const express = require('express');
const router = express.Router();
const { RecurringTransactions } = require('../models');

// Get all recurring transactions by userId
router.get("/:userId", async (req, res) => {
    try {
        const recurringTransactions = await RecurringTransactions.findAll({
            where: { userId: req.params.userId }
        });
        res.json(recurringTransactions);
    } catch (error) {
        console.error("Error getting recurring transactions: ", error);
        res.status(500).json({ error: "Failed to get recurring transactions." });
    }
});

//Creates recurring transaction
router.post("/create", async (req, res) => {
    const recurringTransactionData = req.body;
    
    try {
        const newRecurringTransaction = await RecurringTransactions.create({
            ...recurringTransactionData
    });
        res.json(newRecurringTransaction);

    } catch (error) {
        console.error("Error creating recurring transaction: ", error);
        res.status(500).json({ error: "Failed to create recurring transaction." });
    }
});

//Edits a recurring transaction
router.put("/edit/:recurringTransactionId", async (req, res) => {
  const recurringTransactionId = req.params.recurringTransactionId;
  const { type, amount, counterparty, frequency, startDate, endDate, categoryId } = req.body;

  try {
    const [rowsUpdated] = await RecurringTransactions.update(
      { 
        type: type, 
        amount: amount, 
        counterparty: counterparty,
        frequency: frequency,
        startDate: startDate,
        endDate: endDate,
        categoryId: categoryId 
      }, 
      { where: { recurringTransactionId: recurringTransactionId } }
    );

    if (rowsUpdated > 0) {
      res.status(200).json({ message: "Recurring Transaction updated successfully" });
    } else {
      res.status(404).json({ message: "Recurring Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating recurring transaction", details: error.message });
  }
});

//Deletes recurring transaction
router.delete("/:recurringTransactionId", async (req, res) => {
  const recurringTransactionId = req.params.recurringTransactionId;

  try {
    const result = await RecurringTransactions.destroy({
      where: { recurringTransactionId: recurringTransactionId }
    });

    if (result) {
      res.status(200).json({ message: "Recurring Transaction deleted successfully" });
    } else {
      res.status(404).json({ message: "Recurring Transaction not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Error deleting recurring transaction", details: error.message});
  }
});

module.exports = router;