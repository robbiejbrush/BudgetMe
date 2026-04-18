import React from 'react';
import { PieChart, Pie, Tooltip, Sector, ResponsiveContainer } from 'recharts';

const colours = ['orange', 'black', 'white'];

const renderSlice = (props) => {
  const { index, ...others } = props;
  return <Sector {...others} fill={colours[index % colours.length]} />;
};

const CustomToolTip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'var(--background-color)',
        padding: '10px',
        border: '1px solid orange',
        borderRadius: '8px',
        color: 'var(--third-color)',
        fontFamily: 'var(--font-main)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--primary-color)' }}>{data.name}</p>
        <p style={{ margin: 0 }}>Amount: ${data.total.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
        }</p>
        <p style={{ margin: 0 }}>Share: {data.percentage}%</p>
      </div>
    );
  }

  return null;
};

const ExpensesPieChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Sort data: largest percentage to smallest
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%" minWidth="400px">
        <PieChart>
          <Pie 
            data={sortedData} 
            dataKey="percentage" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={178}
            shape={renderSlice} 
            startAngle={90}    
            endAngle={-270}
          />
          <Tooltip content={ <CustomToolTip/> }/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensesPieChart;