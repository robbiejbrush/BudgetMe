import React from 'react';
import { formatCurrency } from '../../../utils/dateHelpers';
import useTransactionDelete from './useTransactionDelete';
import { useNavigate } from 'react-router-dom';
import styles from '../TransDisplay/TransDisplay.module.css';
import { useCurrencies } from '../../../pages/Settings/CurrencyContext';

function TransDisplay({ filteredTransactions, rawCategories, setRawTransactions }) {
    const { convert, currencySymbol } = useCurrencies();
    const navigate = useNavigate();

    //On edit, navigate back to transactions
    const onEdit = (transaction) => {
      navigate(`/editTransaction/${transaction.transactionId}`);
    }

    //Delete transaction
    const { deleteTransaction, loading } = useTransactionDelete();
    const onDelete = async (transactionId) => {
      if (!window.confirm("Are you sure you want to delete this transaction?")) return;
      try {
        await deleteTransaction(transactionId);

        //Update current screen on delete
        setRawTransactions(prev => prev.filter(t => t.transactionId !== transactionId));
        alert("Transaction deleted successfully!");
      } catch (err) {
        alert("Couldn't delete this transaction. Try again.");
        console.error("Failed to delete:", err);
      }
    }

    if (loading) {
      return <div className= "LoadingText">Deleting transaction...</div>;
    }

    return (
        <div className={styles.transDiv}>
        <div className={`${styles.transRow} ${styles.header}`}>
          <span>Date</span>
          <span>Amount</span>
          <span>Counterparty</span>
          <span>Category</span>
          <span className= {styles.emptySpan}></span>
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
                <div key={`header-${currentMonth}`} className={styles.monthHeader}>
                  {currentMonth}
                </div>
              );
            }
            return (
              <React.Fragment key={transaction.transactionId}>
                {monthHeader}
                <div className={styles.transRow}>
                  <span className={styles.date}>{transaction.date}</span>
                  <span className={styles.amount} style={{ color: isExpense ? 'red' : 'green' }}>
                    {isExpense ? '-' : '+'}{currencySymbol}{formatCurrency(convert(transaction.amount))}
                  </span>
                  <span className={styles.counterparty}>{transaction.counterparty}</span>
                  <span className={styles.category}>{category?.name || 'Uncategorized'}</span>
                  <div className={styles.actionsDiv}>
                    <button 
                      onClick={() => onEdit(transaction)} 
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(transaction.transactionId)} 
                      className={styles.deleteBtn}
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