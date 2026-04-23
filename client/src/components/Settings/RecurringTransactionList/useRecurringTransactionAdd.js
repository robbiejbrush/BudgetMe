import axios from 'axios';
import { useUserId } from '../../../hooks/useAuth.js'

export const useRecurringTransactionAdd = (setRecurringTransactions, rawCategories) => {
    const userId = useUserId();

    const onAddSubmit = async (values, { resetForm }) => {
        const { amountInput, typeSelect, categorySelect, counterpartyInput, frequencySelect, startDateInput, endDateInput } = values;
        const endDate = endDateInput?.trim() || null;

        try {
            const response = await axios.post('http://localhost:3001/recurringTransactions/create', {
                userId,
                amount: parseFloat(amountInput),
                type: typeSelect,
                categoryId: parseInt(categorySelect, 10),
                counterparty: counterpartyInput,
                frequency: frequencySelect,
                startDate: startDateInput,
                endDate: endDate
            });
            
            if (response.status === 200 || response.status === 201) {
                setRecurringTransactions(prev => {
                    const updatedList = [...prev, response.data];

                    updatedList.sort((a, b) => {
                        const dateA = new Date(a.startDate);
                        const dateB = new Date(b.startDate);

                        return dateA - dateB; 
                    });
                    return updatedList; 
                });
                resetForm();
            }
        } catch (error) {
            console.error('Add Recurring Transaction Error:', error);
        }
    };

    return {
        onAddSubmit
    };
};