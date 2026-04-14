import React from 'react';
import '../Budgets/Budgets.css'
import FilterBar from '../../components/FilterBar/FilterBar';
import { formatCurrency } from '../../utils/dateHelpers';
import { useBudgetsData } from './useBudgetsData';
import { useBudgetsMetrics } from './useBudgetsMetrics';
import BudgetStatus from '../../components/Budgets/BudgetStatus';
import SpendMetrics from '../../components/Budgets/SpendMetrics';

function Budgets() {
  const { data, filters, isLoading } = useBudgetsData();
  const m = useBudgetsMetrics(data, filters);

  if (isLoading) return <div className= "LoadingText">Loading data...</div>;

  return (
    <div>
      <div className= "BudgetsHeader">
        <div className= "FilterDiv">
          <FilterBar
            selectedMonth={filters.selectedMonth} 
            setSelectedMonth={filters.setSelectedMonth} 
            selectedYear={filters.selectedYear} 
            setSelectedYear={filters.setSelectedYear}
            selectedCategory={filters.selectedCategory}
            setSelectedCategory={filters.setSelectedCategory}
            categories={m.expenseCategories}
          />
        </div>
          <h1 className= "BudgetsHeading">Budgets</h1>
          <div className= "EmptyDiv"/>
      </div>
      <div className= "BudgetsOverview">
        <h2 className= "MonthHeading">{m.dateHeading}</h2>
        <BudgetStatus m= {m} filters= {filters}/>
        <SpendMetrics metrics= {m.typicalSpendMetrics} formatCurrency= {formatCurrency}/>
      </div>
      <div className= "LimitsOverview">

      </div>
    </div>
  )
}

export default Budgets;