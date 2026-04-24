import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import styles from '../Settings/Settings.module.css';
import { useUserId } from '../../hooks/useAuth';
import { CategoryList } from '../../components/Settings/CategoryList/CategoryList';
import { RecurringTransactionList } from '../../components/Settings/RecurringTransactionList/RecurringTransactionList';
import { useRecurringTransactions } from './useRecurringTransactions';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';

function Settings() {
  
  const userId = useUserId();

  const { recurringTransactions, loading: recTransLoading, setRecurringTransactions } = useRecurringTransactions(userId);
  const { rawCategories, setRawCategories, loading: catsLoading } = useCategories(userId);
  const { rawTransactions, loading: transLoading } = useTransactions(userId); 

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
          setRecurringTransactions={setRecurringTransactions}
          rawCategories={rawCategories}
          loading={recTransLoading || catsLoading}
        />
      </div>
      <div className={styles.categoriesDiv}>
        <h2 className={styles.categoriesHeader}>Custom Categories</h2>
        <CategoryList 
          rawCategories={rawCategories}
          setRawCategories={setRawCategories}
          recurringTransactions={recurringTransactions}
          setRecurringTransactions={setRecurringTransactions}
          rawTransactions={rawTransactions}
          loading={recTransLoading || catsLoading || transLoading}
        />
      </div>
    </div>
  )
}

export default Settings;