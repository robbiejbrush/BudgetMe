import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../css/Overview.css'

function Overview() {
  //Get userId to fetch all user info
  let userId = null;
  const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
  if (token) {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
  }

  const [categories, setCategories] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  //Fetch all user's categories and transactions, return totals and perctantages
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        //Get all user's transactions and categories
        const [catRes, transRes] = await Promise.all([
          axios.get(`http://localhost:3001/categories/${userId}`),
          axios.get(`http://localhost:3001/transactions/${userId}`)
        ]);

        const cats = catRes.data;
        const trans = transRes.data;

        //Sum transactions per category
        const totalsLookup = trans.filter(t => t.type === 'expense').reduce((acc, t) => {
          acc[t.categoryId] = (acc[t.categoryId] || 0) + parseFloat(t.amount);
          return acc;
        }, {});

        //Calculate grand total
        const grandTotal = Object.values(totalsLookup).reduce((sum, val) => sum + val, 0);

        //Map to final category objects with percentages
        const finalData = cats.map(cat => {
          const catTotal = totalsLookup[cat.categoryId] || 0;
          return {
            ...cat,
            total: catTotal,
            percentage: grandTotal > 0 ? ((catTotal / grandTotal) * 100).toFixed(1) : 0
          };
        });

        setCategories(finalData);
        setTotalExpenses(grandTotal);
        setLoading(false);
      } catch (err) {
        console.error("Axios fetch error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div>Loading Data...</div>;

  return (
    <div>
      <h1 className= "OverviewHeading">Overview</h1>
      <div>
        <div className= "NetDiv">
          <h1 className= "IncomeText">Income: $xxxx.xx</h1>
          <h1 className= "ExpensesText">Expenses: ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
          <h1 className= "NetText">Net: $xxx.xx</h1>
        </div>
        <div className= "BreakdownDiv">
          {categories.filter((cat) => cat.type?.toLowerCase() !== 'income').sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage)).map((cat) => (
            <div key={cat.categoryId} className="CategoryRow">
              <span className="Label">{cat.name}</span>
              
              <div className="BarBackground">
                <div 
                  className="BarFill" 
                  style={{ "--percent": `${cat.percentage}%` }} 
                />
              </div>
              <span className="Percentage">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Overview;