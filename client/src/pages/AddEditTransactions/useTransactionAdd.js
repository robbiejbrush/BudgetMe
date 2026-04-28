import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserId } from '../../hooks/useAuth.js'
import { useCurrencies } from '../Settings/CurrencyContext.js';

export const useTransactionAdd = () => {
  const { rates, selectedCurrency } = useCurrencies();
  const navigate = useNavigate();
  const userId = useUserId();

  const onSubmit = async (values, { setSubmitting }) => {
    const transactionsWithUser = values.transactions.map(t => {
      //Convert to CAD for DB storing
      let amountInCAD = parseFloat(t.amount);
      if (selectedCurrency !== 'CAD') {
        const rate = rates[selectedCurrency];
        if (rate && rate !== 0) {
          amountInCAD = amountInCAD / rate;
        }
      }

      return{
        ...t,
        userId: userId,
        categoryId: t.category ? parseInt(t.category, 10) : null,
        amount: Number(amountInCAD.toFixed(2))
      }
    });
    
    try {
      const response = await axios.post('http://localhost:3001/transactions/create', {
        transactions: transactionsWithUser
      });
      
      if (response.status === 200 || response.status === 201) {
        navigate('/transactions'); 
      }
    } catch (error) {
      console.error('Submission Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCountChange = (e, values, setFieldValue, emptyTransaction) => {
    const count = parseInt(e.target.value) || 1;
    const currentTransactions = [...values.transactions];
    
    const newTransactions = Array.from({ length: count }, (_, i) => {
      return currentTransactions[i] || { ...emptyTransaction };
    });
    
    setFieldValue("transactions", newTransactions);
  };

  return {
    userId,
    onSubmit,
    handleCountChange
  };
};