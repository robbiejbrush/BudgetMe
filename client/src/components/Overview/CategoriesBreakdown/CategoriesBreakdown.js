import React from 'react';
import styles from '../CategoriesBreakdown/CategoriesBreakdown.module.css';

function CategoriesBreakdown({ categories }) {
  
    const sortedData = [...categories]
    .filter((cat) => cat.type?.toLowerCase() !== 'income')
    .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

    return (
        <div className= {styles.breakdownDiv}>
          {sortedData.filter((cat) => cat.type?.toLowerCase() !== 'income').sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage)).map((cat) => (
            <div key={cat.categoryId} className={styles.categoryRow}>
              <span className={styles.label}>{cat.name}</span>
              
              <div className={styles.barBackground}>
                <div 
                  className={styles.barFill} 
                  style={{ "--percent": `${parseFloat(cat.percentage)}%` }} 
                />
              </div>
              <span className={styles.percentage}>{cat.percentage}%</span>
            </div>
          ))}
        </div>
  )
}

export default CategoriesBreakdown;