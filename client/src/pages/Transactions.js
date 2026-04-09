import React from 'react';
import '../css/Transactions.css'
import { useUserId } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import TransDisplay from '../components/Transactions/TransDisplay';
import { useTransactionFilter } from '../hooks/useTransactionFilter';
import FilterBar from '../components/Overview/FilterBar';

function Transactions() {
  const userId = useUserId();

  const {
    rawCategories,
    rawTransactions,
    loading
  } = useUserData(userId);
  const {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    filteredTransactions
  } = useTransactionFilter(rawTransactions);
  
  if (loading) return <div className= "LoadingText"><h2>Loading Data...</h2></div>;

  return (
    <div>
      <div className= "HeaderDiv">
        <FilterBar
          selectedMonth={selectedMonth} 
          setSelectedMonth={setSelectedMonth} 
          selectedYear={selectedYear} 
          setSelectedYear={setSelectedYear}
        />
        <h1 className= "TransHeading">Transactions</h1>
        <div className= "EmptyDiv"/>
      </div>
      <TransDisplay filteredTransactions={ filteredTransactions } rawCategories={ rawCategories }/>
    </div>
  )
}

export default Transactions;