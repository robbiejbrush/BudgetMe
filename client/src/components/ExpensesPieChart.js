import React from 'react';
import { PieChart, Pie, Tooltip, Sector, ResponsiveContainer } from 'recharts';

const COLORS = ['orange', 'black', 'white'];

const renderSlice = (props) => {
  const { index, ...others } = props;
  return <Sector {...others} fill={COLORS[index % COLORS.length]} />;
};

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
        <p style={{ margin: 0 }}>Amount: ${data.total.toLocaleString()}</p>
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
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={sortedData} 
            dataKey="percentage" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={180}
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