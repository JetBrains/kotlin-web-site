import React, { FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { geo } from '@webteam/data-services';
import {
    ErrorMessage,
    Form,
    Input,
    PrivacyNotice,
    RadioButtonList,
    Select,
    SubmitButton,
    Textarea,
    useForm,
} from '@webteam/forms';

import countries from './contact-countries.json';
import { FormLayout } from './form-layout';
import { CONSENT_ID, FORM_ID, submitContact } from './submit-contact';
import styles from './forms.module.css';

const ROLE_OPTIONS = ['Executive', 'VP', 'Director', 'Manager', 'Individual Contributor', 'Other'].map((role) => ({
    label: role,
    value: role,
}));
const TEAM_SIZES = ['0-25', '26-50', '51-100', '101-200', '201-500', '501+'];

// JetBrains Countries service printable names are the country values sent to Marketo.
const COUNTRY_OPTIONS = Object.values(countries).map((country) => ({ label: country, value: country }));

const ConsentFallback: FC = () => (
    <>
        By submitting this form, I acknowledge that JetBrains s.r.o. may process my personal data I provided above for
        purposes explained above and may engage{' '}
        <a href="https://www.jetbrains.com/legal/privacy/third-parties.html" target="_blank" rel="noopener noreferrer">
            third parties
        </a>{' '}
        in such processing. More details about the processing are in{' '}
        <a href="https://www.jetbrains.com/legal/docs/privacy/privacy/" target="_blank" rel="noopener noreferrer">
            JetBrains Privacy Notice
        </a>
        .
    </>
);

const SubmitMessage: FC = () => {
    const textCn = useTextStyles();
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => messageRef.current?.focus(), []);

    return (
        <div ref={messageRef} tabIndex={-1} role="status" className={cn(textCn('rs-text-2'), styles.result)}>
            <strong>Request sent</strong>
            <p>The Kotlin team will follow up at the work email address you provided.</p>
        </div>
    );
};

const ContactFields: FC = () => {
    const textCn = useTextStyles();
    const fieldLabel = (label: string) => <span className={cn(textCn('rs-text-2'), styles.fieldLabel)}>{label}</span>;
    const { errorData, state, setFormFieldValue } = useForm();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let active = true;
        setReady(true);
        geo.detectCountryCode()
            .then((code) => {
                const country = countries[code];
                if (active && country) {
                    setFormFieldValue('country', (current) => current || country);
                }
            })
            .catch(() => {
                // The bundled country options are available when IP detection fails.
            });
        return () => {
            active = false;
        };
    }, [setFormFieldValue]);

    const busy = state === 'validating' || state === 'beforeSubmit' || state === 'submitting';

    return (
        <fieldset disabled={!ready || busy} className={styles.fields}>
            <legend className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.required)}>
                * Required fields
            </legend>
            <div className={styles.row}>
                <Input
                    id="contact-firstName"
                    name="firstName"
                    label={fieldLabel('First name *')}
                    autoComplete="given-name"
                    required
                    aria-required="true"
                    maxLength={255}
                />
                <Input
                    id="contact-lastName"
                    name="lastName"
                    label={fieldLabel('Last name *')}
                    autoComplete="family-name"
                    required
                    aria-required="true"
                    maxLength={255}
                />
                <Input
                    id="contact-email"
                    name="email"
                    label={fieldLabel('Work email address *')}
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    maxLength={255}
                />
                <Input
                    id="contact-company"
                    name="company"
                    label={fieldLabel('Company *')}
                    autoComplete="organization"
                    required
                    aria-required="true"
                    maxLength={255}
                />
                <Select
                    isNative
                    name="Role__c"
                    label={fieldLabel('Role *')}
                    className={styles.selectField}
                    placeholder="Select an option"
                    options={ROLE_OPTIONS}
                    required
                />
                <Input
                    id="contact-jobTitle"
                    name="title"
                    label={fieldLabel('Job title (optional)')}
                    autoComplete="organization-title"
                    maxLength={255}
                />
                <Select
                    isNative
                    name="country"
                    label={fieldLabel('Country/Region *')}
                    className={styles.selectField}
                    placeholder="Select an option"
                    options={COUNTRY_OPTIONS}
                    required
                />
                <fieldset className={styles.teamSize}>
                    <legend>{fieldLabel('Engineering team size *')}</legend>
                    <RadioButtonList
                        name="Number_of_Developers__c"
                        options={TEAM_SIZES}
                        size="s"
                        className={styles.sizeOptions}
                        required
                    />
                </fieldset>
            </div>
            <Textarea
                id="contact-components"
                name="codeReviewTool"
                label={fieldLabel('Components and versions (optional)')}
                placeholder="Kotlin, Ktor, kotlinx libraries, or other components"
                minRows={1}
                maxLength={2000}
            />
            <Textarea
                id="contact-needs"
                name="mktoPersonNotes"
                label={fieldLabel('What would you like to discuss? (optional)')}
                placeholder="Tell us about your support needs or what makes updating difficult."
                minRows={4}
                maxLength={32000}
            />
            <PrivacyNotice consentId={CONSENT_ID} size="m" defaultMessage={<ConsentFallback />} />
            {errorData.form && (
                <div role="alert">
                    <ErrorMessage />
                </div>
            )}
            <SubmitButton size="l" className={styles.submit} showFormError={false}>
                {state === 'submitting' ? 'Sending…' : 'Send request'}
            </SubmitButton>
        </fieldset>
    );
};

export const ContactForm: FC = () => (
    <FormLayout
        title="Discuss a paid subscription"
        intro="Talk to the Kotlin team about your required coverage, supported versions, upgrade constraints, and support period. We’ll review your needs together and discuss whether paid support is a fit."
    >
        <Form formId={FORM_ID} submitter={submitContact} submitMessage={SubmitMessage} sendMarketingData={false}>
            <ContactFields />
        </Form>
    </FormLayout>
);
