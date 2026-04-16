import axios from 'axios';
import { useUserId } from '../../hooks/useAuth.js';

export const useBudgetEdit = (budgetId, setBudgets) => {
  const userId = useUserId();

  const onEditSubmit = async (values) => {
    
    const updatedData = {
      ...values,
      userId: userId,
      categoryId: parseInt(values.categoryId, 10)
    };
    
    try {
      const response = await axios.put(`http://localhost:3001/budgets/edit/${budgetId}`, updatedData);
      
      if (response.status === 200) {
        // Update the local list state
        setBudgets(prev => prev.map(b => 
          b.budgetId === budgetId ? { ...b, ...updatedData } : b
        ));
        return true;
      }
    } catch (error) {
      console.error('Update Error:', error);
    }
  };

  return { onEditSubmit };
};