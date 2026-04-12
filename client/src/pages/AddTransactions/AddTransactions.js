import React from 'react';
import '../AddTransactions/AddTransactions.css';
import {Formik, Form, FieldArray} from 'formik';
import { useCategories } from '../../hooks/useCategories';
import { transactionSchema } from './TransactionSchema';
import { useTransactionForm } from '../../hooks/useTransactionForm';
import TransactionFieldGroup from '../../components/AddTransactions/TransactionFieldGroup';

const singleTransaction = {
  amount: "",
  counterparty: "",
  type: "",
  category: "",
  date: ""
};

function AddTransactions() {
  const {
    onSubmit, 
    handleCountChange, 
    userId
  } = useTransactionForm();
  const {
    rawCategories,
    loading: categoriesLoading
  } = useCategories(userId);

  const initialValues = {
    transactions: [singleTransaction]
  };

  return (
    <div>
      <div>
        <h1 className= "AddTransHeading">Add Transactions</h1>
      </div>
      <Formik initialValues= {initialValues} onSubmit= {onSubmit} validationSchema= {transactionSchema}>
         {({ values, errors, setFieldValue }) => {
          return(
            <Form>
              <div className="CountSelector">
                <label className= "Label HowMany" >How many transactions?</label>
                <input 
                  className= "FieldInput HowManyInput"
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
              <button className= "SubmitButton" type= "submit">Add Transaction(s)</button>
            </Form>
          );
         }}
      </Formik>
    </div>
  );
}

export default AddTransactions;