import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../css/Overview.css'
import ExpensesPieChart from '../components/ExpensesPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';

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
  const [totalIncome, setTotalIncome] = useState(0);
  const [net, setNet] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const [loading, setLoading] = useState(true);

  //Fetch all user's categories and transactions, calculate page data
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

        //Calculate total income
        const grandIncome = trans
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        //Sum transactions per category
        const totalsLookup = trans.filter(t => t.type === 'expense').reduce((acc, t) => {
          acc[t.categoryId] = (acc[t.categoryId] || 0) + parseFloat(t.amount);
          return acc;
        }, {});

        //Calculate total expenses
        const grandExpenses = Object.values(totalsLookup).reduce((sum, val) => sum + val, 0);

        //Map to final category objects with percentages, omit $0 totals
        const finalData = cats.map(cat => {
          const catTotal = totalsLookup[cat.categoryId] || 0;
          return {
            ...cat,
            total: catTotal,
            percentage: grandExpenses > 0 ? parseFloat(((catTotal / grandExpenses) * 100).toFixed(1)) : 0
          };
        }).filter(cat => cat.total > 0);

        //Calculate net
        const grandNet = grandIncome - grandExpenses;
        
        //Generate month and expense objects for bar graph
        //Initialize an array with all 12 months (ensures bars show even if $0)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const monthlyDataMap = monthNames.reduce((acc, month) => {
          acc[month] = 0;
          return acc;
        }, {});

        //Sum up expenses per month
        trans.filter(t => t.type === 'expense').forEach(t => {
          const date = new Date(t.date); // Assuming your DB has a 'date' field
          const month = monthNames[date.getMonth()];
          monthlyDataMap[month] += parseFloat(t.amount);
        });

        //Convert the map into the array Recharts needs
        const barChartData = monthNames.map(month => ({
          month: month,
          expenses: parseFloat(monthlyDataMap[month].toFixed(2))
        }));
        
        setMonthlyExpenses(barChartData); 
        setCategories(finalData);
        setTotalExpenses(grandExpenses);
        setTotalIncome(grandIncome);
        setNet(grandNet);
        setLoading(false);
      } catch (err) {
        console.error("Axios fetch error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div className= "LoadingText">Loading Data...</div>;

  console.log("Pie Data:", categories)

  return (
    <div>
      <h1 className= "OverviewHeading">Overview</h1>
      <div>
        <div className= "NetDiv">
          <h1 className= "IncomeText">
            Income: <span style= {{ color: 'orange' }}>${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </h1>
          <h1 className= "ExpensesText">
            Expenses: <span style= {{ color: 'orange' }}>${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </h1>
          <h1 className= "NetText">
            Net: <span style={{ color: net >= 0 ? 'green' : 'red' }}>
              ${net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </h1>
        </div>
        <div className= "GraphsDiv">
          <ExpensesPieChart data= { categories }/>
          <MonthlyBarChart data= { monthlyExpenses }/>
        </div>
        <div className= "BreakdownDiv">
          {categories.filter((cat) => cat.type?.toLowerCase() !== 'income').sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage)).map((cat) => (
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
      </div>
    </div>
  )
}

export default Overview;