import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCategories = (userId) => {
  const [rawCategories, setRawCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:3001/categories/${userId}`)
      .then(res => setRawCategories(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  return { rawCategories, loading };
};