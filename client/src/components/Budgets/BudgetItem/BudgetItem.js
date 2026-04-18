import React, { useState } from 'react';
import styles from '../BudgetItem/BudgetItem.module.css';

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
    <div className={styles.budgetItem}>
      {isEditing ? (
        <>
          <select 
            className={styles.categorySelect}
            value={editForm.categoryId}
            onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
          >
            {unusedCategories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
            ))}
          </select>

          <div className={styles.inputWrapper}>
            <span className={styles.currencySymbol}>$</span>
            <input 
              type="number" 
              className={styles.textInput}
              value={editForm.monthlyLimit}
              onChange={(e) => setEditForm({ ...editForm, monthlyLimit: e.target.value })}
            />
          </div>

          <div className={styles.actionsDiv}>
            <button className={styles.submitBtn} onClick={handleSubmit}>Submit</button>
            <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <span className={styles.itemSpan}>{category?.name || 'Unknown'}</span>
          <span className={styles.itemSpan}>${formatCurrency(budget.monthlyLimit)}</span>
          <div className={styles.actionsDiv}>
            <button onClick={() => setIsEditing(true)} className={styles.editBtn}>Edit</button>
            <button onClick={() => onDelete(budget.budgetId)} className={styles.deleteBtn}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default BudgetItem;