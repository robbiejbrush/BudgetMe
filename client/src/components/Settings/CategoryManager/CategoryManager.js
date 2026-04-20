import { CategoryForm } from '../CategoryForm/CategoryForm';
import { useCategories } from '../../../hooks/useCategories';
import { useCategoryAdd } from './useCategoryAdd';
import useCategoryDelete from './useCategoryDelete';
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

    const handleDelete = async (categoryId) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (!confirmed) return;
        
        try {
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
    
    if (addLoading || deleteLoading || categoriesLoading) return <div className= "LoadingText">Loading data...</div>;

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
                <button onClick={() => handleDelete(category.categoryId)} className={styles.deleteBtn} disabled={deleteLoading}>Delete</button>
                </div>      
            ))}
            <CategoryForm onSubmit={addCategory}/>
        </div>
    );
}