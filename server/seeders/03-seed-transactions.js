const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
        console.log('--- Cleaning Transactions table ---');
        await queryInterface.bulkDelete('Transactions', null, {});

        const [categories] = await queryInterface.sequelize.query(
        `SELECT categoryId, type from Categories;`
        );

        const transactions = Array.from({ length: 100 }, () => {
            const category = faker.helpers.arrayElement(categories);

            return {
                type: category.type,
                amount: faker.number.float( {min: 50, max: 5000, fractionDigits: 2} ),
                counterparty: faker.company.name(),
                date: faker.date.past({ years: 2 }),
                categoryId: category.categoryId,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        console.log('--- Seeding Transactions ---');
        await queryInterface.bulkInsert('Transactions', transactions);
        console.log('--- SUCCESS: Transactions seeded!');
    } catch (error) {
        console.error('--- ERROR IN TRANSACTIONS SEEDER ---');
        console.error('Message:', error.message);

        if (error.original) {
            console.error('SQL Details:', error.original.sqlMessage);
        }
        
        throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transactions', null, {});
  }
};