import axios from 'axios';
import { useState } from 'react';
import { useCallback } from 'react';
import { useUserId } from './useAuth.js';
import { useCurrencies } from '../pages/Settings/CurrencyContext.js';

export const useTransactionEdit = (transactionId, { onSuccess } = {}) => {
  const { rates, selectedCurrency } = useCurrencies();
  const userId = useUserId();

  const onSubmit = async (values, { setSubmitting }) => {
    const t = values.transactions[0];
    
    //Convert to CAD for DB storing
    let amountInCAD = parseFloat(t.amount);
    if (selectedCurrency !== 'CAD') {
      const rate = rates[selectedCurrency];
      if (rate && rate !== 0) {
        amountInCAD = amountInCAD / rate;
      }
    }

    const updatedData = {
      ...t,
      userId: userId,
      categoryId: t.category ? parseInt(t.category, 10) : null,
      amount: Number(amountInCAD.toFixed(2))
    };
    
    try {
      const response = await axios.put(`https://budget-me-rbrush-4ea934ec5562.herokuapp.com/transactions/edit/${transactionId}`, updatedData);
      
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
        `https://budget-me-rbrush-4ea934ec5562.herokuapp.com/transactions/edit/${transactionId}`, 
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