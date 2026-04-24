import styles from '../RecurringTransactionList/RecurringTransactionList.module.css';
import { RecurringTransactionItem } from '../RecurringTransactionItem/RecurringTransactionItem';
import { RecurringTransactionForm } from '../RecurringTransactionForm/RecurringTransactionForm';
import { initialValues, validationSchema } from '../RecurringTransactionSchema';
import { useRecurringTransactionAdd } from '../RecurringTransactionList/useRecurringTransactionAdd';
import { useMemo } from 'react';

export function RecurringTransactionList( {
  recurringTransactions,
  setRecurringTransactions,
  rawCategories,
  loading
}) {
  
  const { onAddSubmit } = useRecurringTransactionAdd(setRecurringTransactions, rawCategories);

  //Helper function to find category name by Id
  const categoryLookup = useMemo(() => {
    return rawCategories.reduce((acc, cat) => {
      acc[cat.categoryId] = cat.name;
      return acc;
    }, {});
  }, [rawCategories]);

  if (loading) return <div className= "LoadingText">Loading data...</div>;
  
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
            categoryName={categoryLookup[tx.categoryId] || (tx.type === 'income' ? 'Other (Income)' : 'Other (Expense)')}
            setRecurringTransactions={setRecurringTransactions}
            rawCategories={rawCategories}
        />
      ))}
      <RecurringTransactionForm 
        initialValues={initialValues}
        onSubmit={onAddSubmit}
        validationSchema={validationSchema}
        rawCategories={rawCategories} 
      />
    </div>
  );
}