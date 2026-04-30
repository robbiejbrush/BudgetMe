import { useState, useEffect } from 'react';
import axios from 'axios';

export const useBudgets = (userId) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`https://budget-me-rbrush-4ea934ec5562.herokuapp.com/budgets/${userId}`)
      .then(res => setBudgets(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  return { budgets, loading, setBudgets };
};