import isEmail from 'validator/es/lib/isEmail';

export const validateForm = (values) => {
  const result = {};
  const fieldNames = Object.keys(values);

  fieldNames.forEach(fieldName => {
    const fieldValue = values[fieldName];
    if (
      fieldName === 'Email' &&
      !isEmail(fieldValue)
    ) {
      result[fieldName] = 'Please enter a valid email address';
    }
    if (
      isEmptyFieldValue(fieldName, fieldValue)
    ) {
      result[fieldName] = 'This field is required';
    }
  });

  return result
};

function isEmptyFieldValue(fieldName, fieldValue) {
  return !fieldValue && fieldValue !== 0;
}
