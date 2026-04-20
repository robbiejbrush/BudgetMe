import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import styles from '../Settings/Settings.module.css';
import { useCategories } from '../../hooks/useCategories';
import { useUserId } from '../../hooks/useAuth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useCategoryAdd } from './useCategoryAdd';
import useCategoryDelete from './useCategoryDelete';

function Settings() {
  //Get current userId
  const userId = useUserId();

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

  const initialValues = {
    nameInput: '',
    typeSelect: ''
  };

  const validationSchema = Yup.object({
    nameInput: Yup.string().min(3, "Name must be over 3 characters.").max(20, "Name must be under 20 characters.").required("Name is required."),
    typeSelect: Yup.string().required("Type is required.").notOneOf([""], "Type is required.")
});
  
  if (addLoading || deleteLoading || categoriesLoading) return <div className= "LoadingText">Loading data...</div>;

  return (
    <div>
      <PageHeader
        title= "Settings"
      />
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
          ))
        }
        <Formik initialValues= {initialValues} onSubmit= {addCategory} validationSchema= {validationSchema} enableReinitialize={true}>
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <Field className={styles.fieldInput} id="nameInput" name="nameInput" disabled={isSubmitting}/>
              <Field className={styles.fieldSelect} id="typeSelect" name="typeSelect" as="select" disabled={isSubmitting}>
                <option value="" hidden>Select a Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>  
              </Field>
              <button className={styles.addBtn} type="submit" disabled={isSubmitting}>Add</button>

              <div>
                <ErrorMessage className={styles.errorSpan} name="nameInput" component="span"/>
              </div>
              <div>
                <ErrorMessage className={styles.errorSpan} name="typeSelect" component="span"/>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Settings;