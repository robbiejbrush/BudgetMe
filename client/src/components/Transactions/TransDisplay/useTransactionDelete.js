import { useState, useCallback } from 'react';
import axios from 'axios';

const useTransactionDelete = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const deleteTransaction = useCallback(async (transactionId = {}) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.delete(`https://budget-me-rbrush-4ea934ec5562.herokuapp.com/transactions/${transactionId}`);

      setSuccess(true);
      return response.data;
    } catch (err) {
      throw err; 
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTransaction, loading, success };
};

export default useTransactionDelete;