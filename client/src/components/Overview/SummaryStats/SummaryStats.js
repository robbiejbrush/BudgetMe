import React from 'react';
import { formatCurrency } from '../../../utils/dateHelpers';
import '../SummaryStats/SummaryStats.css';

function SummaryStats({ totalIncome, totalExpenses, net }) {

    return (
        <div className= "NetDiv">
          <h1 className= "IncomeText">
            Income: <span style= {{ color: 'orange' }}>${formatCurrency(totalIncome)}</span>
          </h1>
          <h1 className= "ExpensesText">
            Expenses: <span style= {{ color: 'orange' }}>${formatCurrency(totalExpenses)}</span>
          </h1>
          <h1 className= "NetText">
            Net: <span style={{ color: net >= 0 ? 'green' : 'red' }}>
              ${formatCurrency(net)}
            </span>
          </h1>
        </div>
    )
}

export default SummaryStats;