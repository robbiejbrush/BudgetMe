import * as Yup from 'yup';

export const validationSchema = Yup.object({
    nameInput: Yup.string().min(3, "Name must be over 3 characters.").max(20, "Name must be under 20 characters.").required("Name is required."),
    typeSelect: Yup.string().required("Type is required.").notOneOf([""], "Type is required.")
});

export const initialValues = {
    nameInput: '',
    typeSelect: ''
};