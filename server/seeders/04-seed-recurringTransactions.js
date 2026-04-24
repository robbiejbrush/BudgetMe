const { faker } = require('@faker-js/faker');
const { addWeeks, addMonths, isToday, parseISO } = require('date-fns');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
        console.log('--- Cleaning Recurring Transactions table ---');
        await queryInterface.bulkDelete('RecurringTransactions', null, {});

        const [categories] = await queryInterface.sequelize.query(
            `SELECT categoryId, type 
            FROM Categories 
            WHERE type = 'expense' 
            AND name != 'Other (Expense)';`
        );

        const recurringTransactions = Array.from({ length: 3 }, () => {
            const category = faker.helpers.arrayElement(categories);

            const endDateFrom = new Date();
            endDateFrom.setDate(endDateFrom.getDate() + 30);

            const endDateTo = new Date();
            endDateTo.setMonth(endDateTo.getMonth() + 6);

            const startDate = faker.date.soon({ days: 30 });
            let nextChargeDate = null;
            const frequency = faker.helpers.arrayElement(['weekly', 'biweekly', 'monthly']);

            if (isToday(startDate)) {
                if (frequency === 'weekly') {
                    nextChargeDate = addWeeks(startDate, 1);
                } else if (frequency === 'biweekly') {
                    nextChargeDate = addWeeks(startDate, 2);
                } else if (frequency === 'monthly') {
                    nextChargeDate = addMonths(startDate, 1);
                }
            } else {
                nextChargeDate = startDate;
            }

            return{
                type: category.type,
                amount: faker.number.float( {min: 50, max: 5000, fractionDigits: 2} ),
                counterparty: faker.company.name(),
                frequency: frequency,
                startDate: startDate,
                endDate: faker.helpers.arrayElement([null, faker.date.between({ from: endDateFrom, to: endDateTo })]),
                nextChargeDate: nextChargeDate,
                lastChargedDate: null,
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