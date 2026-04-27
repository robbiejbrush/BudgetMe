import axios from 'axios';
import { useState } from 'react';
import { useCallback } from 'react';
import { useUserId } from './useAuth.js';

export const useTransactionEdit = (transactionId, { onSuccess } = {}) => {
  const userId = useUserId();

  const onSubmit = async (values, { setSubmitting }) => {
    const t = values.transactions[0];
    
    const updatedData = {
      ...t,
      userId: userId,
      categoryId: t.category ? parseInt(t.category, 10) : null
    };
    
    try {
      const response = await axios.put(`http://localhost:3001/transactions/edit/${transactionId}`, updatedData);
      
      if (response.status === 200 && onSuccess) {
        onSuccess(response.data); 
      }
    } catch (error) {
      console.error('Update Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return { userId, onSubmit };
};

export const useTransactionUpdate = () => {
  const [loading, setLoading] = useState(false);

  const updateTransaction = useCallback(async (transactionId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3001/transactions/edit/${transactionId}`, 
        updatedData
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update transaction.";
      
      console.error("Transaction Update Error:", error);
      alert(errorMessage); 
      
      throw error; 
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTransaction, loading };
};