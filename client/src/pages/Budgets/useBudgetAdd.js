import axios from 'axios';
import { useUserId } from '../../hooks/useAuth.js'

export const useBudgetAdd = (setBudgets) => {
    const userId = useUserId();

    const onAddSubmit = async (e) => {
        const categoryId = e.target.elements.AddCategorySelect.value;
        const monthlyLimit = e.target.elements.AddAmountInput.value;
    
        try {
        const response = await axios.post('http://localhost:3001/budgets/create', {
            userId,
            categoryId: parseInt(categoryId, 10),
            monthlyLimit: parseFloat(monthlyLimit)
        });
        
        if (response.status === 200 || response.status === 201) {
            setBudgets(prev => [...prev, response.data]);
        e.target.reset();
        }
        } catch (error) {
            console.error('Add Budget Error:', error);
        }
    };

    return {
        onAddSubmit
    };
};