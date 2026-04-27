import React from 'react';
import styles from './AddEditTransactions.module.css';
import { Formik, Form } from 'formik';
import { useCategories } from '../../hooks/useCategories.js';
import { transactionSchema } from './TransactionSchema.js';
import { useTransactionEdit } from '../../hooks/useTransactionEdit.js';
import TransactionFieldGroup from '../../components/AddEditTransactions/TransactionFieldGroup.js';
import { useParams } from 'react-router-dom';
import { useTransaction } from './useTransaction.js';
import { PageHeader } from '../../components/PageHeader/PageHeader.js';
import { useNavigate } from 'react-router-dom';

function EditTransactions() {
    const navigate = useNavigate();
    
    const { transactionId } = useParams();
    const { userId, onSubmit } = useTransactionEdit(transactionId, {
        onSuccess: () => navigate('/transactions')
    });
    const { rawCategories, loading: categoriesLoading } = useCategories(userId);
    const { transaction, loading } = useTransaction(transactionId);

    const initialValues = {
        transactions: [transaction]
    };

    if (loading) return <div className= "LoadingText">Loading transaction...</div>;
    if (!transaction) return <div className= "ErrorText">Transaction not found.</div>;

    return (
        <div>
        <PageHeader title= "Edit Transactions"/>
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
                        <button className={styles.submitBtn} type= "submit">Save Changes</button>
                    </Form>
                );
            }}
        </Formik>
        </div>
    );
}

export default EditTransactions;