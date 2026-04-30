import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTransactions = (userId) => {
  const [rawTransactions, setRawTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`https://budget-me-rbrush-4ea934ec5562.herokuapp.com/transactions/getAll/${userId}`)
      .then(res => setRawTransactions(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  return { rawTransactions, loading, setRawTransactions };
};