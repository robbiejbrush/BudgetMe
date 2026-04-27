import React from 'react';
import styles from './AddEditTransactions.module.css';
import {Formik, Form, FieldArray} from 'formik';
import { useCategories } from '../../hooks/useCategories.js';
import { transactionSchema } from './TransactionSchema.js';
import { useTransactionAdd } from './useTransactionAdd.js';
import TransactionFieldGroup from '../../components/AddEditTransactions/TransactionFieldGroup.js';
import { PageHeader } from '../../components/PageHeader/PageHeader.js';

const singleTransaction = {
  amount: "",
  counterparty: "",
  type: "income",
  category: "",
  date: ""
};

function AddTransactions() {
  const {
    onSubmit, 
    handleCountChange, 
    userId
  } = useTransactionAdd();
  const {
    rawCategories,
    loading: categoriesLoading
  } = useCategories(userId);

  const initialValues = {
    transactions: [singleTransaction]
  };

  return (
    <div>
      <PageHeader title= "Add Transactions"/>
      <Formik initialValues= {initialValues} onSubmit= {onSubmit} validationSchema= {transactionSchema}>
         {({ values, errors, setFieldValue }) => {
          return(
            <Form>
              <div className={styles.countSelectorDiv}>
                <label className={styles.label}>How many transactions?</label>
                <input 
                  className={styles.fieldInput}
                  type="number" 
                  min="1" 
                  onChange={(e) => handleCountChange(e, values, setFieldValue, singleTransaction)} 
                />
              </div>
              <FieldArray name= "transactions">
                {() => (
                  <div>
                    {values.transactions.map((transaction, index) => (
                      <TransactionFieldGroup 
                        key={index}
                        index={index}
                        transaction={transaction}
                        errors={errors}
                        rawCategories={rawCategories}
                        categoriesLoading={categoriesLoading}
                      />
                    ))}
                  </div>
                )}
              </FieldArray>
              <button className={styles.submitBtn} type= "submit">Add Transaction(s)</button>
            </Form>
          );
         }}
      </Formik>
    </div>
  );
}

export default AddTransactions;