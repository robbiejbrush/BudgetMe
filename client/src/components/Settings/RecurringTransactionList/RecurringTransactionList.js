import styles from '../RecurringTransactionList/RecurringTransactionList.module.css';
import { RecurringTransactionItem } from '../RecurringTransactionItem/RecurringTransactionItem';
import { RecurringTransactionForm } from '../RecurringTransactionForm/RecurringTransactionForm';
import { initialValues, validationSchema } from '../RecurringTransactionSchema';
import { useUserId } from '../../../hooks/useAuth';
import { useRecurringTransactions } from '../RecurringTransactionList/useRecurringTransactions';
import { useRecurringTransactionAdd } from '../RecurringTransactionList/useRecurringTransactionAdd';
import { useCategories } from '../../../hooks/useCategories';
import { useMemo } from 'react';

export function RecurringTransactionList() {
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
  
  //Helper function to find category name by Id
  const categoryLookup = useMemo(() => {
    return rawCategories.reduce((acc, cat) => {
      acc[cat.categoryId] = cat.name;
      return acc;
    }, {});
  }, [rawCategories]);

  //Add recurring transaction hook
  const { onAddSubmit } = useRecurringTransactionAdd(setRecurringTransactions, rawCategories);

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