# BudgetMe

### Live App

### Description
A full-stack budgeting application that helps users track spending, manage budgets, and gain insights into their financial habits.

The app features an Overview dashboard that provides a snapshot of income, expenses, and net balance, with filtering by month and year. Users can visualize their spending through a category-based pie chart, a yearly bar graph, and a percentage breakdown of expenses.

The Transactions page allows users to view, filter, add, edit, and delete transactions, with support for filtering by date, type, and category.

The Budgets page enables users to set and manage category-based budgets. It displays budget usage, compares current spending to typical spending patterns, and shows whether users are above or below their average.

The Settings page provides customization options including currency selection, management of recurring transactions, creation of custom categories, and account logout.

This project demonstrates full-stack development with dynamic data filtering, CRUD operations, data visualization, and user-focused financial insights.

### Demo 
https://drive.google.com/file/d/1GnZbPjYCDDnLrfZDtPBspg9jr8NY_xw8/view?usp=sharing

### Screenshots
https://drive.google.com/drive/folders/1TvR8GXl-13T5brj2hHLwS2vKws4xx0jh?usp=sharing

### Database Schema
https://drive.google.com/file/d/1jhM8gv_UdRbjxJ6qUh9v4RF0lZJY7kJx/view?usp=sharing

### Features 

    -Login with a Google account
    -Add, edit and delete income and expense transactions
    -Set, edit and delete budgets
    -View budgets insights
    -Explore charts and filtering options
    -Create, edit and delete recurring transactions
    -Create and delete custom categories
    -Change the currency
    -Responsive UI

### Technologies 

    Frontend- React, CSS 
    Backend- Node.js + Express
    Database- MySQL (Sequelize ORM)

    Frontend Deploy- Netlify
    Backend Deploy- Heroku + JawsDB

### Architecture 

    -Client communicates with REST API
    -Authentication handled using JWT
    -Backend manages business logic and database operations
    -Data persisted in MySQL

### API Endpoints
    
    POST    /api/auth

    GET     /api/transactions/getAll/userId
    GET     /api/transactions/getOne/transactionId
    POST    /api/transactions/create
    PUT     /api/transactions/edit/transactionId
    DELETE  /api/transactions/transactionId

    GET     /api/recurringTransactions/getAll/userId
    POST    /api/recurringTransactions/create
    PUT     /api/recurringTransactions/edit/recurringTransactionId
    DELETE  /api/recurringTransactions/recurringTransactionId

    GET     /api/budgets/userId
    POST    /api/budgets/create
    PUT     /api/budgets/edit/budgetId
    DELETE  /api/budgets/budgetId

    GET     /api/categories/userId
    POST    /api/categories/create
    PUT     /api/categories/edit/categoryId
    DELETE  /api/categories/categoryId

    GET     /api/rates

### Challenges 

    -Managing project size
    -Managing CSS styles
    -Filtering dates and transaction details
    -Implementing currency conversions
    -Managing state across pages effectively

### Author 
Robbie Brush