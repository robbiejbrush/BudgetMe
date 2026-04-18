import React from 'react';
import BudgetItem from '../BudgetItem/BudgetItem';
import styles from '../BudgetList/BudgetList.module.css';

function BudgetList({ 
  budgets, 
  rawCategories, 
  onEdit, 
  onDelete, 
  onAddSubmit, 
  formatCurrency 
}) {
  
  //Helper for the add Form dropdown
  const getUnusedForAdd = () => {
    return rawCategories.filter(cat => {
      const isAssigned = budgets.some(b => b.categoryId === cat.categoryId);
      const isIncome = cat.type === 'income';
      return !isAssigned && !isIncome;
    });
  };

  //Helper for each row's dropdown (must include the current category)
  const getUnusedForEdit = (currentCategoryId) => {
    return rawCategories.filter(cat => {
      const isAssigned = budgets.some(b => b.categoryId === cat.categoryId);
      const isIncome = cat.type === 'income';
      return (!isAssigned || cat.categoryId === currentCategoryId) && !isIncome;
    });
  };

  return (
    <div className={styles.budgetsListDiv}>
        <span className={styles.itemsHeading}>Category</span>
        <span className={styles.itemsHeading}>Monthly Limit</span>
        <span></span>
      <div className={styles.headerDivider}></div>

      {budgets.length === 0 ? (
        <div className="NoDataMessage">No budgets are set.</div>
      ) : (
        budgets.map((budget) => (
          <BudgetItem 
            key={budget.budgetId}
            budget={budget}
            categories={rawCategories}
            unusedCategories={getUnusedForEdit(budget.categoryId)}
            onEdit={onEdit}
            onDelete={onDelete}
            formatCurrency={formatCurrency}
          />
        ))
      )}

      <form id="BudgetAddForm" className={styles.addForm} onSubmit={onAddSubmit}>
        <select id="AddCategorySelect" className={styles.categorySelect} required>
          {getUnusedForAdd().map(cat => (
            <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
          ))}
        </select>
        <div className={styles.inputWrapper}>
          <span className={styles.currencySymbol}>$</span>
          <input type="number" id="AddAmountInput" className={styles.textInput} placeholder="Amount" step="0.01" required/>
        </div>
        <button type="submit" className={styles.addBtn} id="AddBtn">Add</button>
      </form>
    </div>
  );
}

export default BudgetList;