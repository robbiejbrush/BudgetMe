import { CategoryForm } from '../CategoryForm/CategoryForm';
import { useCategories } from '../../../hooks/useCategories';
import { useCategoryAdd } from './useCategoryAdd';
import useCategoryDelete from './useCategoryDelete';
import { useTransactionUpdate } from '../../../hooks/useTransactionEdit';
import { useTransactions } from '../../../hooks/useTransactions';
import styles from '../CategoryManager/CategoryManager.module.css';

export function CategoryManager({ userId }) {
    //Get all categories
    const {
        rawCategories,
        setRawCategories,
        loading: categoriesLoading
    } = useCategories(userId);

    //Add categories
    const {
        addCategory,
        loading: addLoading
    } = useCategoryAdd(userId, setRawCategories);

    //Delete categories
    const {
        deleteCategory,
        loading: deleteLoading
    } = useCategoryDelete();

    //Get all transactions
    const { rawTransactions, loading: transLoading } = useTransactions(userId); 
    
    //Updating transaction
    const { updateTransaction } = useTransactionUpdate();

    const handleDelete = async (categoryId, categoryType) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (!confirmed) return;
        
        try {
            //Find transactions belonging to this category
            const affectedTransactions = rawTransactions.filter(t => t.categoryId === categoryId);
            
            //If there are transactions for that category
            if (affectedTransactions.length > 0) {
                //Figure out whether to update category to Other (Income) or Other (Expense)
                const otherIncomeId = 69; 
                const otherExpenseId = 86;
                const targetId = categoryType === 'income' ? otherIncomeId : otherExpenseId;

                //Update each transaction
                await Promise.all(affectedTransactions.map(t => 
                    updateTransaction(t.transactionId, { ...t, categoryId: targetId })
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
    
    if (addLoading || deleteLoading || categoriesLoading || transLoading) return <div className= "LoadingText">Loading data...</div>;

    return (
        <div className={styles.categoriesListDiv}>
            <h2 className={styles.categoriesHeader}>Custom Categories</h2>
            <span></span>
            <span></span>

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