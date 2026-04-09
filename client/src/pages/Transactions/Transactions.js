import React from 'react';
import '../Transactions/Transactions.css'
import { useUserId } from '../../hooks/useAuth';
import { useUserData } from '../../hooks/useUserData';
import TransDisplay from '../../components/Transactions/TransDisplay';
import { useTransactionFilter } from '../../hooks/useTransactionFilter';
import FilterBar from '../../components/FilterBar/FilterBar';
import { useNavigate } from 'react-router-dom';

function Transactions() {
  const navigate = useNavigate();

  const userId = useUserId();

  const {
    rawCategories,
    rawTransactions,
    loading
  } = useUserData(userId);
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

  if (loading) return <div className= "LoadingText"><h2>Loading Data...</h2></div>;

  return (
    <div>
      <div className= "HeaderDiv">
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
        <h1 className= "TransHeading">Transactions</h1>
        <div className= "ButtonDiv">
          <button 
            className= "AddTransBtn"
            onClick={() => navigate('/addTransaction')}>
            Add Transaction
          </button>
        </div>
      </div>
      {filteredTransactions.length === 0 ? (
        <div className="NoDataMessage">
          <h2>There are no transactions for this time.</h2>
        </div>
      ) : (
      <TransDisplay filteredTransactions={ filteredTransactions } rawCategories={ rawCategories }/>
      )
      }
    </div>
  )
}

export default Transactions;