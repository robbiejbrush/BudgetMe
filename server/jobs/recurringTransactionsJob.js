const cron = require('node-cron');
const { startOfDay, addWeeks, addMonths, isBefore, isToday, parseISO, isAfter } = require('date-fns');
const db = require('../models');

const processRecurringTransactions = async () => {
    console.log('--- Checking for due recurring transactions ---');
    const today = startOfDay(new Date());

    try {
        //Get all recurring transactions due today or earlier
        const dueItems = await db.RecurringTransactions.findAll({
            where: {
                nextChargeDate: { [db.Sequelize.Op.lte]: today }
            }
        });

        for (const item of dueItems) {
            const endDate = item.endDate ? parseISO(item.endDate) : null;
            let currentNextDate = startOfDay(parseISO(item.nextChargeDate));

            //If nextChargeDate is after the endDate, stop and delete
            if (endDate && isAfter(currentNextDate, endDate)) {
                await item.destroy(); 
                continue;
            }

            //Create transactions for all missed dates
            while (isBefore(currentNextDate, today) || isToday(currentNextDate)) {
                
                //Safety check: Don't create transactions past the end date
                if (endDate && isAfter(currentNextDate, endDate)) {
                    break; 
                }

                //Create the transaction record
                await db.Transactions.create({
                    userId: item.userId,
                    amount: item.amount,
                    type: item.type,
                    categoryId: item.categoryId,
                    counterparty: item.counterparty,
                    date: currentNextDate
                });

                //Update tracker for the next iteration
                item.lastChargedDate = currentNextDate;
                
                //Calculate the next date in the cycle
                if (item.frequency === 'weekly') currentNextDate = addWeeks(currentNextDate, 1);
                else if (item.frequency === 'biweekly') currentNextDate = addWeeks(currentNextDate, 2);
                else if (item.frequency === 'monthly') currentNextDate = addMonths(currentNextDate, 1);
            }

            //Final cleanup: If the new nextChargeDate is now past the endDate, delete the recurring transaction
            if (endDate && isAfter(currentNextDate, endDate)) {
                await item.destroy();
            } else {
                //Save the new nextCHargeDate back to the recurring transaction
                item.nextChargeDate = currentNextDate;
                await item.save();
            }
        }
        console.log(`--- Finished processing ${dueItems.length} recurring items ---`);
    } catch (error) {
        console.error('Error processing recurring transactions:', error);
    }
};

//Schedule to run at 00:00 every night
const start = () => {
    cron.schedule('0 0 * * *', processRecurringTransactions);
};

module.exports = { start };