import React from 'react';
import ProgressBar from './ProgressBar'; // Recommended to extract this too!

const BudgetStatus = ({ m, filters }) => {
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

  const categoryName = filters.selectedCategory === 'all' ? 'Total' : m.activeCategory?.name;

  return (
    <>
      <div className="BudgetInfo">
        <span className="PercentOutput">
          {categoryName} Budget: {m.percentage.toFixed(0)}%
        </span>
      </div>

      <ProgressBar 
        width={m.displayWidth} 
        color={m.barColor} 
      />

      <div className="BudgetTotals">
        <p>${m.totalSpent.toLocaleString()} spent of ${m.currentBudget.toLocaleString()}</p>
      </div>
    </>
  );
};

export default BudgetStatus;