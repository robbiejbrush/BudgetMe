import styles from '../RecurringTransactionList/RecurringTransactionList.module.css';
import { RecurringTransactionItem } from '../RecurringTransactionItem/RecurringTransactionItem';

export function RecurringTransactionList({ recurringTransactions, categoryLookup, setRecurringTransactions, recTransLoading, catsLoading }) {
    
  if (recTransLoading || catsLoading) return <div className= "LoadingText">Loading data...</div>;
  
  return (
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
            <RecurringTransactionItem 
                key={tx.recurringTransactionId}
                tx={tx}
                categoryName={categoryLookup[tx.categoryId]}
                setRecurringTransactions={setRecurringTransactions}
            />
          ))}
        </div>
    );
}