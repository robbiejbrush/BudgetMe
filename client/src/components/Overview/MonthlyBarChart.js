import React from 'react';
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useCurrencies } from '../../pages/Settings/CurrencyContext';

const CustomToolTip = ({ active, payload }) => {
  const { currencySymbol } = useCurrencies();

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return ( 
      <div style={{
        backgroundColor: 'var(--background-color)',
        padding: '10px',
        border: '1px solid var(--primary-color)',
        borderRadius: '8px',
        color: 'var(--third-color)',
        fontFamily: 'var(--font-main)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--primary-color)' }}>{data.name}</p>
        <p style={{ margin: 0 }}>Amount: {currencySymbol}{data.expenses.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
        }</p>
      </div>
    );
  }

  return null;
};

const MonthlyBarChart = ({ data }) => {
  const { currencySymbol } = useCurrencies();

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.expenses));
  const dynamicWidth = maxVal.toLocaleString().length * 10;

  return (
    <div style={{ width: '100%', height: '100%', minWidth: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data= { data }>
            <XAxis 
                dataKey="month"
                tick={{ fill: 'white', fontSize: 14, fontFamily: 'Outfit' }} 
                stroke="white"
            />
            <YAxis 
                width={ dynamicWidth }
                tick={{ fill: 'white', fontSize: 14, fontFamily: 'Outfit' }} 
                stroke="white" 
                tickFormatter={(value) => `${currencySymbol}${value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
                }`}
            />
            <Bar  
                dataKey="expenses"
                fill="orange"
            />
            <Tooltip content={ <CustomToolTip/> }/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;