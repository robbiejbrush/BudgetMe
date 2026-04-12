import * as Yup from 'yup';

export const moneyRegex = /^\d+(\.\d{1,2})?$/;

export const transactionSchema = Yup.object().shape({
    transactions: Yup.array().of(
      Yup.object().shape({
        amount: Yup.number()
          .positive("Amount must be positive.")
          .typeError("Please enter a valid number.")
          .test(
            "is-decimal",
            "Invalid amount: use up to 2 decimal places (ex. $12.50).",
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