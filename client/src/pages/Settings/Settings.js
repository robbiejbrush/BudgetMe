import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import styles from '../Settings/Settings.module.css';
import { useUserId } from '../../hooks/useAuth';
import { CategoryManager } from '../../components/Settings/CategoryManager/CategoryManager';
import { useRecurringTransactions } from './useRecurringTransactions';
import { useCategories } from '../../hooks/useCategories';
import { useMemo } from 'react';
import { RecurringTransactionList } from '../../components/Settings/RecurringTransactionList/RecurringTransactionList';

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
        <RecurringTransactionList
          recurringTransactions={recurringTransactions}
          categoryLookup={categoryLookup}
          setRecurringTransactions={setRecurringTransactions}
          recTransLoading={recTransLoading}
          catsLoading={catsLoading}
        />
      </div>
      <div className={styles.categoriesDiv}>
        <h2 className={styles.categoriesHeader}>Custom Categories</h2>
        <CategoryManager userId={userId}/>
      </div>
    </div>
  )
}

export default Settings;