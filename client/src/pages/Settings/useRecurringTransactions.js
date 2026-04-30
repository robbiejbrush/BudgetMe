import { useState, useEffect } from 'react';
import axios from 'axios';

export const useRecurringTransactions = (userId) => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`https://budget-me-rbrush-4ea934ec5562.herokuapp.com/recurringTransactions/getAll/${userId}`)
      .then(res => setRecurringTransactions(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  return { recurringTransactions, loading, setRecurringTransactions };
};