import axios from 'axios';
import { useUserId } from '../../../hooks/useAuth.js';
import { startOfToday, addWeeks, addMonths, parseISO, isBefore } from 'date-fns';

export const useRecurringTransactionAdd = (setRecurringTransactions, rawCategories) => {
    const userId = useUserId();

    const onAddSubmit = async (values, { resetForm }) => {
        const { amountInput, typeSelect, categorySelect, counterpartyInput, frequencySelect, startDateInput, endDateInput } = values;
        const endDate = endDateInput?.trim() || null;

        const startDate = parseISO(startDateInput);
        const today = startOfToday();
        let nextChargeDate = startDate;

        if (isBefore(startDate, today)) {
            let tempDate = startDate;

            while (isBefore(tempDate, today)) {
                if (frequencySelect === 'weekly') {
                    tempDate = addWeeks(tempDate, 1);
                } else if (frequencySelect === 'biweekly') {
                    tempDate = addWeeks(tempDate, 2);
                } else if (frequencySelect === 'monthly') {
                    tempDate = addMonths(tempDate, 1);
                }
            }
            nextChargeDate = tempDate;
        } else {
            nextChargeDate = startDate;
        }

        try {
            const response = await axios.post('http://localhost:3001/recurringTransactions/create', {
                userId,
                amount: parseFloat(amountInput),
                type: typeSelect,
                categoryId: parseInt(categorySelect, 10),
                counterparty: counterpartyInput,
                frequency: frequencySelect,
                startDate: startDate,
                endDate: endDate,
                nextChargeDate: nextChargeDate,
                lastChargedDate: null
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