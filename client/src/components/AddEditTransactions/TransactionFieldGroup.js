import React from 'react';
import { Field } from 'formik';
import '../../pages/AddEditTransactions/AddEditTransactions.css'

function TransactionFieldGroup( {index, transaction, errors, rawCategories, categoriesLoading, showHeading = true} ) {
    const filteredCategories = transaction.type 
        ? rawCategories.filter(cat => cat.type === transaction.type)
        : rawCategories;
                        
    return(
        <div key={index} className= "FieldsDiv">
            {showHeading && (
                <h3 className="TranHeading">Transaction #{index + 1}</h3>
            )}

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
};

export default TransactionFieldGroup;