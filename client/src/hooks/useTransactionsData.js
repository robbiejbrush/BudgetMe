import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTransactionsData = (userId) => {
    const [rawCategories, setRawCategories] = useState([]);
    const [rawTransactions, setRawTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    //Fetch all user's categories and transactions
      useEffect(() => {
        if (!userId) return;
    
        const fetchData = async () => {
          try {
            //Get all user's transactions and categories
            const [catRes, transRes] = await Promise.all([
              axios.get(`http://localhost:3001/categories/${userId}`),
              axios.get(`http://localhost:3001/transactions/${userId}`)
            ]);
    
            setRawCategories(catRes.data);
            setRawTransactions(transRes.data);
    
            setLoading(false);
          } catch (err) {
            console.error("Axios fetch error:", err);
            setLoading(false);
          }
        };
        fetchData();
      }, [userId]);

      return {
        rawCategories,
        rawTransactions,
        loading
      }
}