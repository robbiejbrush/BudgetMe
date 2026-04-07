import React from 'react';
import '../../css/Overview.css'

const FilterBar = ({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear}) => {

  const currentYear = new Date().getUTCFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4, currentYear - 5];  

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

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
            {monthNames.map((m, i) => (
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
