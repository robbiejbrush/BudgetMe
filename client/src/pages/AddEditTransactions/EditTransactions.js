import React from 'react';
import './AddEditTransactions.css';
import { Formik, Form } from 'formik';
import { useCategories } from '../../hooks/useCategories.js';
import { transactionSchema } from './TransactionSchema.js';
import { useAddTransaction } from './useAddTransaction.js';
import TransactionFieldGroup from '../../components/AddEditTransactions/TransactionFieldGroup.js';
import { useParams } from 'react-router-dom';
import { useTransaction } from './useTransaction.js';

function EditTransactions() {
    const {
        onSubmit,
        userId
    } = useAddTransaction();
    const {
        rawCategories,
        loading: categoriesLoading
    } = useCategories(userId);

    const { 
        transactionId 
    } = useParams();
    const {
        transaction,
        loading
    } = useTransaction(transactionId);

    if (loading) return <div className= "LoadingText">Loading transaction...</div>;
    if (!transaction) return <div className= "ErrorText">Transaction not found.</div>;

    const initialValues = {
        transactions: [transaction]
    };

    return (
        <div>
        <div>
            <h1 className= "EditTransHeading">Edit Transaction</h1>
        </div>
        <Formik initialValues= {initialValues} onSubmit= {onSubmit} validationSchema= {transactionSchema} enableReinitialize={true}>
            {({ values, errors }) => {
            return(
                <Form>
                <TransactionFieldGroup
                    index= {0}
                    transaction= {values.transactions[0]}
                    errors= {errors}
                    rawCategories= {rawCategories}
                    categoriesLoading= {categoriesLoading}
                    showHeading= {false}
                />
                <button className= "SubmitButton" type= "submit">Save Changes</button>
                </Form>
            );
            }}
        </Formik>
        </div>
    );
}

export default EditTransactions;