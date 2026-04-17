import React from 'react';
import '../SpendMetrics/SpendMetrics.css';

const SpendMetrics = ({ metrics, formatCurrency }) => {
  const { typical, diff, isAbove } = metrics;

  return (
    <div className="AveragesDiv">
      <div className="TypicalSpend">
        <h2>{"Typical Spend:"}</h2>
        <h2 style={{ color: 'white' }}>
          ${formatCurrency(typical)}
        </h2>
      </div>

      <div className="BelowTypical">
        <h2>{isAbove ? "Below Typical:" : "Over Typical:"}</h2>
        <h2 style={{ color: isAbove ? "#4caf50" : "#f44336" }}>
          ${formatCurrency(Math.abs(diff))}
        </h2>
      </div>
    </div>
  );
};

export default SpendMetrics;