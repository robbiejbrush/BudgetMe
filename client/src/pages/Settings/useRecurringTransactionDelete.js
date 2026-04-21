import { useState, useCallback } from 'react';
import axios from 'axios';

const useRecurringTransactionDelete = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const deleteRecurringTransaction = useCallback(async (recurringTransactionId, options = {}) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.delete(`http://localhost:3001/recurringTransactions/${recurringTransactionId}`, {
        headers: options.headers || {},
        data: options.body || null 
      });

      setSuccess(true);
      return response.data;
    } catch (err) {
      throw err; 
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteRecurringTransaction, loading, success };
};

export default useRecurringTransactionDelete;