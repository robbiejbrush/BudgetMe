import React from 'react';

function TransDisplay({ rawTransactions, rawCategories }) {

    return (
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
    )
}

export default TransDisplay;