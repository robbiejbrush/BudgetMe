import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../CategoryForm/CategoryForm.module.css';

const validationSchema = Yup.object({
    nameInput: Yup.string().min(3, "Name must be over 3 characters.").max(20, "Name must be under 20 characters.").required("Name is required."),
    typeSelect: Yup.string().required("Type is required.").notOneOf([""], "Type is required.")
});

const initialValues = {
    nameInput: '',
    typeSelect: ''
};

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