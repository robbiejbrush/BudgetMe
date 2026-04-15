import React from 'react';
import { formatCurrency } from '../../utils/dateHelpers';
import useTransactionDelete from './useTransactionDelete';
import { useNavigate } from 'react-router-dom';

function TransDisplay({ filteredTransactions, rawCategories, setRawTransactions }) {

    const navigate = useNavigate();
    const onEdit = (transaction) => {
      navigate(`/editTransaction/${transaction.transactionId}`);
    }

    const { deleteTransaction, loading, error } = useTransactionDelete();
    const onDelete = async (transactionId) => {
      if (!window.confirm("Are you sure you want to delete this transaction?")) return;
      try {
        await deleteTransaction(transactionId);

        //Update current screen on delete
        setRawTransactions(prev => prev.filter(t => t.transactionId !== transactionId));
        alert("Transaction deleted successfully!");
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }

    if (loading) {
      return <div className= "LoadingText">Deleting transaction...</div>;
    }

    if (error) {
      return <div className= "ErrorText">Couldn't delete transaction: { error }</div>;
    }

    return (
        <div className="TransDiv">
        <div className="TransactionRow Header">
          <span>Date</span>
          <span>Amount</span>
          <span>Counterparty</span>
          <span>Category</span>
          <span className= "EmptySpan"></span>
        </div>
        {(() => {
          let lastMonth = "";

          return filteredTransactions && filteredTransactions.map((transaction) => {
            const category = rawCategories.find(
              (cat) => Number(cat.categoryId) === Number(transaction.categoryId)
            );
            const isExpense = transaction.type === 'expense';
            
            //Format the date to "Month Year"
            const [year, month] = transaction.date.split('-').map(Number);

            const dateObj = new Date(year, month - 1, 1); 
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
                    {isExpense ? '-' : '+'}${formatCurrency(transaction.amount)}
                  </span>
                  <span className="Counterparty">{transaction.counterparty}</span>
                  <span className="Category">{category?.name || 'Uncategorized'}</span>
                  <div className="Actions">
                    <button 
                      onClick={() => onEdit(transaction)} 
                      className="EditBtn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(transaction.transactionId)} 
                      className="DeleteBtn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          });
        })()}
      </div>
    )
}

export default TransDisplay;