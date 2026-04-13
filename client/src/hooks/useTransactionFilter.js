import { useState, useMemo } from 'react';

export const useTransactionFilter = (rawTransactions) => {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getUTCFullYear());
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTransactions = useMemo(() => {
    if (!rawTransactions.length) return [];

    return rawTransactions.filter(t => {
      const [year, month] = t.date.split('-').map(Number);
      const transactionMonth = month - 1; 

      const yearMatch = year === parseInt(selectedYear);
      const monthMatch = selectedMonth === "all" || transactionMonth === parseInt(selectedMonth);
      
      const typeMatch = selectedType === "all" || t.type === selectedType;
      
      const categoryMatch = selectedCategory === "all" || t.categoryId === selectedCategory;

      return yearMatch && monthMatch && typeMatch && categoryMatch;
    });
  }, [rawTransactions, selectedMonth, selectedYear, selectedType, selectedCategory]);

  return {
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    selectedType, setSelectedType,
    selectedCategory, setSelectedCategory,
    filteredTransactions
  };
};