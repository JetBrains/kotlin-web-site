import { privacy, submitToMarketo } from '@jetbrains/kotlin-web-site-ui/out/packages/data-services';
import { FormikHelpers } from 'formik';

interface MarketoSubmitterOptions<T> {
    onSubmitted: () => void;
    consentIds: string;
    formId: string;
    valuesTransformer?: (values: T) => Record<string, unknown>;
}

const createMarketoSubmitter =
    <T extends { Email: string }>({
        onSubmitted,
        consentIds,
        formId,
        valuesTransformer = (arg) => arg as unknown as Record<string, unknown>
    }: MarketoSubmitterOptions<T>) =>
    async (values: T, { setSubmitting, setStatus }: FormikHelpers<T>) => {
        setSubmitting(true);
        setStatus({ error: null });

        try {
            const transformedValues = valuesTransformer(values);

            await privacy.sendAcceptance(consentIds, values.Email);

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
