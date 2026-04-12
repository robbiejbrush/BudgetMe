const express = require('express');
const router = express.Router();
const { Transactions } = require('../models');

//Get all transactions by userId, ordered by most recent, with optional type and category filters
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { categoryId, type } = req.query;

        const filter = { userId };

        if (categoryId) filter.categoryId = categoryId;
        if (type) filter.type = type;

        const transactions = await Transactions.findAll({
            where: filter,
            order: [
              ['date', 'DESC'],
              ['createdAt', 'DESC']
            ]
        });
        res.json(transactions);
    } catch (error) {
        console.error("Error getting transactions: ", error);
        res.status(500).json({ error: "Failed to get transactions." });
    }
});

//Creates transaction
router.post("/create", async (req, res) => {
    const { transactions } = req.body;
    
    try {
        const newTransactions = await Transactions.bulkCreate(transactions);
        res.json(newTransactions);
    } catch (error) {
        console.error("Error creating transactions: ", error);
        res.status(500).json({ error: "Failed to create transactions." });
    }
});

//Edits a transaction
router.put("/edit/:transactionId", async (req, res) => {
  const transactionId = req.params.transactionId;
  const { type, amount, counterparty, date, categoryId } = req.body;

  try {
    const [rowsUpdated] = await Transactions.update(
      { 
        type: type, 
        amount: amount, 
        counterparty: counterparty,
        date: date,
        categoryId: categoryId 
      }, 
      { where: { transactionId: transactionId } }
    );

    if (rowsUpdated > 0) {
      res.status(200).json({ message: "Transaction updated successfully" });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating transaction", details: error.message });
  }
});

//Deletes transaction
router.delete("/:transactionId", async (req, res) => {
  const transactionId = req.params.transactionId;

  try {
    const result = await Transactions.destroy({
      where: { transactionId: transactionId }
    });

    if (result) {
      res.status(200).json({ message: "Transaction deleted successfully" });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Error deleting transaction", details: error.message});
  }
});

module.exports = router;