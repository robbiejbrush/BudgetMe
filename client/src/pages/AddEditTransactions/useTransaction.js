import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTransaction = (transactionId) => {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/transactions/getOne/${transactionId}`);
                
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