import React from 'react';
import styles from '../Transactions/Transactions.module.css'
import { useUserId } from '../../hooks/useAuth';
import TransDisplay from '../../components/Transactions/TransDisplay/TransDisplay';
import { useTransactionFilter } from '../../hooks/useTransactionFilter';
import FilterBar from '../../components/FilterBar/FilterBar';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { PageHeader } from '../../components/PageHeader/PageHeader';

function Transactions() {
  const navigate = useNavigate();

  const userId = useUserId();

  const {
    rawCategories,
    loading: categoriesLoading
  } = useCategories(userId);
  const {
    rawTransactions,
    loading: transactionsLoading,
    setRawTransactions
  } = useTransactions(userId);
  const {
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    filteredTransactions,
    selectedType, setSelectedType,
    selectedCategory, setSelectedCategory
  } = useTransactionFilter(rawTransactions);
  
  //Filter categories based on selected type
  const visibleCategories = rawCategories.filter(cat => {
    if (selectedType === "all") return true; 
    return cat.type === selectedType;       
  });

  if (categoriesLoading || transactionsLoading) return <div className= "LoadingText"><h2>Loading Data...</h2></div>;

  return (
    <div>
      <PageHeader 
        title="Transactions"
        actions= {
          <button 
            className= {styles.addBtn}
            onClick={() => navigate('/addTransactions')}>
            Add Transaction
          </button>
        }
      >
        <FilterBar
          selectedMonth={selectedMonth} 
          setSelectedMonth={setSelectedMonth} 
          selectedYear={selectedYear} 
          setSelectedYear={setSelectedYear}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={visibleCategories}
        />
      </PageHeader>
      {filteredTransactions.length === 0 ? (
        <div className="NoDataDiv">
          <h2 className="NoDataMessage">There are no transactions for this time.</h2>
        </div>
      ) : (
      <TransDisplay filteredTransactions={ filteredTransactions } rawCategories={ rawCategories } setRawTransactions={ setRawTransactions }/>
      )
      }
    </div>
  )
}

export default Transactions;