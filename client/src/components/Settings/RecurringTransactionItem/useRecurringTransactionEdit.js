import axios from 'axios';
import { addWeeks, addMonths, isToday, parseISO, isBefore } from 'date-fns';

export const useRecurringTransactionEdit = (setRecurringTransactions, setIsEditing) => {

    const onEditSubmit = async (values, recurringTransactionId) => {
        
        const startDate = parseISO(values.startDateInput);
        const today = new Date();
        let nextChargeDate = startDate;

        if (isToday(startDate) || isBefore(startDate, today)) {
            let tempDate = startDate;
            while (isBefore(tempDate, today) || isToday(tempDate)) {
                if (values.frequencySelect === 'weekly') tempDate = addWeeks(tempDate, 1);
                else if (values.frequencySelect === 'biweekly') tempDate = addWeeks(tempDate, 2);
                else if (values.frequencySelect === 'monthly') tempDate = addMonths(tempDate, 1);
            }
            nextChargeDate = tempDate;
        } else {
            nextChargeDate = startDate;
        }
        
        const submissionData = {
            type: values.typeSelect,
            amount: values.amountInput,
            counterparty: values.counterpartyInput,
            frequency: values.frequencySelect,
            startDate: values.startDateInput,
            endDate: values.endDateInput.trim() || null,
            nextChargeDate: nextChargeDate.toISOString,
            lastChargedDate: null,
            categoryId: values.categorySelect
        };
        
        try {
            await axios.put(`http://localhost:3001/recurringTransactions/edit/${recurringTransactionId}`, submissionData);

            setRecurringTransactions(prev => {
                const updatedList = prev.map(item => {
                    if (item.recurringTransactionId === recurringTransactionId) {
                        //Merge the existing item with the new values
                        return {
                            ...item,
                            ...submissionData
                        };
                    }
                    return item;
                });
                return updatedList.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            });

            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update transaction:", error);
        }
    };

    return { onEditSubmit };
};