import React from 'react';
import '../Budgets/Budgets.css'
import FilterBar from '../../components/FilterBar/FilterBar';
import { useTransactionFilter } from '../../hooks/useTransactionFilter';
import { useUserId } from '../../hooks/useAuth';
import { useBudgets } from './useBudgets';
import { useCategories } from '../../hooks/useCategories'
import { useMemo } from 'react';
import { useTransactions } from '../../hooks/useTransactions';

function Budgets() {
  const userId = useUserId();
  
  const {
    budgets,
    loading: budgetsLoading,
  } = useBudgets(userId);

  const {
    rawTransactions,
    loading: transactionsLoading,
  } = useTransactions(userId);

  const {
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    selectedCategory, setSelectedCategory,
    filteredTransactions
  } = useTransactionFilter(rawTransactions);

  const {
      rawCategories,
      loading: categoriesLoading
    } = useCategories(userId);

  //Calculate actual spending per category
  const budgetData = useMemo(() => {
    const totals = filteredTransactions.reduce((acc, t) => {
      const amount = Number(t.amount) || 0;
      acc[t.categoryId] = (acc[t.categoryId] || 0) + amount;
      return acc;
    }, {});

    // Map through all budgets so we show them even if spending is $0
    return budgets.map(budget => {
      const actual = Number(totals[budget.categoryId] || 0);
      const limit = Number(budget.limit || 0);
      const progress = limit > 0 ? (actual / limit) * 100 : 0;
      
      return { ...budget, actual, progress };
    });
  }, [filteredTransactions, budgets]);

  if (budgetsLoading || categoriesLoading || transactionsLoading) return <div className= "LoadingText">Loading data...</div>;

  return (
    <div>
      <div className= "BudgetsHeader">
        <div className= "FilterDiv">
          <FilterBar
            selectedMonth={selectedMonth} 
            setSelectedMonth={setSelectedMonth} 
            selectedYear={selectedYear} 
            setSelectedYear={setSelectedYear}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={rawCategories}
          />
        </div>
          <h1 className= "BudgetsHeading">Budgets</h1>
          <div className= "ButtonDiv">
            <button className= "LimitsBtn">
              Set Limits
            </button>
          </div>
      </div>
      <div className="BudgetList">
        {budgetData.map(budget => (
          <div key={budget.categoryId} className="BudgetCard">
            <div className="BudgetInfo">
              <span>{budget.categoryName}</span>
              <span>${budget.actual.toFixed(2)} / ${budget.limit}</span>
            </div>
            <div className="ProgressBarContainer">
              <div 
                className="ProgressBarFill" 
                style={{ width: `${Math.min(budget.progress, 100)}%`, 
                        backgroundColor: budget.progress > 100 ? 'red' : '#4caf50' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Budgets;