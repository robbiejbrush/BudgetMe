import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from '../CategoryForm/CategoryForm.module.css';
import { validationSchema, initialValues } from './CategorySchema';

export function CategoryForm({ onSubmit }) {
    return (
        <Formik initialValues= {initialValues} onSubmit= {onSubmit} validationSchema= {validationSchema} enableReinitialize={true}>
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.nameDiv}>
                <Field className={styles.fieldInput} id="nameInput" placeholder= "Name" name="nameInput" disabled={isSubmitting}/>
                <ErrorMessage className={styles.errorSpan} name="nameInput" component="span"/>
              </div>
              <div className={styles.typeDiv}>
                <Field className={styles.fieldSelect} id="typeSelect" name="typeSelect" as="select" disabled={isSubmitting}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>  
                </Field>
                <ErrorMessage className={styles.errorSpan} name="typeSelect" component="span"/>
              </div>
              <button className={styles.addBtn} type="submit" disabled={isSubmitting}>Add</button>
            </Form>
          )}
        </Formik>
    );
}