import React from 'react';
import '../CategoriesBreakdown/CategoriesBreakdown.css';

function CategoriesBreakdown({ categories }) {
  
    const sortedData = [...categories]
    .filter((cat) => cat.type?.toLowerCase() !== 'income')
    .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

    return (
        <div className= "BreakdownDiv">
          {sortedData.filter((cat) => cat.type?.toLowerCase() !== 'income').sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage)).map((cat) => (
            <div key={cat.categoryId} className="CategoryRow">
              <span className="Label">{cat.name}</span>
              
              <div className="BarBackground">
                <div 
                  className="BarFill" 
                  style={{ "--percent": `${parseFloat(cat.percentage)}%` }} 
                />
              </div>
              <span className="Percentage">{cat.percentage}%</span>
            </div>
          ))}
        </div>
  )
}

export default CategoriesBreakdown;