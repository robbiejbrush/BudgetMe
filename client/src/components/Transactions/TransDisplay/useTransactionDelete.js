import { useState, useCallback } from 'react';
import axios from 'axios';

const useTransactionDelete = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const deleteTransaction = useCallback(async (transactionId, options = {}) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.delete(`http://localhost:3001/transactions/${transactionId}`, {
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

  return { deleteTransaction, loading, success };
};

export default useTransactionDelete;