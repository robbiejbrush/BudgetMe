import React from 'react';
import { formatCurrency } from '../../../utils/dateHelpers';
import styles from '../SummaryStats/SummaryStats.module.css';
import { useCurrencies } from '../../../pages/Settings/CurrencyContext';

function SummaryStats({ totalIncome, totalExpenses, net }) {
    const { convert } = useCurrencies();

    return (
        <div className= {styles.netDiv}>
          <h1 className= {styles.incomeText}>
            Income: <span style= {{ color: 'orange' }}>${formatCurrency(convert(totalIncome))}</span>
          </h1>
          <h1 className= {styles.expensesText}>
            Expenses: <span style= {{ color: 'orange' }}>${formatCurrency(convert(totalExpenses))}</span>
          </h1>
          <h1 className= {styles.netText}>
            Net: <span style={{ color: net >= 0 ? 'green' : 'red' }}>
              ${formatCurrency(convert(net))}
            </span>
          </h1>
        </div>
    )
}

export default SummaryStats;