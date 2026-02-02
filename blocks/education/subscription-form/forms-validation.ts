import isEmail from 'validator/lib/isEmail';
import { FormikErrors } from 'formik';

interface SubscriptionFormValues {
    Email: string;
}

export const validateForm = (values: SubscriptionFormValues): FormikErrors<SubscriptionFormValues> => {
    const errors: FormikErrors<SubscriptionFormValues> = {};

    if (!values.Email) {
        errors.Email = 'This field is required';
    } else if (!isEmail(values.Email)) {
        errors.Email = 'Please enter a valid email address';
    }

    return errors;
};
