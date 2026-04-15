import React from 'react';
import '../Budgets/Budgets.css'
import FilterBar from '../../components/FilterBar/FilterBar';
import { formatCurrency } from '../../utils/dateHelpers';
import { useBudgetsData } from './useBudgetsData';
import { useBudgetsMetrics } from './useBudgetsMetrics';
import BudgetStatus from '../../components/Budgets/BudgetStatus';
import SpendMetrics from '../../components/Budgets/SpendMetrics';
import useBudgetDelete from './useBudgetDelete';

function Budgets() {
  const { data, filters, isLoading } = useBudgetsData();
  const m = useBudgetsMetrics(data, filters);

  const onEdit = () => {

  };

  const { deleteBudget, loading: deleteLoading } = useBudgetDelete();
  const onDelete = async (budgetId) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    try {
      await deleteBudget(budgetId);

      //Update current screen on delete
      data.setBudgets(prev => prev.filter(b => b.budgetId !== budgetId));
      alert("Budget deleted successfully!");
    } catch (err) {
      alert("Couldn't delete this budget. Try again.");
      console.error("Failed to delete:", err);
    }
  }

  if (isLoading || deleteLoading) return <div className= "LoadingText">Loading data...</div>;

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
      <div className= "BudgetsList">
        <div className= "BudgetItem Header">
          <span>Category</span>
          <span>Monthly Limit</span>
          <span className= "EmptySpan"></span>
        </div>
        {data.budgets.length === 0 ? (
          <div className= "NoDataMessage">No budgets are set.</div>
        ) : (
          data.budgets.map((budget) => {
            const category = data.rawCategories.find(cat => cat.categoryId === budget.categoryId);
            return(
              <div className= "BudgetItem">
                <span>{category.name}</span>
                <span>${budget.monthlyLimit}</span>
                <div className="Actions">
                      <button 
                        onClick={() => onEdit()} 
                        className="EditBtn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => onDelete(budget.budgetId)} 
                        className="DeleteBtn"
                      >
                        Delete
                      </button>
                    </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  )
}

export default Budgets;