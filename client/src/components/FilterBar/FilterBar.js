import React from 'react';
import styles from '../FilterBar/FilterBar.module.css'
import { monthNamesFull, getYearOptions } from '../../utils/dateHelpers';

const FilterBar = ({ 
  selectedMonth, setSelectedMonth, 
  selectedYear, setSelectedYear,
  selectedType, setSelectedType,
  selectedCategory, setSelectedCategory,
  categories = []
}) => {

  const yearOptions = getYearOptions(5); 

  return (
        <div className={styles.filterDiv}>
          <select 
            className={styles.monthSelect}
            value={selectedMonth} 
            onChange={(e) => {
              const val = e.target.value;
              setSelectedMonth(val === "all" ? "all" : parseInt(val));
            }}>
            <option value="all">All Months</option>
            {monthNamesFull.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>

          <select 
            className={styles.yearSelect}
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {setSelectedType && (
            <select 
              className={styles.typeSelect}
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          )}

          {setSelectedCategory && (
            <select 
              className={styles.categorySelect}
              value={selectedCategory} 
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(val === "all" ? "all" : parseInt(val))}
              }>
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
              ))}
            </select>
          )}
        </div>
  );
}

export default FilterBar;
