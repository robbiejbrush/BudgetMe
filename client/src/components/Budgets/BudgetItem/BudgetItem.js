import React, { useState } from 'react';
import styles from '../BudgetItem/BudgetItem.module.css';
import { useCurrencies } from '../../../pages/Settings/CurrencyContext';

function BudgetItem({ budget, categories, unusedCategories, onEdit, onDelete, formatCurrency }) {
  const { convert, currencySymbol } = useCurrencies();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ categoryId: budget.categoryId, monthlyLimit: budget.monthlyLimit });
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
            <span className={styles.currencySymbol}>{currencySymbol}</span>
            <input 
              type="number" 
              step="0.01"
              className={styles.textInput}
              value={Math.round(convert(editForm.monthlyLimit) * 100) / 100}
              onChange={(e) => setEditForm({ ...editForm, monthlyLimit: e.target.value })}
            />
          </div>

          <div className={styles.actionsDiv}>
            <button className={styles.submitBtn} onClick={() => {
              setEditForm({ ...editForm, monthlyLimit: budget.monthlyLimit });
              handleSubmit();
            }}>
              Submit
            </button>
            <button className={styles.cancelBtn} onClick={() => {
              setEditForm({ ...editForm, monthlyLimit: budget.monthlyLimit });
              setIsEditing(false);
            }}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span className={styles.itemSpan}>{category?.name || 'Unknown'}</span>
          <span className={styles.itemSpan}>{currencySymbol}{formatCurrency(convert(budget.monthlyLimit).toFixed(2))}</span>
          <div className={styles.actionsDiv}>
            <button onClick={() => {
              setEditForm({ 
                categoryId: budget.categoryId, 
                monthlyLimit: budget.monthlyLimit 
              });
              setIsEditing(true);
            }}
              className={styles.editBtn}>
              Edit
            </button>
            <button onClick={() => onDelete(budget.budgetId)} className={styles.deleteBtn}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default BudgetItem;