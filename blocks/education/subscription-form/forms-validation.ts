import validator from 'validator';

interface FormValues {
  Email: string;
  [key: string]: any;
}

export const validateForm = (values: FormValues): FormValues => {
  const result: FormValues = { Email: '' };
  const fieldNames = Object.keys(values);

  fieldNames.forEach(fieldName => {
    const fieldValue = values[fieldName];
    if (
      fieldName === 'Email' &&
      !validator.isEmail(fieldValue)
    ) {
      result[fieldName] = 'Please enter a valid email address';
    }
    if (
      isEmptyFieldValue(fieldName, fieldValue)
    ) {
      result[fieldName] = 'This field is required';
    }
  });

  return result;
};

function isEmptyFieldValue(fieldName: string, fieldValue: string): boolean {
  return !fieldValue && fieldValue !== '0';
}