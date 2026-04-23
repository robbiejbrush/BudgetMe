import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import styles from '../Settings/Settings.module.css';
import { useUserId } from '../../hooks/useAuth';
import { CategoryList } from '../../components/Settings/CategoryList/CategoryList';
import { useRecurringTransactions } from './useRecurringTransactions';
import { useCategories } from '../../hooks/useCategories';
import { useMemo } from 'react';
import { RecurringTransactionList } from '../../components/Settings/RecurringTransactionList/RecurringTransactionList';
import { useRecurringTransactionAdd } from './useRecurringTransactionAdd';

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
  
  //Helper function to find category name by Id
  const categoryLookup = useMemo(() => {
    return rawCategories.reduce((acc, cat) => {
      acc[cat.categoryId] = cat.name;
      return acc;
    }, {});
  }, [rawCategories]);

  //Add recurring transaction hook
  const { onAddSubmit } = useRecurringTransactionAdd(setRecurringTransactions, rawCategories);

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
          rawCategories={rawCategories}
          onAddSubmit={onAddSubmit}
        />
      </div>
      <div className={styles.categoriesDiv}>
        <h2 className={styles.categoriesHeader}>Custom Categories</h2>
        <CategoryList userId={userId}/>
      </div>
    </div>
  )
}

export default Settings;