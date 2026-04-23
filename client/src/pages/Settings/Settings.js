import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import styles from '../Settings/Settings.module.css';
import { useUserId } from '../../hooks/useAuth';
import { CategoryList } from '../../components/Settings/CategoryList/CategoryList';
import { RecurringTransactionList } from '../../components/Settings/RecurringTransactionList/RecurringTransactionList';

function Settings() {
  //Get current userId
  const userId = useUserId();

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
        <RecurringTransactionList/>
      </div>
      <div className={styles.categoriesDiv}>
        <h2 className={styles.categoriesHeader}>Custom Categories</h2>
        <CategoryList userId={userId}/>
      </div>
    </div>
  )
}

export default Settings;