import React from 'react';
import '../css/Transactions.css'
import { useUserId } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';

function Transactions() {
  const userId = useUserId();

  const {
    rawCategories,
    rawTransactions,
    loading
  } = useUserData(userId);
  
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
        {(() => {
          let lastMonth = "";

          return rawTransactions && rawTransactions.map((transaction) => {
            const category = rawCategories[transaction.categoryId];
            const isExpense = transaction.type === 'expense';
            
            //Format the date to "Month Year"
            const dateObj = new Date(transaction.date);
            const currentMonth = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

            //Check if the month has changed
            let monthHeader = null;
            if (currentMonth !== lastMonth) {
              lastMonth = currentMonth;
              monthHeader = (
                <div key={`header-${currentMonth}`} className="MonthHeader">
                  {currentMonth}
                </div>
              );
            }
            return (
              <React.Fragment key={transaction.transactionId}>
                {monthHeader}
                <div className="TransactionRow">
                  <span className="Date">{transaction.date}</span>
                  <span className="Amount" style={{ color: isExpense ? 'red' : 'green' }}>
                    {isExpense ? '-' : '+'}${transaction.amount}
                  </span>
                  <span className="Counterparty">{transaction.counterparty}</span>
                  <span className="Category">{category?.name || 'Uncategorized'}</span>
                </div>
              </React.Fragment>
            );
          });
        })()}
      </div>
    </div>
  )
}

export default Transactions;