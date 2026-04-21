import styles from '../RecurringTransactionList/RecurringTransactionList.module.css';
import { RecurringTransactionItem } from '../RecurringTransactionItem/RecurringTransactionItem';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export function RecurringTransactionList({ recurringTransactions, categoryLookup, setRecurringTransactions, recTransLoading, catsLoading, rawCategories }) {
    
  const validationSchema = Yup.object({
      nameInput: Yup.string().min(3, "Name must be over 3 characters.").max(20, "Name must be under 20 characters.").required("Name is required."),
      typeSelect: Yup.string().required("Type is required.").notOneOf([""], "Type is required.")
  });
  
  const initialValues = {
      amountInput: '',
      typeSelect: 'income',
      categorySelect: '',
      counterpartyInput: '',
      frequencySelect: '',
      startDateInput: '',
      endDateInput: ''
  };

  if (recTransLoading || catsLoading) return <div className= "LoadingText">Loading data...</div>;
  
  return (
    <div className={styles.recTransListDiv}>
      <span className={`${styles.itemHeading} ${styles.amount}`}>Amount</span>
      <span className={`${styles.itemHeading} ${styles.type}`}>Type</span>
      <span className={`${styles.itemHeading} ${styles.category}`}>Category</span>
      <span className={styles.itemHeading}>Counterparty</span>
      <span className={styles.itemHeading}>Frequency</span>
      <span className={styles.itemHeading}>Start Date</span>
      <span className={styles.itemHeading}>End Date</span>

      <div className={styles.headerDivider}></div>

      {recurringTransactions.map((tx) => (
        <RecurringTransactionItem 
            key={tx.recurringTransactionId}
            tx={tx}
            categoryName={categoryLookup[tx.categoryId]}
            setRecurringTransactions={setRecurringTransactions}
        />
      ))}

      <Formik initialValues= {initialValues} onSubmit= {""} validationSchema= {validationSchema} enableReinitialize={true}>
        {({ isSubmitting, values }) => (
          <Form className={styles.form}>
            <div className={styles.inputWrapper}>
              <span className={styles.currencySymbol}>$</span>
              <Field className={styles.fieldInput} id="amountInput" name="amountInput" disabled={isSubmitting}/>
            </div>
            
            <Field className={styles.fieldSelect} id="typeSelect" name="typeSelect" as="select" disabled={isSubmitting}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>  
            </Field>
            
            <Field className={styles.fieldSelect} id="categorySelect" name="categorySelect" as="select" disabled={isSubmitting}>
              <option value="" hidden>Select a Category</option> 
              {rawCategories
                .filter(cat => cat.type === values.typeSelect)
                .map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))
              }
            </Field>
            
            <Field className={styles.fieldInput} id="counterpartyInput" name="counterpartyInput" disabled={isSubmitting}/>
            
            <Field className={styles.fieldSelect} id="frequencySelect" name="frequencySelect" as="select" disabled={isSubmitting}>
              <option value="" hidden>Select a Frequency</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option> 
              <option value="monthly">Monthly</option> 
            </Field>
            
            <Field className={styles.fieldInput} id="startDateInput" name="startDateInput" type="date" disabled={isSubmitting}/>

            <Field className={styles.fieldInput} id="endDateInput" name="endDateInput" type="date" disabled={isSubmitting}/>
            
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
  );
}