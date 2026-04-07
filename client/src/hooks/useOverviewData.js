import { useState, useEffect } from 'react';
import axios from 'axios';
import { monthNamesShort } from '../utils/dateHelpers';

export const useOverviewData = (userId) => {
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
            const monthlyDataMap = monthNamesShort.reduce((acc, month) => {
            acc[month] = 0;
            return acc;
            }, {});

            //Sum up expenses per month
            rawTransactions.filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === parseInt(selectedYear)).forEach(t => {
            const date = new Date(t.date); // Assuming your DB has a 'date' field
            const month = monthNamesShort[date.getMonth()];
            monthlyDataMap[month] += parseFloat(t.amount);
            });

            //Convert the map into the array Recharts needs
            const barChartData = monthNamesShort.map(month => ({
            month: month,
            expenses: parseFloat(monthlyDataMap[month].toFixed(2))
            }));
                
            setMonthlyExpenses(barChartData); 
            setDisplayCategories(finalData);
            setTotalExpenses(grandExpenses);
            setTotalIncome(grandIncome);
            setNet(grandNet);
        }, [rawTransactions, rawCategories, selectedMonth, selectedYear]);

      return {
        displayCategories,
        totalExpenses,
        totalIncome,
        net,
        monthlyExpenses,
        selectedMonth,    
        setSelectedMonth, 
        selectedYear,    
        setSelectedYear,
        loading
      }
}