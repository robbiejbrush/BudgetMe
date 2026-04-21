import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '8bcf2b842b418aef97df2f2292e0cf83';
const BASE_URL = 'https://fixer.io';

export const useExchangeRates = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}?access_key=${API_KEY}`);
        
        if (response.data.success) {
          setRates(response.data.rates);
        } else {
          setError(response.data.error.info || 'Failed to fetch rates.');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { rates, loading, error };
};