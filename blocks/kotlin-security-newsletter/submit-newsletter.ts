import { formService } from '@webteam/data-services';
import type { Submitter } from '@webteam/forms';

import { CONSENT_ID, FORM_ID } from './constants';

const CONSENT_URL = 'https://account.jetbrains.com/services/acceptAgreement';

const SIGNUP_FAILED_MESSAGE = 'We couldn’t complete your signup. Please try again.';

type ServiceError = Array<{ name: string; cause: string }>;
type ServiceResponse = { success: boolean; cause?: ServiceError };

const toFieldErrors = (cause: ServiceError): Record<string, string> =>
    cause.reduce<Record<string, string>>((errors, { name, cause: reason }) => {
        errors[name] = reason;
        return errors;
    }, {});

export const submitNewsletter: Submitter = async (formData) => {
    // The field is named `email` (lowercase) so that the webteam-ui form
    // components can watch it; Marketo expects the `Email` key instead.
    const { email, ...fields } = formData;
    const emailAddress = String(email ?? '');
    if (!emailAddress) throw { form: SIGNUP_FAILED_MESSAGE };

    const consent = await fetch(CONSENT_URL, {
        method: 'POST',
        body: new URLSearchParams({ email: emailAddress, type: CONSENT_ID }),
    });
    if (!consent.ok) throw { form: SIGNUP_FAILED_MESSAGE };

    const response = await formService.submitToMarketo({ ...fields, Email: emailAddress, formid: FORM_ID });
    if (!response.ok) throw { form: SIGNUP_FAILED_MESSAGE };

    const data = (await response.json()) as ServiceResponse;
    if (!data.success) throw toFieldErrors(data.cause ?? []);

    return data;
};
