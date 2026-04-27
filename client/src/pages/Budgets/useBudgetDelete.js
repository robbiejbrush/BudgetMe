import { useState, useCallback } from 'react';
import axios from 'axios';

const useBudgetDelete = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const deleteBudget = useCallback(async (budgetId = {}) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.delete(`http://localhost:3001/budgets/${budgetId}`);

      setSuccess(true);
      return response.data;
    } catch (err) {
      throw err; 
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteBudget, loading, success };
};

export default useBudgetDelete;