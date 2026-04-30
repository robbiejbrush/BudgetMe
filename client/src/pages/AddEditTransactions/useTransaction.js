import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTransaction = (transactionId) => {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await axios.get(`https://budget-me-rbrush-4ea934ec5562.herokuapp.com/transactions/getOne/${transactionId}`);
                
                const data = response.data;
                const formattedData = {
                    ...data,
                    category: data.categoryId ? data.categoryId.toString() : ""
                };

                setTransaction(formattedData);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransaction();
    }, [transactionId]);

    return {transaction, loading};
}