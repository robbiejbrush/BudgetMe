import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import styles from '../Settings/Settings.module.css';
import { useCategories } from '../../hooks/useCategories';
import { useUserId } from '../../hooks/useAuth';

function Settings() {
  const userId = useUserId();
  const {
    rawCategories,
    loading
  } = useCategories(userId);

  const filteredCategories = rawCategories.filter(category => 
    !['Other (Income)', 'Other (Expense)', 'Uncategorized (Income)', 'Uncategorized (Expense)'].includes(category.name)
  );
  
  if (loading) return <div className= "LoadingText">Loading data...</div>;

  return (
    <div>
      <PageHeader
        title= "Settings"
      />
      <h2 className={styles.categoriesHeader}>Edit Categories</h2>
      <div className={styles.categoriesListDiv}>
        <span className={styles.itemsHeading}>Name</span>
        <span className={styles.itemsHeading}>Type</span>
        <span></span>

        <div className={styles.headerDivider}></div>

        {filteredCategories.length === 0 ? (
          <div className="NoDataMessage">No categories are set.</div>
        ) : (
          filteredCategories.map((category) => (
            <div className={styles.categoryItem}>
              <span className={styles.itemSpan}>{category?.name || 'Unknown'}</span>
              <span className={styles.itemSpan}>{category?.type.charAt(0).toUpperCase() + category?.type.slice(1) || 'Unknown'}</span>
              <button onClick={""} className={styles.deleteBtn}>Delete</button>
            </div>      
          ))
        )}

        <input 
          className={styles.textInput}
          value={""}
          onChange={""}
        />
        <select id="CategorySelect" className={styles.typeSelect} required>
          <option key="income" value="income">Income</option>
          <option key="expense" value="expense">Expense</option>  
        </select>
        <button className={styles.addBtn} onClick={""}>Add</button>
      </div>
    </div>
  )
}

export default Settings;