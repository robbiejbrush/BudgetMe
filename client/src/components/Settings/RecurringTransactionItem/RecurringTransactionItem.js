import styles from '../RecurringTransactionItem/RecurringTransactionItem.module.css';
import { formatCurrency } from '../../../utils/dateHelpers';
import useRecurringTransactionDelete from './useRecurringTransactionDelete';
import { validationSchema } from '../RecurringTransactionSchema';
import { useState } from 'react';
import { RecurringTransactionForm } from '../RecurringTransactionForm/RecurringTransactionForm';
import { useRecurringTransactionEdit } from '../../../hooks/useRecurringTransactionEdit';

export function RecurringTransactionItem({tx, categoryName, setRecurringTransactions, rawCategories}) {
    //Delete recurring transaction
    const {
        deleteRecurringTransaction,
        loading: recTransDeleteLoading
    } = useRecurringTransactionDelete();

    const handleDelete = async (recurringTransactionId) => {
        if (window.confirm("Are you sure you want to delete this recurring transaction?")) {
            try {
            await deleteRecurringTransaction(recurringTransactionId);

            setRecurringTransactions(prev => 
                prev.filter(tx => tx.recurringTransactionId !== recurringTransactionId)
            );
            } catch (err) {
            console.error("Failed to delete:", err);
            alert("Could not delete the transaction. Please try again.");
            }
        }
    };

    //Editing recurring transaction
    const [isEditing, setIsEditing] = useState(false);
    const { onEditSubmit } = useRecurringTransactionEdit(
        setRecurringTransactions,
        setIsEditing
    );
    const initialValues = {
        amountInput: tx.amount,
        typeSelect: tx.type,
        categorySelect: tx.categoryId,
        counterpartyInput: tx.counterparty,
        frequencySelect: tx.frequency,
        startDateInput: tx.startDate,
        endDateInput: tx.endDate || ''
    };

    return (
        <div className={styles.recTransItem}>
            {isEditing ? (
                <RecurringTransactionForm
                    initialValues={initialValues}
                    onSubmit={(values) => onEditSubmit(values, tx.recurringTransactionId)}
                    validationSchema={validationSchema}
                    onCancel={() => setIsEditing(false)}
                    rawCategories={rawCategories}
                    buttonText='Submit'
                />
            ) : (
                <>
                    <span className={`${styles.itemSpan} ${styles.amount}`}>${formatCurrency(tx.amount)}</span>
                    <span className={`${styles.itemSpan} ${styles.type}`}>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</span>
                    <span className={`${styles.itemSpan} ${styles.category}`}>{categoryName}</span>
                    <span className={`${styles.itemSpan} ${styles.counterparty}`}>{tx.counterparty}</span>
                    <span className={`${styles.itemSpan} ${styles.frequency}`}>{tx.frequency.charAt(0).toUpperCase() + tx.frequency.slice(1)}</span>
                    <span className={`${styles.itemSpan} ${styles.startDate}`}>{tx.startDate}</span>
                    <span className={`${styles.itemSpan} ${styles.endDate}`}>{tx.endDate || 'N/A'}</span>
                    <div className={styles.actionsDiv}>
                        <button 
                            className={styles.editBtn}
                            onClick={() => setIsEditing(true)}
                            >
                            Edit
                        </button>
                        <button 
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(tx.recurringTransactionId)}
                            disabled={recTransDeleteLoading}>
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}