const express = require('express');
const router = express.Router();
const { Budgets } = require('../models');

// Get all budgets by userId
router.get("/:userId", async (req, res) => {
    try {
        const budgets = await Budgets.findAll({
            where: { userId: req.params.userId }
        });
        res.json(budgets);
    } catch (error) {
        console.error("Error getting budgets: ", error);
        res.status(500).json({ error: "Failed to get budgets." });
    }
});

//Creates budget
router.post("/create", async (req, res) => {
    const budgetData = req.body;
    
    try {
        const newBudget = await Budgets.create({
            ...budgetData
    });
        res.json(newBudget);

    } catch (error) {
        console.error("Error creating budget: ", error);
        res.status(500).json({ error: "Failed to create budget." });
    }
});

//Edits a budget
router.put("/edit/:budgetId", async (req, res) => {
  const budgetId = req.params.budgetId;
  const { monthlyLimit, categoryId } = req.body;

  try {
    const [rowsUpdated] = await Budgets.update(
      { 
        monthlyLimit: monthlyLimit,
        categoryId: categoryId 
      }, 
      { where: { budgetId: budgetId } }
    );

    if (rowsUpdated > 0) {
      res.status(200).json({ message: "Budget updated successfully" });
    } else {
      res.status(404).json({ message: "Budget not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating budget", details: error.message });
  }
});

//Deletes budget
router.delete("/:budgetId", async (req, res) => {
  const budgetId = req.params.budgetId;

  try {
    const result = await Budgets.destroy({
      where: { budgetId: budgetId }
    });

    if (result) {
      res.status(200).json({ message: "Budget deleted successfully" });
    } else {
      res.status(404).json({ message: "Budget not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Error deleting budget", details: error.message});
  }
});

module.exports = router;