import React from 'react';
import { formatCurrency } from '../../../utils/dateHelpers';
import styles from '../SummaryStats/SummaryStats.module.css';
import { useCurrencies } from '../../../pages/Settings/CurrencyContext';

function SummaryStats({ totalIncome, totalExpenses, net }) {
    const { currencySymbol } = useCurrencies();

    return (
        <div className= {styles.netDiv}>
          <h1 className= {styles.incomeText}>
            Income: <span style= {{ color: 'orange' }}>{currencySymbol}{formatCurrency(totalIncome)}</span>
          </h1>
          <h1 className= {styles.expensesText}>
            Expenses: <span style= {{ color: 'orange' }}>{currencySymbol}{formatCurrency(totalExpenses)}</span>
          </h1>
          <h1 className= {styles.netText}>
            Net: <span style={{ color: net >= 0 ? 'green' : 'red' }}>
              {currencySymbol}{formatCurrency(net)}
            </span>
          </h1>
        </div>
    )
}

export default SummaryStats;