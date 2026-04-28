import axios from 'axios';
import { useUserId } from '../../hooks/useAuth.js';
import { useCurrencies } from '../Settings/CurrencyContext.js';

export const useBudgetEdit = (setBudgets) => {
  const { rates, selectedCurrency } = useCurrencies();
  const userId = useUserId();

  const onEditSubmit = async (budgetId, values) => {
    //Convert to CAD for DB storing
    let amountInCAD = parseFloat(values.monthlyLimit);
    if (selectedCurrency !== 'CAD') {
        const rate = rates[selectedCurrency];
        if (rate && rate !== 0) {
            amountInCAD = amountInCAD / rate;
        }
    }

    const updatedData = {
      ...values,
      userId: userId,
      categoryId: parseInt(values.categoryId, 10),
      monthlyLimit: Number(amountInCAD.toFixed(2))
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