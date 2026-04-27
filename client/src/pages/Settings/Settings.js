import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import styles from '../Settings/Settings.module.css';
import { useUserId } from '../../hooks/useAuth';
import { CategoryList } from '../../components/Settings/CategoryList/CategoryList';
import { RecurringTransactionList } from '../../components/Settings/RecurringTransactionList/RecurringTransactionList';
import { useRecurringTransactions } from './useRecurringTransactions';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { useNavigate } from 'react-router-dom';
import { useCurrencies } from './CurrencyContext';

function Settings({ setToken }) {
  const navigate = useNavigate();
  const userId = useUserId();

  const { recurringTransactions, loading: recTransLoading, setRecurringTransactions } = useRecurringTransactions(userId);
  const { rawCategories, setRawCategories, loading: catsLoading } = useCategories(userId);
  const { rawTransactions, loading: transLoading } = useTransactions(userId); 
  const { rates, selectedCurrency, setSelectedCurrency, loading } = useCurrencies();
  
  //Logout function
  const logOut = () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
    setToken(null);
    navigate("/", { replace: true });
  }

  return (
    <div>
      <PageHeader title= "Settings"/>
      <div className={styles.currencyDiv}>
        <h2 className={styles.currencyHeader}>Change Currency</h2>
        <select 
          className={styles.currencySelect}
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          disabled={loading}
        >
          {loading ? (
            <option>Loading...</option>
          ) : (
            Object.keys(rates).map(code => (
              <option key={code} value={code}>{code}</option>
            ))
          )}
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
      <div>
        <button className={styles.logoutBtn} onClick={logOut}>Logout</button>
      </div>
    </div>
  )
}

export default Settings;