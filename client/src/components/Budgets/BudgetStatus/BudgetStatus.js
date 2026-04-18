import React from 'react';
import ProgressBar from '../ProgressBar';
import styles from '../BudgetStatus/BudgetStatus.module.css';

const BudgetStatus = ({ m, filters }) => {
  const categoryName = filters.selectedCategory === 'all' ? 'Total' : m.activeCategory?.name;
  
  if (m.hasNoBudget) {
    return (
      <div className="NoDataMessage">
        <h2>There is no budget set for {m.activeCategory?.name || "this category"}.</h2>
      </div>
    );
  }

  if (m.hasNoTransactions) {
    return (
      <div className="NoDataMessage">
        <h2>There are no transactions for this period.</h2>
      </div>
    );
  }

  return (
    <>
      <div>
        <span className={styles.percentOutput}>
          {categoryName} Budget: <span style={{color: m.barColor}}>{m.percentage.toFixed(0)}%</span>
        </span>
      </div>

      <ProgressBar 
        width={m.displayWidth} 
        color={m.barColor} 
      />

      <div className={styles.budgetTotalsDiv}>
        <p>${m.totalSpent.toLocaleString()} <span style={{color: 'orange'}}>spent of</span> ${m.currentBudget.toLocaleString()}</p>
      </div>
    </>
  );
};

export default BudgetStatus;