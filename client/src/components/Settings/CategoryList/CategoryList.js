import { CategoryForm } from '../CategoryForm/CategoryForm';
import { useCategoryAdd } from './useCategoryAdd';
import useCategoryDelete from './useCategoryDelete';
import { useTransactionUpdate } from '../../../hooks/useTransactionEdit';
import styles from './CategoryList.module.css';
import { useRecurringTransactionUpdate } from '../../../hooks/useRecurringTransactionEdit';
import { useUserId } from '../../../hooks/useAuth';

export function CategoryList({
    rawCategories,
    setRawCategories,
    recurringTransactions,
    setRecurringTransactions,
    rawTransactions,
    loading
}) {
    const userId = useUserId();

    const { addCategory, loading: addLoading } = useCategoryAdd(userId, setRawCategories);
    const { deleteCategory, loading: deleteLoading } = useCategoryDelete();
    const { updateTransaction } = useTransactionUpdate();
    const { updateRecurringTransaction } = useRecurringTransactionUpdate();

    const handleDelete = async (categoryId, categoryType) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (!confirmed) return;
        
        try {
            //Find transactions belonging to this category
            const affectedTransactions = rawTransactions.filter(t => t.categoryId === categoryId);
            
            //If there are transactions for that category
            if (affectedTransactions.length > 0) {
                //Figure out whether to update category to Other (Income) or Other (Expense)
                const otherIncomeId = 166; 
                const otherExpenseId = 183;
                const targetId = categoryType === 'income' ? otherIncomeId : otherExpenseId;

                //Update each transaction
                await Promise.all(affectedTransactions.map(t => 
                    updateTransaction(t.transactionId, { ...t, categoryId: targetId })
                ));
                
                //Updates the recurring transactions state
                setRecurringTransactions(prev => prev.map(t => 
                    t.categoryId === categoryId ? { ...t, categoryId: targetId } : t
                ));
            }

            //Find recurring transactions belonging to this category
            const affectedRecTransactions = recurringTransactions.filter(t => t.categoryId === categoryId);
            
            //If there are recurring transactions for that category
            if (affectedRecTransactions.length > 0) {
                //Figure out whether to update category to Other (Income) or Other (Expense)
                const otherIncomeId = 166; 
                const otherExpenseId = 183;
                const targetId = categoryType === 'income' ? otherIncomeId : otherExpenseId;

                //Update each recurring transaction
                await Promise.all(affectedRecTransactions.map(t => 
                    updateRecurringTransaction(t.recurringTransactionId, { ...t, categoryId: targetId })
                ));
            }

            //Delete the category
            await deleteCategory(categoryId);
            setRawCategories((prev) => prev.filter(cat => cat.categoryId !== categoryId));
        } catch (err) {
            console.error("Failed to delete category:", err);
            alert("Could not delete category. Please try again.");
        }
    };

    //Filter for non default categories (userId != null)
    const filteredUserCategories = rawCategories.filter(category => 
        category.userId === userId
    );
    
    if (addLoading || deleteLoading || loading) return <div className= "LoadingText">Loading data...</div>;

    return (
        <div className={styles.categoriesListDiv}>
            <span className={styles.itemsHeading}>Name</span>
            <span className={styles.itemsHeading}>Type</span>
            <span></span>

            <div className={styles.headerDivider}></div>

            {filteredUserCategories.map((category) => (
                <div key={category.categoryId} className={styles.categoryItem}>
                <span className={styles.itemSpan}>{category?.name || 'Unknown'}</span>
                <span className={styles.itemSpan}>{category?.type.charAt(0).toUpperCase() + category?.type.slice(1) || 'Unknown'}</span>
                <button onClick={() => handleDelete(category.categoryId, category.type)} className={styles.deleteBtn} disabled={deleteLoading}>Delete</button>
                </div>      
            ))}
            <CategoryForm onSubmit={addCategory}/>
        </div>
    );
}