import React from 'react';
import '../css/Transactions.css'
import { useUserId } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import TransDisplay from '../components/Transactions/TransDisplay';

function Transactions() {
  const userId = useUserId();

  const {
    rawCategories,
    rawTransactions,
    loading
  } = useUserData(userId);
  
  if (loading) return <div className= "LoadingText"><h2>Loading Data...</h2></div>;

  return (
    <div>
      <div className= "HeaderDiv">
        <h1 className= "TransHeading">Transactions</h1>
        <div className= "EmptyDiv"/>
      </div>
      <TransDisplay rawTransactions={ rawTransactions } rawCategories={ rawCategories }/>
    </div>
  )
}

export default Transactions;