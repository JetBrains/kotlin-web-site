import {privacy, submitToMarketo} from '@jetbrains/kotlin-web-site-ui/dist/dataServices.js';

const createMarketoSubmitter =
  ({onSubmitted, consentIds, formId, valuesTransformer = arg => arg}) =>
    async (values, {setSubmitting, setStatus}) => {
      setSubmitting(true);
      setStatus({error: null});

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
