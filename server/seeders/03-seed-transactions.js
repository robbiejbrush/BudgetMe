const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
        console.log('--- Cleaning Transactions table ---');
        await queryInterface.bulkDelete('transactions', null, {});

        const [categories] = await queryInterface.sequelize.query(
            `SELECT categoryId, type, name from categories 
             WHERE name NOT IN ('Other (Income)', 'Other (Expense)');`
        );

        const incomeCats = categories.filter(c => c.type === 'income');
        const expenseCats = categories.filter(c => c.type === 'expense');

        const transactions = [];
        let totalExpenseAmount = 0;

        //Generate 75 Expense transactions
        for (let i = 0; i < 75; i++) {
            const amount = faker.number.float({ min: 50, max: 5000, fractionDigits: 2 });
            const category = faker.helpers.arrayElement(expenseCats);
            
            totalExpenseAmount += amount;
            transactions.push(createTx(category, amount));
        }

        //Target income is 20% more than expenses
        const targetIncomeTotal = totalExpenseAmount * 1.2;
        //Divide total by the 25 income slots
        const averageIncomePerTx = targetIncomeTotal / 25;

        //Generate 25 Income transactions
        for (let i = 0; i < 25; i++) {
            const amount = faker.number.float({ 
                min: averageIncomePerTx * 0.7,
                max: averageIncomePerTx * 1.3, 
                fractionDigits: 2 
            });
            const category = faker.helpers.arrayElement(incomeCats);
            transactions.push(createTx(category, amount));
        }

        function createTx(category, amount) {
            return {
                type: category.type,
                amount: amount,
                counterparty: faker.company.name(),
                date: faker.date.past({ years: 2 }),
                categoryId: category.categoryId,
                userId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        }

        console.log('--- Seeding Transactions ---');
        await queryInterface.bulkInsert('transactions', transactions);
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
    await queryInterface.bulkDelete('transactions', null, {});
  }
};