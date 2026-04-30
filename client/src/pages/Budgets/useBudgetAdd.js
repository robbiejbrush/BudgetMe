import axios from 'axios';
import { useUserId } from '../../hooks/useAuth.js'
import { useCurrencies } from '../Settings/CurrencyContext.js';

export const useBudgetAdd = (setBudgets) => {
    const { rates, selectedCurrency } = useCurrencies();
    const userId = useUserId();

    const onAddSubmit = async (e) => {
        const categoryId = e.target.elements.AddCategorySelect.value;
        const monthlyLimit = e.target.elements.AddAmountInput.value;
        
        //Convert to CAD for DB storing
        let amountInCAD = parseFloat(monthlyLimit);
        if (selectedCurrency !== 'CAD') {
            const rate = rates[selectedCurrency];
            if (rate && rate !== 0) {
                amountInCAD = amountInCAD / rate;
            }
        }

        try {
        const response = await axios.post('https://budget-me-rbrush-4ea934ec5562.herokuapp.com/budgets/create', {
            userId,
            categoryId: parseInt(categoryId, 10),
            monthlyLimit: Number(amountInCAD.toFixed(2))
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