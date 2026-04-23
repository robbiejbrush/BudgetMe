import * as Yup from 'yup';
import { moneyRegex } from '../../pages/AddEditTransactions/TransactionSchema';

export const validationSchema = Yup.object({
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

export const initialValues = {
    amountInput: '',
    typeSelect: 'income',
    categorySelect: '',
    counterpartyInput: '',
    frequencySelect: '',
    startDateInput: '',
    endDateInput: ''
};