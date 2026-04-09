import { useState, useMemo } from 'react';

export const useTransactionFilter = (rawTransactions) => {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getUTCFullYear());

  const filteredTransactions = useMemo(() => {
    if (!rawTransactions.length) return [];

    return rawTransactions.filter(t => {
      const d = new Date(t.date);
      const yearMatch = d.getUTCFullYear() === parseInt(selectedYear);
      
      if (selectedMonth === "all") {
        return yearMatch;
      } else {
        return yearMatch && d.getUTCMonth() === parseInt(selectedMonth);
      }
    });
  }, [rawTransactions, selectedMonth, selectedYear]);

  return {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    filteredTransactions
  };
};