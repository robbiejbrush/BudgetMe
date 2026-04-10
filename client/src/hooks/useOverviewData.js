import { useState, useEffect } from 'react';
import { monthNamesShort } from '../utils/dateHelpers';
import { useTransactionFilter } from './useTransactionFilter';
import { useCategories } from './useCategories';
import { useTransactions } from './useTransactions';

export const useOverviewData = (userId) => {
      const [displayCategories, setDisplayCategories] = useState([]);    
      const [totalExpenses, setTotalExpenses] = useState(0);
      const [totalIncome, setTotalIncome] = useState(0);
      const [net, setNet] = useState(0);
      const [monthlyExpenses, setMonthlyExpenses] = useState([]);
      const {
        rawCategories,
        loading: categoriesLoading
      } = useCategories(userId);
      const {
        rawTransactions,
        loading: transactionsLoading
      } = useTransactions(userId);
      const {
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        filteredTransactions
      } = useTransactionFilter(rawTransactions);

      //Runs calculations on received data for displaying
        useEffect(() => {
            if (!rawTransactions.length) return;

            //Calculate total income
            const grandIncome = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            //Sum transactions per category
            const totalsLookup = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => {
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
        }, [rawTransactions, rawCategories, selectedMonth, selectedYear, filteredTransactions]);

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
        categoriesLoading,
        transactionsLoading
      }
}