import React from 'react';
import '../../css/Overview.css'
import { monthNamesFull, getYearOptions } from '../../utils/dateHelpers';

const FilterBar = ({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear}) => {

  const yearOptions = getYearOptions(5); 

  return (
        <div className= "FilterDiv">
          <select 
            className= "MonthSelect"
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
            className= "YearSelect"
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
  );
}

export default FilterBar;
