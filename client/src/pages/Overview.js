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

  const [rawCategories, setRawCategories] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]);

  const [rawTransactions, setRawTransactions] = useState([]);

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [net, setNet] = useState(0);

  const [monthlyExpenses, setMonthlyExpenses] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getUTCFullYear());

  const [loading, setLoading] = useState(true);

  //Fetch all user's categories and transactions
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        //Get all user's transactions and categories
        const [catRes, transRes] = await Promise.all([
          axios.get(`http://localhost:3001/categories/${userId}`),
          axios.get(`http://localhost:3001/transactions/${userId}`)
        ]);

        setRawCategories(catRes.data);
        setRawTransactions(transRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Axios fetch error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  //Runs calculations on received data for displaying
  useEffect(() => {
    if (!rawTransactions.length) return;

    //Filter transactions for selected month/year
    const filteredTrans = rawTransactions.filter(t => {
      const d = new Date(t.date);
      const yearMatch = d.getUTCFullYear() === parseInt(selectedYear);
      
      if (selectedMonth === "all") {
        return yearMatch; 
      } else {
        return yearMatch && d.getUTCMonth() === parseInt(selectedMonth); 
      }
    });

    //Calculate total income
    const grandIncome = filteredTrans
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    //Sum transactions per category
    const totalsLookup = filteredTrans.filter(t => t.type === 'expense').reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

    //Calculate total expenses
    const grandExpenses = Object.values(totalsLookup).reduce((sum, val) => sum + val, 0);

    //Map to final category objects with percentages, omit $0 totals
    const finalData = rawCategories.map(cat => {
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
    rawTransactions.filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === parseInt(selectedYear)).forEach(t => {
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
    setDisplayCategories(finalData);
    setTotalExpenses(grandExpenses);
    setTotalIncome(grandIncome);
    setNet(grandNet);
  }, [rawTransactions, rawCategories, selectedMonth, selectedYear]);

  if (loading) return <div className= "LoadingText">
    <h2>Loading Data...</h2>
  </div>;

  console.log("Pie Data:", displayCategories)

  return (
    <div>
      <div className= "HeaderDiv">
        <div className= "BtnDiv">
          <select 
            className= "MonthSelect"
            value={selectedMonth} 
            onChange={(e) => {
              const val = e.target.value;
              setSelectedMonth(val === "all" ? "all" : parseInt(val));
            }}>
            <option value="all">All Months</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>

          <select 
            className= "YearSelect"
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
            {[new Date().getUTCFullYear() - 5,
              new Date().getUTCFullYear() - 4,
              new Date().getUTCFullYear() - 3, 
              new Date().getUTCFullYear() - 2, 
              new Date().getUTCFullYear() - 1, 
              new Date().getUTCFullYear()].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <h1 className= "OverviewHeading">Overview</h1>
        <div className= "EmptyDiv"/>
      </div>
      {displayCategories.length === 0 ? (
        <div className="NoDataMessage">
          <h2>There are no transactions for this time.</h2>
        </div>
      ) : (
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
          <ExpensesPieChart data= { displayCategories }/>
          <MonthlyBarChart data= { monthlyExpenses }/>
        </div>
        <div className= "BreakdownDiv">
          {displayCategories.filter((cat) => cat.type?.toLowerCase() !== 'income').sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage)).map((cat) => (
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
      )
      }
    </div>
  )
}

export default Overview;