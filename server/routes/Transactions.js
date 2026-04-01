const express = require('express');
const router = express.Router();

//Gets all transactions for a userId
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const userWithTransactions = await Users.findByPk(userId, {
            include: [{
                model: Transactions,
                through: { attributes: [] }
            }]
        });

        res.json(userWithTransactions ? userWithTransactions.Transactions : []);
    } catch (error) {
        console.error("Error getting transactions: ", error);
        res.status(500).json({ error: "Failed to get transactions." });
    }
});

//Creates transaction
router.post("/create", async (req, res) => {
    const transactionData = req.body;
    
    try {
        const newTransaction = await Transaction.create({
            ...transactionData
    });
        res.json(newTransaction);

    } catch (error) {
        console.error("Error creating transaction: ", error);
        res.status(500).json({ error: "Failed to create transaction." });
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
  } catch (err) {
    res.status(500).json({ error: "Error updating transaction", details: err });
  }
});

//Deletes transaction
router.delete("/:transactionId", async (req, res) => {
  const transactionId = req.params.taskId;

  try {
    const result = await Transaction.destroy({
      where: { transactionId: transactionId }
    });

    if (result) {
      res.status(200).json({ message: "Transaction deleted successfully" });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Error deleting transaction", details: err});
  }
});

module.exports = router;