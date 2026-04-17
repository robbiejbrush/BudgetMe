import React, { useState } from 'react';
import '../BudgetItem/BudgetItem.css';

function BudgetItem({ budget, categories, unusedCategories, onEdit, onDelete, formatCurrency }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ 
    categoryId: budget.categoryId, 
    monthlyLimit: budget.monthlyLimit 
  });

  const category = categories.find(cat => cat.categoryId === budget.categoryId);

  const handleSubmit = async () => {
    const success = await onEdit(budget.budgetId, editForm);
    if (success) setIsEditing(false);
  };

  return (
    <div className="BudgetItem">
      {isEditing ? (
        <>
          <select 
            className="EditCategorySelect"
            value={editForm.categoryId}
            onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
          >
            {unusedCategories.map(cat => (
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
            <button className="EditSubmitBtn" onClick={handleSubmit}>Submit</button>
            <button className="EditCancelBtn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <span className="BudgetItemSpan">{category?.name || 'Unknown'}</span>
          <span className="BudgetItemSpan">${formatCurrency(budget.monthlyLimit)}</span>
          <div className="EditActions">
            <button onClick={() => setIsEditing(true)} className="EditBtn">Edit</button>
            <button onClick={() => onDelete(budget.budgetId)} className="DeleteBtn">Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default BudgetItem;