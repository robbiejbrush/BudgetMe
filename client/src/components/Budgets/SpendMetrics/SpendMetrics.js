import React from 'react';
import styles from '../SpendMetrics/SpendMetrics.module.css';

const SpendMetrics = ({ metrics, formatCurrency }) => {
  const { typical, diff, isAbove } = metrics;

  return (
    <div className={styles.averagesDiv}>
      <div className={styles.typicalSpend}>
        <h2>{"Typical Spend:"}</h2>
        <h2 style={{ color: 'white' }}>
          ${formatCurrency(typical)}
        </h2>
      </div>

      <div className={styles.belowTypical}>
        <h2>{isAbove ? "Below Typical:" : "Over Typical:"}</h2>
        <h2 style={{ color: isAbove ? "#4caf50" : "#f44336" }}>
          ${formatCurrency(Math.abs(diff))}
        </h2>
      </div>
    </div>
  );
};

export default SpendMetrics;