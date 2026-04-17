import React from 'react';
import '../Budgets/Budgets.css'
import FilterBar from '../../components/FilterBar/FilterBar';
import { formatCurrency } from '../../utils/dateHelpers';
import { useBudgetsData } from './useBudgetsData';
import { useBudgetsMetrics } from './useBudgetsMetrics';
import BudgetStatus from '../../components/Budgets/BudgetStatus';
import SpendMetrics from '../../components/Budgets/SpendMetrics';
import useBudgetDelete from './useBudgetDelete';
import { useBudgetEdit } from './useBudgetEdit';
import { useBudgetAdd } from './useBudgetAdd';
import BudgetList from '../../components/Budgets/BudgetList';
import { PageHeader } from '../../components/PageHeader/PageHeader';

function Budgets() {
  //Data helpers and hooks
  const { data, filters, isLoading } = useBudgetsData();
  const m = useBudgetsMetrics(data, filters);
  
  //Edit budget hook and function
  const { onEditSubmit } = useBudgetEdit(data.setBudgets);
  const handleEdit = async (budgetId, editForm) => {
    return await onEditSubmit(budgetId, editForm);
  };

  //Add budget hook
  const { onAddSubmit } = useBudgetAdd(data.setBudgets);

  //Delete budget hook and function
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
      <PageHeader title= "Budgets">
        <FilterBar
            selectedMonth={filters.selectedMonth} 
            setSelectedMonth={filters.setSelectedMonth} 
            selectedYear={filters.selectedYear} 
            setSelectedYear={filters.setSelectedYear}
            selectedCategory={filters.selectedCategory}
            setSelectedCategory={filters.setSelectedCategory}
            categories={m.expenseCategories}
          />
      </PageHeader>
      <div className= "BudgetsOverview">
        <h2 className= "MonthHeading">{m.dateHeading}</h2>
        <BudgetStatus m= {m} filters= {filters}/>
        <SpendMetrics metrics= {m.typicalSpendMetrics} formatCurrency= {formatCurrency}/>
      </div>
      <BudgetList 
        budgets={data.budgets}
        rawCategories={data.rawCategories}
        onEdit={handleEdit}
        onDelete={onDelete}
        onAddSubmit={onAddSubmit}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}

export default Budgets;