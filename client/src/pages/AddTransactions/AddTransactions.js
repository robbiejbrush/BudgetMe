import React from 'react';
import '../AddTransactions/AddTransactions.css';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

function AddTransactions() {

  const onSubmit = async (data) => {
    
  };

  const initialValues = {
    amount: "",
    counterparty: "",
    date: ""
  };

  const moneyRegex = /^\d+(\.\d{1,2})?$/;

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .positive("Amount must be positive.")
      .typeError("Please enter a valid number.")
      .test(
        "is-decimal",
        "Invalid amount: use up to 2 decimal places (ex., $12.50).",
        (val) => val === undefined || moneyRegex.test(val.toString())
      )
      .required("Amount is required."),
    counterparty: Yup.string().required("Must input counterparty.").min(3, "Must be at least 3 characters.").max(25, "Must be maximum 25 characetrs."),
    date: Yup.date().required("Must input a date.")
  });

  return (
    <div>
      <div>
        <h1 className= "AddTransHeading">Add Transactions</h1>
      </div>
      <Formik initialValues= {initialValues} onSubmit= {onSubmit} validationSchema= {validationSchema}>
         <Form>
          <div className= "FieldsDiv">
            <label className= "Label" htmlFor="AmountInput">Amount:</label>
            <div className="InputWrapper">
              <span className="CurrencySymbol">$</span>
              <Field className = "FieldInput AmountInput" id= "AmountInput" name= "amount" placeholder= "0.00"/>
            </div>
            <ErrorMessage className= "Error" name= "amount" component= "span"/>

            <label className= "Label" htmlFor="CounterpartyInput">Counterparty:</label>
            <Field className = "FieldInput" id= "CounterpartyInput" name= "counterparty" placeholder= "Counterparty"/>
            <ErrorMessage className= "Error" name= "counterparty" component= "span"/>

            <label className= "Label" htmlFor="TypeInput">Type:</label>
            <Field className = "FieldInput" id= "TypeInput" name= "type" as="select">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Field>  
            <ErrorMessage name= "type" component= "span"/>

            <label className= "Label" htmlFor="CategoryInput">Category:</label>

            <label className= "Label" htmlFor="DateInput">Date:</label>
            <Field className = "FieldInput" id= "DateInput" name= "date" type= "date" placeholder= "Date"/>
            <ErrorMessage className="Error" name= "date" component= "span"/>

            <button className= "SubmitButton" type= "submit">Add Transaction(s)</button>
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export default AddTransactions;