import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUserData = (userId) => {
  const [rawCategories, setRawCategories] = useState([]);
  const [rawTransactions, setRawTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, transRes] = await Promise.all([
          axios.get(`http://localhost:3001/categories/${userId}`),
          axios.get(`http://localhost:3001/transactions/${userId}`)
        ]);

        setRawCategories(catRes.data);
        setRawTransactions(transRes.data);
      } catch (err) {
        console.error("Axios fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { rawCategories, rawTransactions, loading, error };
};