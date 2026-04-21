import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import styles from '../Settings/Settings.module.css';
import { useUserId } from '../../hooks/useAuth';
import { CategoryManager } from '../../components/Settings/CategoryManager/CategoryManager';
import { useRecurringTransactions } from './useRecurringTransactions';
import { formatCurrency } from '../../utils/dateHelpers';
import { useCategories } from '../../hooks/useCategories';
import { useMemo } from 'react';
import useRecurringTransactionDelete from './useRecurringTransactionDelete';

function Settings() {
  //Get current userId
  const userId = useUserId();

  //Get all recurring transactions
  const {
    recurringTransactions,
    loading: recTransLoading,
    setRecurringTransactions
  } = useRecurringTransactions(userId);

  //Get all categories
  const { 
    rawCategories,
    loading: catsLoading
  } = useCategories(userId);
  
  //Helper function to find the name by Id
  const categoryLookup = useMemo(() => {
    return rawCategories.reduce((acc, cat) => {
      acc[cat.categoryId] = cat.name;
      return acc;
    }, {});
  }, [rawCategories]);

  //Delete recurring transaction
  const {
    deleteRecurringTransaction,
    loading: recTransDeleteLoading
  } = useRecurringTransactionDelete();

  const handleDelete = async (recurringTransactionId) => {
    if (window.confirm("Are you sure you want to delete this recurring transaction?")) {
      try {
        await deleteRecurringTransaction(recurringTransactionId);

        setRecurringTransactions(prev => 
          prev.filter(tx => tx.recurringTransactionId !== recurringTransactionId)
        );
      } catch (err) {
        console.error("Failed to delete:", err);
        alert("Could not delete the transaction. Please try again.");
      }
    }
  };

  return (
    <div>
      <PageHeader title= "Settings"/>
      <div className={styles.currencyDiv}>
        <h2 className={styles.currencyHeader}>Change Currency</h2>
        <select className={styles.currencySelect}>
          <option>CAD</option>
        </select>
      </div>
      <div className={styles.recTransDiv}>
        <h2 className={styles.recTransHeader}>Recurring Transactions</h2>
        <div className={styles.recTransListDiv}>
          <span className={styles.itemHeading}>Amount</span>
          <span className={styles.itemHeading}>Type</span>
          <span className={styles.itemHeading}>Category</span>
          <span className={styles.itemHeading}>Counterparty</span>
          <span className={styles.itemHeading}>Frequency</span>
          <span className={styles.itemHeading}>Start Date</span>
          <span className={styles.itemHeading}>End Date</span>

          <div className={styles.headerDivider}></div>

          {recurringTransactions.map((tx) => (
            <div key={tx.recurringTransactionId} className={styles.recTransItem}>
              <span className={styles.itemSpan}>${formatCurrency(tx.amount)}</span>
              <span className={styles.itemSpan}>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</span>
              <span className={styles.itemSpan}>{categoryLookup[tx.categoryId]}</span>
              <span className={styles.itemSpan}>{tx.counterparty}</span>
              <span className={styles.itemSpan}>{tx.frequency.charAt(0).toUpperCase() + tx.frequency.slice(1)}</span>
              <span className={styles.itemSpan}>{tx.startDate}</span>
              <span className={styles.itemSpan}>{tx.endDate || 'N/A'}</span>
              <div className={styles.actionsDiv}>
                <button className={styles.editBtn}>Edit</button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(tx.recurringTransactionId)}
                  disabled={recTransDeleteLoading}>
                    Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CategoryManager userId={userId}/>
    </div>
  )
}

export default Settings;