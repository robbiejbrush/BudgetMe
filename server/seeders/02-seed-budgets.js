const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
        console.log('--- Cleaning Budgets table ---');
        await queryInterface.bulkDelete('Budgets', null, {});

        const [categories] = await queryInterface.sequelize.query(
        `SELECT categoryId from Categories;`
        );
        
        const categoryIds = categories.map(c => c.categoryId);
        const selectedCategoryIds = faker.helpers.shuffle(categoryIds).slice(0, 10);

        const budgets = selectedCategoryIds.map (categoryId => ({
            monthlyLimit: faker.number.float( {min: 50, max: 5000, fractionDigits: 2} ),
            categoryId: categoryId,
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        console.log('--- Seeding Budgets ---');
        await queryInterface.bulkInsert('Budgets', budgets);
        console.log('--- SUCESS: Budgets Seeded!');
    } catch (error) {
        console.error('--- ERROR IN BUDGETS SEEDER ---');
        console.error('Message:', error.message);
        
        if (error.original) {
            console.error('SQL Details:', error.original.sqlMessage);
        }

        throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Budgets', null, {});
  }
};