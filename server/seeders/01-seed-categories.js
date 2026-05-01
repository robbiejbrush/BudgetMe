const { faker } = require('@faker-js/faker');

const categoryList = [
  // Income Categories
  { name: "Salary & Wages", type: "income" },
  { name: "Investment Income", type: "income" },
  { name: "Gifts", type: "income" },
  { name: "Interest & Fees", type: "income" },
  { name: "Other (Income)", type: "income"},

  // Expense Categories
  { name: "Housing & Rent", type: "expense" },
  { name: "Groceries", type: "expense" },
  { name: "Utilities", type: "expense" },
  { name: "Subscriptions & SaaS", type: "expense" },
  { name: "Education & Tuition", type: "expense" },
  { name: "Transportation", type: "expense" },
  { name: "Dining & Restaurants", type: "expense" },
  { name: "Insurance", type: "expense" },
  { name: "Medical & Healthcare", type: "expense" },
  { name: "Entertainment", type: "expense" },
  { name: "Travel & Lodging", type: "expense" },
  { name: "Office Supplies", type: "expense" },
  { name: "Maintenance & Repairs", type: "expense" },
  { name: "Taxes", type: "expense" },
  { name: "Shopping & Retail", type: "expense" },
  { name: "Charity & Donations", type: "expense" },
  { name: "Other (Expense)", type: "expense" },
];

module.exports = {
  async up(queryInterface) {
    try {
        console.log('--- Cleaning Categories Table ---');
        await queryInterface.bulkDelete('categories', null, {});

        const categories = categoryList.map(cat => ({
        ...cat,
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date()
        }));

        console.log('--- Seeding Categories ---');
        await queryInterface.bulkInsert('categories', categories);
        console.log('--- SUCCESS: Categories Seeded! ---');
    } catch (error) {
        console.error('--- ERROR IN CATEGORIES SEEDER ---');
        console.error('Message:', error.message);
        
        if (error.original) {
            console.error('SQL Details:', error.original.sqlMessage);
        }
        
        throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};