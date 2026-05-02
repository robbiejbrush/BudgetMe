import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from '../RecurringTransactionForm/RecurringTransactionForm.module.css';
import { useCurrencies } from '../../../pages/Settings/CurrencyContext';

export function RecurringTransactionForm( { initialValues, onSubmit, onCancel, validationSchema, rawCategories, buttonText = "Add" } ) {
    const { currencySymbol } = useCurrencies();
    
    return (
        <Formik initialValues= {initialValues} onSubmit= {onSubmit} validationSchema= {validationSchema} enableReinitialize={true}>
            {({ isSubmitting, values }) => (
            <Form className={styles.form}>
                <div className={styles.amountWrapper}>
                    <div className={styles.currencyWrapper}>
                        <span className={styles.currencySymbol}>{currencySymbol}</span>
                        <Field className={styles.fieldInput} id="amountInput" name="amountInput" disabled={isSubmitting}/>
                    </div>
                    <ErrorMessage className={styles.errorSpan} name="amountInput" component="div"/>
                </div>
                
                <div className={styles.typeWrapper}>
                    <Field className={styles.fieldSelect} id="typeSelect" name="typeSelect" as="select" disabled={isSubmitting}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>  
                    </Field>
                    <ErrorMessage className={styles.errorSpan} name="typeSelect" component="div"/>
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
                    <ErrorMessage className={styles.errorSpan} name="categorySelect" component="div"/>
                </div>
                
                <div className={styles.counterpartyWrapper}>
                    <Field className={styles.fieldInput} id="counterpartyInput" name="counterpartyInput" disabled={isSubmitting}/>
                    <ErrorMessage className={styles.errorSpan} name="counterpartyInput" component="div"/>
                </div>
                
                <div className={styles.frequencyWrapper}>
                    <Field className={styles.fieldSelect} id="frequencySelect" name="frequencySelect" as="select" disabled={isSubmitting}>
                        <option value="" hidden>Select a Frequency</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option> 
                        <option value="monthly">Monthly</option> 
                    </Field>
                    <ErrorMessage className={styles.errorSpan} name="frequencySelect" component="div"/>
                </div>
                
                <div className={styles.startDateWrapper}>
                    <Field className={styles.fieldInput} id="startDateInput" name="startDateInput" type="date" placeholder="Start Date" disabled={isSubmitting}/>
                    <ErrorMessage className={styles.errorSpan} name="startDateInput" component="div"/>
                </div>

                <div className= {styles.endDateWrapper}>
                    <Field className={styles.fieldInput} id="endDateInput" name="endDateInput" type="date" placeholder= "End Date" disabled={isSubmitting}/>
                </div>
                <div className={styles.actionsDiv}>
                    <button className={styles.addBtn} type="submit" disabled={isSubmitting}>{buttonText}</button>
                    {onCancel && (
                        <button 
                            type="button" 
                            className={styles.cancelBtn} 
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </Form>
            )}
        </Formik>
    );
}