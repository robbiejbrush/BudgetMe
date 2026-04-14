import React from 'react';
import '../Budgets/Budgets.css'
import FilterBar from '../../components/FilterBar/FilterBar';
import { useTransactionFilter } from '../../hooks/useTransactionFilter';
import { useUserId } from '../../hooks/useAuth';
import { useBudgets } from './useBudgets';
import { useCategories } from '../../hooks/useCategories'
import { useTransactions } from '../../hooks/useTransactions';
import { useMemo } from 'react';
import { formatCurrency } from '../../utils/dateHelpers';

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

  //Only display expense categories
  const expenseCategories = useMemo(() => {
    return rawCategories.filter(cat => cat.type === 'expense');
  }, [rawCategories]);

  //Translate month number to name, output just year if all months selected
  const monthName = selectedMonth !== "" 
    ? new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' }) 
    : "";
  const dateHeading = selectedMonth === "all" 
    ? selectedYear 
    : `${monthName} ${selectedYear}`;

  //Calculate total spent based on filters  
  const totalSpent = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => {
      if (transaction.type === 'income') {
        return sum;
      }
      return sum + Math.abs(transaction.amount || 0);
    }, 0);
  }, [filteredTransactions]);

  //Find the budget limit for selected category (if all, tally all budgets)
  const currentBudget = useMemo(() => {
    if (!budgets.length || !rawCategories.length) return 0;
    
    //Determine if looking at a single month or the whole year
    const isYearlyView = selectedMonth === "all";
    const multiplier = isYearlyView ? 12 : 1;

    if (selectedCategory === "all") {
      const totalMonthlyLimit = budgets
      .filter(b => {
        const cat = rawCategories.find(c => c.categoryId === b.categoryId);
        return cat?.type === 'expense';
      })
    .reduce((sum, b) => sum + (Number(b.monthlyLimit) || 0), 0);
    return totalMonthlyLimit * multiplier;
    }
    const budgetEntry = budgets.find(b => String(b.categoryId) === String(selectedCategory));
    return budgetEntry ? Number(budgetEntry.monthlyLimit) * multiplier : 0;
  }, [budgets, selectedCategory, rawCategories, selectedMonth]);
  
  const safeTotalSpent = totalSpent || 0;
  const safeBudget = currentBudget || 0;

  //Get the actual category object for name display
  const activeCategory = useMemo(() => {
    return rawCategories.find(c => c.categoryId === selectedCategory);
  }, [rawCategories, selectedCategory]);

  //Calculate percent of budget that is spent
  const percentage = currentBudget > 0 ? (totalSpent / currentBudget) * 100 : 0;
  // Determine color
  let barColor = "#4caf50"; 
  if (percentage >= 100) {
    barColor = "#f44336"; 
  } else if (percentage >= 80) {
    barColor = "#ffeb3b";
  }
  const displayWidth = Math.min(percentage, 100);

  // Check if transactions exist after filters are applied
  const hasNoTransactions = filteredTransactions.length === 0;
  //Check if category doesn't have a budget (monthlyLimit === $0)
  const hasNoBudget = selectedCategory !== "all" && safeBudget === 0;

  //Calculate typical spend and below typical spend
  const typicalSpendMetrics = useMemo(() => {
    //Filter for 'expense' type and selected category
    const historicalExpenses = rawTransactions.filter(t => {
      const isExpense = t.type === 'expense';
      const isCategoryMatch = selectedCategory === "all" || String(t.categoryId) === String(selectedCategory);
      return isExpense && isCategoryMatch;
    });

    let typical = 0;

    if (selectedMonth === "all") {
      // --- YEARLY AVERAGE LOGIC ---
      // Group historical expenses by year
      const spendByYear = historicalExpenses.reduce((acc, t) => {
        const year = new Date(t.date).getFullYear();
        acc[year] = (acc[year] || 0) + Math.abs(t.amount || 0);
        return acc;
      }, {});

      const yearsArray = Object.values(spendByYear);
      // Average spend across all years found in history
      typical = yearsArray.length > 0 
        ? yearsArray.reduce((a, b) => a + b, 0) / yearsArray.length 
        : 0;
    } else {
      // --- MONTHLY AVERAGE LOGIC (for the selected year) ---
      const yearlyExpenses = historicalExpenses.filter(t => 
        new Date(t.date).getFullYear() === parseInt(selectedYear)
      );
      const totalYearlySpend = yearlyExpenses.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
      typical = totalYearlySpend / 12;
    }

    // Difference: Typical minus Actual
    const difference = safeTotalSpent === 0 ? 0 : typical - safeTotalSpent;

    return {
      typical,
      diff: difference,
      isAbove: difference >= 0
    };
  }, [rawTransactions, selectedYear, selectedCategory, selectedMonth, safeTotalSpent]);

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
            categories={expenseCategories}
          />
        </div>
          <h1 className= "BudgetsHeading">Budgets</h1>
          <div className= "EmptyDiv"/>
      </div>
      <div className= "BudgetsOverview">
        <h2 className= "MonthHeading">{dateHeading}</h2>
        {hasNoBudget ? (
          <div className= "NoDataMessage"><h2>There is no budget set for {activeCategory?.name || "this category"}.</h2></div>
        ) : (
          hasNoTransactions ? (
            <div className= "NoDataMessage"><h2>There are no transactions for this period.</h2></div>
        ) : (
          <>
            <div className="BudgetInfo">
              <span className= "PercentOutput">{selectedCategory === 'all' ? `Total Budget: ${percentage.toFixed(0)}%` : `${activeCategory.name} Budget: ${percentage.toFixed(0)}%`}</span>
            </div>
            {/* Progress Bar Container */}
            <div 
            className= "ProgressBar"
            style={{
              backgroundColor: '#e0e0e0',
              borderRadius: '8px',
              height: '20px',
              overflow: 'hidden',
              marginTop: '10px'
            }}>
              {/* Colored Bar */}
              <div style={{
                width: `${displayWidth}%`,
                height: '100%',
                backgroundColor: barColor,
                transition: 'width 0.5s ease-in-out, background-color 0.3s'
              }} />
            </div>

            <div className="BudgetTotals">
              <p>${safeTotalSpent.toLocaleString()} spent of ${safeBudget.toLocaleString()}</p>
            </div>
          </>
        ))}
            <div className= "AveragesDiv">
              <div className= "TypicalSpend">
                <h2>Typical Spend:</h2>
                <h2 style={{ color: 'white'}}>${formatCurrency(typicalSpendMetrics.typical)}</h2>
              </div>
              <div className= "BelowTypical">
                <h2>{typicalSpendMetrics.isAbove ? "Below Typical:" : "Over Typical:"}</h2>
                <h2 style={{ color: typicalSpendMetrics.isAbove ? "#4caf50" : "#f44336" }}>
                  ${formatCurrency(Math.abs(typicalSpendMetrics.diff))}
                </h2>
              </div>
            </div>
      </div>
      <div className= "LimitsOverview">

      </div>
    </div>
  )
}

export default Budgets;