const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
        console.log('--- Cleaning Recurring Transactions table ---');
        await queryInterface.bulkDelete('RecurringTransactions', null, {});

        const [categories] = await queryInterface.sequelize.query(
        `SELECT categoryId, type from Categories;`
        );

        const recurringTransactions = Array.from({ length: 15 }, () => {
            const category = faker.helpers.arrayElement(categories);

            const endDateFrom = new Date();
            endDateFrom.setDate(endDateFrom.getDate() + 30);

            const endDateTo = new Date();
            endDateTo.setMonth(endDateTo.getMonth() + 6);

            return{
                type: category.type,
                amount: faker.number.float( {min: 50, max: 5000, fractionDigits: 2} ),
                counterparty: faker.company.name(),
                frequency: faker.helpers.arrayElement(['weekly', 'biweekly', 'monthly']),
                startDate: faker.date.soon({ days: 30 }),
                endDate: faker.helpers.arrayElement([null, faker.date.between({ from: endDateFrom, to: endDateTo })]),
                categoryId: category.categoryId,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        console.log('--- Seeding Recurring Transactions ---');
        await queryInterface.bulkInsert('RecurringTransactions', recurringTransactions);
        console.log('SUCCESS: Recurring Transactions seeded!');
    } catch (error) {
        console.error('--- ERROR IN RECURRING TRANSACTIONS SEEDER ---');
        console.error('Message:', error.message);
        
        if (error.original) {
            console.error('SQL Details:', error.original.sqlMessage);
        }
        
        throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RecurringTransactions', null, {});
  }
};