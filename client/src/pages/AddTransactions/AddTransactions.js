import React from 'react';
import '../AddTransactions/AddTransactions.css';
import {Formik, Form, Field, FieldArray} from 'formik';
import * as Yup from 'yup';
import { useCategories } from '../../hooks/useCategories';
import { useUserId } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddTransactions() {
  const navigate = useNavigate();

  const userId = useUserId();
  
  const {
    rawCategories,
    loading: categoriesLoading
  } = useCategories(userId);

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const transactionsWithUser = values.transactions.map(t => ({
      ...t,
      userId: userId,
      categoryId: t.category ? parseInt(t.category, 10) : null
    }));
    
    try {
      const response = await axios.post('http://localhost:3001/transactions/create', {
        transactions: transactionsWithUser
      });
      console.log('Success:', response.data);
      if (response.status === 200 || response.status === 201) {
        navigate('/transactions'); 
      }
    } catch (error) {
      console.error('Submission Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const singleTransaction = {
    amount: "",
    counterparty: "",
    type: "",
    category: "",
    date: ""
  };

  const initialValues = {
    transactions: [singleTransaction]
  };

  const moneyRegex = /^\d+(\.\d{1,2})?$/;

  const validationSchema = Yup.object().shape({
    transactions: Yup.array().of(
      Yup.object().shape({
        amount: Yup.number()
          .positive("Amount must be positive.")
          .typeError("Please enter a valid number.")
          .test(
            "is-decimal",
            "Invalid amount: use up to 2 decimal places (ex., $12.50).",
            (val) => val === undefined || moneyRegex.test(val.toString())
          )
          .required("Amount is required."),
        counterparty: Yup.string().required("Counterparty is required.").min(3, "Must be at least 3 characters.").max(50, "Must be maximum 50 characetrs."),
        date: Yup.date().required("Date is required."),
        category: Yup.string().required("Category is required.").notOneOf([""], "Category is required."),
        type: Yup.string().required("Type is required.").notOneOf([""], "Type is required.")
      })
    )
  });

  return (
    <div>
      <div>
        <h1 className= "AddTransHeading">Add Transactions</h1>
      </div>
      <Formik initialValues= {initialValues} onSubmit= {onSubmit} validationSchema= {validationSchema}>
         {({ values, errors, setFieldValue }) => {
          return(
            <Form>
              <div className="CountSelector">
              <label className= "Label HowMany" >How many transactions?</label>
              <input 
                className= "FieldInput HowManyInput"
                type="number" 
                min="1" 
                onChange={(e) => {
                  const count = parseInt(e.target.value) || 1;
                  const currentTransactions = [...values.transactions];
                  const newTransactions = Array.from({ length: count }, (_, i) => {
                    
                    return currentTransactions[i] || { ...singleTransaction };
                  });
                  setFieldValue("transactions", newTransactions);
                }} 
              />
            </div>
              
              <FieldArray name= "transactions">
                {() => (
                  <div>
                    {values.transactions.map((transaction, index) => {
                      const filteredCategories = transaction.type 
                        ? rawCategories.filter(cat => cat.type === transaction.type)
                        : rawCategories;
                        
                        return(
                          <div key={index} className= "FieldsDiv">
                            <h3 className= "TransHeading">Transaction #{index + 1}</h3>

                            <label className= "Label" htmlFor="AmountInput">Amount:</label>
                            <div className="InputWrapper">
                              <span className="CurrencySymbol">$</span>
                              <Field className = "FieldInput AmountInput" id= {`amount-${index}`} name= {`transactions.${index}.amount`} placeholder= "0.00"/>
                            </div>
                            {errors.transactions?.[index]?.amount && (
                              <span className="Error">{errors.transactions[index].amount}</span>
                            )}

                            <label className= "Label" htmlFor="CounterpartyInput">Counterparty:</label>
                            <Field className = "FieldInput" id= {`counterparty-${index}`} name= {`transactions.${index}.counterparty`} placeholder= "Counterparty"/>
                            {errors.transactions?.[index]?.counterparty && (
                              <span className="Error">{errors.transactions[index].counterparty}</span>
                            )}

                            <label className= "Label" htmlFor="TypeInput">Type:</label>
                            <Field className = "FieldInput" id= {`type-${index}`} name= {`transactions.${index}.type`} as="select">
                              <option value= "" hidden>Select a Type</option>
                              <option value="income">Income</option>
                              <option value="expense">Expense</option>
                            </Field>  
                            {errors.transactions?.[index]?.type && (
                              <span className="Error">{errors.transactions[index].type}</span>
                            )}

                            <label className= "Label" htmlFor="CategoryInput">Category:</label>
                            <Field className= "FieldInput" id= {`category-${index}`} name= {`transactions.${index}.category`} as="select" disabled={categoriesLoading}>
                              {categoriesLoading ? (
                                <option>Loading...</option>
                              ) : (
                                <>
                                  <option value= "" hidden>Select a Category</option>
                                  {filteredCategories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                                  ))}
                                </>
                              )}
                            </Field> 
                            {errors.transactions?.[index]?.category && (
                              <span className="Error">{errors.transactions[index].category}</span>
                            )}


                            <label className= "Label" htmlFor="DateInput">Date:</label>
                            <Field className = "FieldInput" id= {`date-${index}`} name= {`transactions.${index}.date`} type= "date" placeholder= "Date"/>
                            {errors.transactions?.[index]?.date && (
                              <span className="Error">{errors.transactions[index].date}</span>
                            )}
                          </div>
                        );
                    })}
                  </div>
                )}
              </FieldArray>
              <button className= "SubmitButton" type= "submit">Add Transaction(s)</button>
            </Form>
          );
         }}
      </Formik>
    </div>
  )
}

export default AddTransactions;