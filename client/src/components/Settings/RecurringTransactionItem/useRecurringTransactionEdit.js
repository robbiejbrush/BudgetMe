import axios from 'axios';

export const useRecurringTransactionEdit = (setRecurringTransactions, setIsEditing) => {

    const onEditSubmit = async (values, recurringTransactionId) => {
        const submissionData = {
            type: values.typeSelect,
            amount: values.amountInput,
            counterparty: values.counterpartyInput,
            frequency: values.frequencySelect,
            startDate: values.startDateInput,
            endDate: values.endDateInput.trim() || null,
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
                            amount: values.amountInput,
                            type: values.typeSelect,
                            categoryId: values.categorySelect,
                            counterparty: values.counterpartyInput,
                            frequency: values.frequencySelect,
                            startDate: values.startDateInput,
                            endDate: values.endDateInput
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