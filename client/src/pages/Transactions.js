import React from 'react';
import '../css/Transactions.css'
import { useTransactionsData } from '../hooks/useTransactionsData';
import { useUserId } from '../hooks/useAuth';

function Transactions() {
  const userId = useUserId();

  const {
    rawCategories,
    rawTransactions
  } = useTransactionsData(userId);
  
  return (
    <div>
      <div className= "HeaderDiv">
        <h1 className= "TransHeading">Transactions</h1>
        <div className= "EmptyDiv"/>
      </div>
      <div className="TransDiv">
        <div className="TransactionRow Header">
          <span>Date</span>
          <span>Amount</span>
          <span>Counterparty</span>
          <span>Category</span>
        </div>
        {rawTransactions && rawTransactions.map((transaction) => {
          //Find the corresponding category
          const category = rawCategories[transaction.categoryId];
          const isExpense = transaction.type === 'expense';

          return (
            <div key={transaction.transactionId} className="TransactionRow">
              <span className="TransDate">{transaction.date}</span>
              <span className="TransAmount" style={{ color: isExpense ? 'red' : 'green'}}>${transaction.amount}</span>
              <span className="TransCounterparty">{transaction.counterparty}</span>
              <span className="TransCategory">{category?.name || 'Uncategorized'}</span>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Transactions;