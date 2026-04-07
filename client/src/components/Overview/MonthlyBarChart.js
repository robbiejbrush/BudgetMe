import React from 'react';
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const CustomToolTip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return ( 
      <div style={{
        backgroundColor: '#1b1919',
        padding: '10px',
        border: '1px solid orange',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: 'orange' }}>{data.name}</p>
        <p style={{ margin: 0 }}>Amount: ${data.expenses.toLocaleString(undefined, {
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
  if (!data || data.length === 0) return null;

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
                width={ 80 }
                tick={{ fill: 'white', fontSize: 14, fontFamily: 'Outfit' }} 
                stroke="white" 
                tickFormatter={(value) => `$${value.toLocaleString(undefined, {
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