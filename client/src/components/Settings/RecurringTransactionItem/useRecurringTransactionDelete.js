import { useState, useCallback } from 'react';
import axios from 'axios';

const useRecurringTransactionDelete = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const deleteRecurringTransaction = useCallback(async (recurringTransactionId = {}) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.delete(`https://budget-me-rbrush-4ea934ec5562.herokuapp.com/recurringTransactions/${recurringTransactionId}`);

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