const express = require('express');
const router = express.Router();
const { Categories } = require('../models');
const { Op } = require("sequelize");

//Get all categories by userId and null userId (global categories)
router.get("/:userId", async (req, res) => {
    try {
        const categories = await Categories.findAll({
            where: {
                [Op.or]: [
                    { userId: req.params.userId },
                    { userId: null }
                ]
            },
            order: [
                ['name', 'ASC']
            ]
        });
        res.json(categories);
    } catch (error) {
        console.error("Error getting categories: ", error);
        res.status(500).json({ error: "Failed to get categories." });
    }
});

//Creates categories
router.post("/create", async (req, res) => {
    const categoryData = req.body;
    
    try {
        const newCategory = await Categories.create({
            ...categoryData
    });
        res.json(newCategory);

    } catch (error) {
        console.error("Error creating category: ", error);
        res.status(500).json({ error: "Failed to create category." });
    }
});

//Edits a category
router.put("/edit/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  const { name, type } = req.body;

  try {
    const [rowsUpdated] = await Categories.update(
      { 
        name: name,
        type: type
      }, 
      { where: { categoryId: categoryId } }
    );

    if (rowsUpdated > 0) {
      res.status(200).json({ message: "Category updated successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating category", details: error.message });
  }
});

//Deletes category
router.delete("/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const result = await Categories.destroy({
      where: { categoryId: categoryId }
    });

    if (result) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Error deleting category", details: error.message});
  }
});

module.exports = router;