const express = require("express");
const app = express();
const cors = require('cors')
const recurringTransactionsJob = require('./jobs/recurringTransactionsJob');

app.use(express.json());
app.use(cors());

const db = require('./models');

// Routers
const userRouter = require('./routes/Users')
app.use("/auth", userRouter);

const transactionRouter = require('./routes/Transactions')
app.use("/transactions", transactionRouter);

const recurringTransactionRouter = require('./routes/RecurringTransactions')
app.use("/recurringTransactions", recurringTransactionRouter);

const categoriesRouter = require('./routes/Categories')
app.use("/categories", categoriesRouter);

const budgetsRouter = require('./routes/Budgets')
app.use("/budgets", budgetsRouter);

const PORT = 3001; //process.env.PORT || 3306;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        recurringTransactionsJob.start();
    });
});