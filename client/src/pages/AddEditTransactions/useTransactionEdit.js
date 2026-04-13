import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserId } from '../../hooks/useAuth.js';

export const useEditTransaction = (transactionId) => {
  const navigate = useNavigate();
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
      
      if (response.status === 200) {
        navigate('/transactions'); 
      }
    } catch (error) {
      console.error('Update Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return { userId, onSubmit };
};