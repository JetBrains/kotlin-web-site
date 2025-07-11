import { privacy, submitToMarketo } from '@jetbrains/kotlin-web-site-ui/out/packages/data-services';
import { FormikHelpers } from 'formik';

interface MarketoSubmitterOptions {
  onSubmitted: () => void;
  consentIds: string | string[];
  formId: string;
  valuesTransformer?: (values: any) => any;
}

interface FormValues {
  Email: string;
  [key: string]: any;
}

const createMarketoSubmitter = 
  ({ onSubmitted, consentIds, formId, valuesTransformer = (arg: any) => arg }: MarketoSubmitterOptions) =>
    async (values: FormValues, { setSubmitting, setStatus }: FormikHelpers<FormValues>) => {
      setSubmitting(true);
      setStatus({ error: null });

      try {
        const transformedValues = valuesTransformer(values);

        await privacy.sendAcceptance(consentIds, transformedValues.Email);

        await submitToMarketo({
          formid: formId,
          ...transformedValues
        });

        setSubmitting(false);

        onSubmitted();
      } catch (e) {
        setSubmitting(false);
        setStatus({
          error: `An error occurred while sending your message, please try again later.`
        });
      }
    };

export default createMarketoSubmitter;