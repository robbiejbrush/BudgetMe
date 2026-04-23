import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from '../CategoryForm/CategoryForm.module.css';
import { validationSchema, initialValues } from './CategorySchema';

export function CategoryForm({ onSubmit }) {
    return (
        <Formik initialValues= {initialValues} onSubmit= {onSubmit} validationSchema= {validationSchema} enableReinitialize={true}>
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
    );
}