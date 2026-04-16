import React from 'react';
import '../Budgets/Budgets.css'
import FilterBar from '../../components/FilterBar/FilterBar';
import { formatCurrency } from '../../utils/dateHelpers';
import { useBudgetsData } from './useBudgetsData';
import { useBudgetsMetrics } from './useBudgetsMetrics';
import BudgetStatus from '../../components/Budgets/BudgetStatus';
import SpendMetrics from '../../components/Budgets/SpendMetrics';
import useBudgetDelete from './useBudgetDelete';
import { useState } from 'react';
import { useBudgetEdit } from './useBudgetEdit';

function Budgets() {
  const { data, filters, isLoading } = useBudgetsData();
  const m = useBudgetsMetrics(data, filters);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ categoryId: '', monthlyLimit: '' });
  //Triggers edit mode on budget
  const startEdit = (budget) => {
    setEditingId(budget.budgetId);
    setEditForm({ categoryId: budget.categoryId, monthlyLimit: budget.monthlyLimit });
  };
  //Hook for put request
  const {
    onSubmit
  } = useBudgetEdit(editingId, data.setBudgets);
  //Handles closing edit mode and calling hook
  const handleEditSubmit = async () => {
    const success = await onSubmit(editForm);
    if (success) {
      setEditingId(null); // Close the edit inputs on success
    }
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

  const unusedCategoriesWithSelected = () => {
    return data.rawCategories.filter(cat => {
      //Check if this category already has a budget assigned
      const isAssigned = data.budgets.some(b => b.categoryId === cat.categoryId);
      //Check if this is the category currently being edited
      const isCurrentEdit = cat.categoryId === editForm.categoryId;
      //Check if it is an income category
      const isIncome = cat.type === 'income';
      return (!isAssigned || isCurrentEdit) && !isIncome;
    });
  }

  const unusedCategories = () => {
    return data.rawCategories.filter(cat => {
      //Check if this category already has a budget assigned
      const isAssigned = data.budgets.some(b => b.categoryId === cat.categoryId);
      //Check if it is an income category
      const isIncome = cat.type === 'income';
      return (!isAssigned) && !isIncome;
    });
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
          <span className= "BudgetItemsHeading">Category</span>
          <span className= "BudgetItemsHeading">Monthly Limit</span>
          <span></span>
        </div>
        <div className="BudgetsHeaderDivider"></div>
        {data.budgets.length === 0 ? (
          <div className= "NoDataMessage">No budgets are set.</div>
        ) : (
          data.budgets.map((budget) => {
            const isEditing = editingId === budget.budgetId;
            const category = data.rawCategories.find(cat => cat.categoryId === budget.categoryId);
            return(
              <div className= "BudgetItem">
                {isEditing ? (
                  <>
                    <select 
                      className= "EditCategorySelect"
                      value={editForm.categoryId}
                      onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                    >
                      {unusedCategoriesWithSelected().map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                      ))}
                    </select>

                    <div className="BudgetsAmountWrapper">
                      <span className="BudgetsCurrencySymbol">$</span>
                      <input 
                        type="number" 
                        className="EditAmountInput"
                        value={editForm.monthlyLimit}
                        onChange={(e) => setEditForm({ ...editForm, monthlyLimit: e.target.value })}
                      />
                    </div>

                    <div className="EditActions">
                      <button className= "EditSubmitBtn" onClick={handleEditSubmit}>
                        Submit
                      </button>
                      <button className= "EditCancelBtn" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className= "BudgetItemSpan">{category.name}</span>
                    <span className= "BudgetItemSpan">${formatCurrency(budget.monthlyLimit)}</span>
                    <div className="EditActions">
                      <button onClick={() => startEdit(budget)} className="EditBtn">Edit</button>
                      <button onClick={() => onDelete(budget.budgetId)} className="DeleteBtn">Delete</button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
        <form id="BudgetAddForm" class="BudgetAddForm">
          <select id="AddCategorySelect" className= "AddCategorySelect" required>
            {unusedCategories().map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
            ))}
          </select>
          <div className= "BudgetsAmountWrapper">
            <span className= "BudgetsCurrencySymbol">$</span>
            <input type="number" id="AddAmountInput" className= "AddAmountInput" placeholder="Amount" step="0.01" required/>
          </div>
          <button type="submit" className= "AddBtn" id="AddBtn">Add</button>
        </form>
      </div>
    </div>
  )
}

export default Budgets;