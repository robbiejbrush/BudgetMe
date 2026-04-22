import styles from '../RecurringTransactionList/RecurringTransactionList.module.css';
import { RecurringTransactionItem } from '../RecurringTransactionItem/RecurringTransactionItem';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { moneyRegex } from '../../../pages/AddEditTransactions/TransactionSchema';

export function RecurringTransactionList({ recurringTransactions, categoryLookup, setRecurringTransactions, recTransLoading, catsLoading, rawCategories }) {
  
  const validationSchema = Yup.object({
      amountInput: Yup.number()
                .positive("Amount must be positive.")
                .typeError("Please enter a valid number.")
                .test(
                  "is-decimal",
                  "Invalid amount: use up to 2 decimal places (ex. $12.50).",
                  (val) => val === undefined || moneyRegex.test(val.toString())
                )
                .required("Amount is required."),
      typeSelect: Yup.string().required("Type is required."),
      categorySelect: Yup.string().required("Category is required.").notOneOf([""], "Category is required."),
      counterpartyInput: Yup.string().required("Counterparty is required.").min(3, "Must be at least 3 characters.").max(50, "Must be maximum 50 characetrs."),
      frequencySelect: Yup.string().required("Frequency is required.").notOneOf([""], "Frequency is required."),
      startDateInput: Yup.date().required("Start date is required.")
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
      <span className={styles.itemHeading}>Amount</span>
      <span className={styles.itemHeading}>Type</span>
      <span className={styles.itemHeading}>Category</span>
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
            <div className={styles.amountWrapper}>
              <div className={styles.currencyWrapper}>
                <span className={styles.currencySymbol}>$</span>
                <Field className={`${styles.fieldInput} ${styles.amountInput}`} id="amountInput" name="amountInput" disabled={isSubmitting}/>
              </div>
              <ErrorMessage className={styles.errorSpan} name="amountInput" component="div"/>
            </div>
            
            <div className={styles.typeWrapper}>
              <Field className={styles.fieldSelect} id="typeSelect" name="typeSelect" as="select" disabled={isSubmitting}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>  
              </Field>
            </div>
            
            <div className={styles.categoriesWrapper}>
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
            </div>
            
            <div className={styles.counterpartyWrapper}>
              <Field className={styles.fieldInput} id="counterpartyInput" name="counterpartyInput" disabled={isSubmitting}/>
            </div>
            
            <div className={styles.frequencyWrapper}>
              <Field className={styles.fieldSelect} id="frequencySelect" name="frequencySelect" as="select" disabled={isSubmitting}>
                <option value="" hidden>Select a Frequency</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option> 
                <option value="monthly">Monthly</option> 
              </Field>
            </div>
            
            <div className={styles.startDateWrapper}>
              <Field className={styles.fieldInput} id="startDateInput" name="startDateInput" type="date" disabled={isSubmitting}/>
            </div>

            <div className= {styles.endDateWrapper}>
              <Field className={styles.fieldInput} id="endDateInput" name="endDateInput" type="date" disabled={isSubmitting}/>
            </div>
            
            <button className={styles.addBtn} type="submit" disabled={isSubmitting}>Add</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}