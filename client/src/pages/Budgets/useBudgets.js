import { useState, useEffect } from 'react';
import axios from 'axios';

export const useBudgets = (userId) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:3001/budgets/${userId}`)
      .then(res => setBudgets(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  return { budgets, loading, setBudgets };
};