import React, { FC, FormEvent, Ref, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { Input } from '@rescui/input';
import { Textarea } from '@rescui/textarea';
import { useTextStyles } from '@rescui/typography';
import { geo } from '@webteam/data-services';

import countries from './contact-countries.json';
import { FormLayout } from './form-layout';
import { submitContact, validateWorkEmail } from './submit-contact';
import styles from './forms.module.css';

const ROLES = ['Executive', 'VP', 'Director', 'Manager', 'Individual Contributor', 'Other'];
const TEAM_SIZES = ['0-25', '26-50', '51-100', '101-200', '201-500', '501+'];
// JetBrains Countries service printable names are the values submitted to Marketo.
const COUNTRY_NAMES = Object.values(countries);

type ContactSelectProps = {
    name: string;
    label: string;
    options: readonly string[];
    autoComplete?: string;
    selectRef?: Ref<HTMLSelectElement>;
};

const ContactSelect: FC<ContactSelectProps> = ({ name, label, options, autoComplete, selectRef }) => {
    const textCn = useTextStyles();

    return (
        <label className={cn(textCn('rs-text-2'), styles.selectField)}>
            <span className={styles.fieldLabel}>{label} *</span>
            <select ref={selectRef} name={name} autoComplete={autoComplete} defaultValue="" required>
                <option value="" disabled>
                    Select an option
                </option>
                {options.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
        </label>
    );
};

export const ContactForm: FC = () => {
    const textCn = useTextStyles();
    const fieldLabel = (label: string) => <span className={cn(textCn('rs-text-2'), styles.fieldLabel)}>{label}</span>;
    const [ready, setReady] = useState(false);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'failed'>('idle');
    const [emailError, setEmailError] = useState<string | null>(null);
    const pending = useRef(false);
    const countryRef = useRef<HTMLSelectElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const successRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setReady(true);
        geo.detectCountryCode()
            .then((code) => {
                const select = countryRef.current;
                const countryName = countries[code];
                if (select && !select.value && countryName) select.value = countryName;
            })
            .catch(() => {
                // Country selection is available if IP detection fails.
            });
    }, []);

    useEffect(() => {
        if (emailError && status === 'idle') emailRef.current?.focus();
        if (status === 'sent') successRef.current?.focus();
    }, [emailError, status]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (pending.current) return;

        const formData = new FormData(event.currentTarget);
        pending.current = true;
        setStatus('submitting');
        setEmailError(null);

        try {
            const error = await validateWorkEmail(String(formData.get('email')).trim());
            if (error) {
                setEmailError(error);
                setStatus('idle');
                return;
            }

            await submitContact(formData);
            setStatus('sent');
        } catch {
            setStatus('failed');
        } finally {
            pending.current = false;
        }
    };

    return (
        <FormLayout
            title="Discuss a paid subscription"
            intro="Talk to the Kotlin team about your required coverage, supported versions, upgrade constraints, and support period. We’ll review your needs together and discuss whether paid support is a fit."
        >
            <form
                method="post"
                onSubmit={handleSubmit}
                aria-label="Paid support inquiry"
                aria-busy={status === 'submitting'}
            >
                {status === 'sent' ? (
                    <div
                        ref={successRef}
                        tabIndex={-1}
                        role="status"
                        className={cn(textCn('rs-text-2'), styles.result)}
                    >
                        <strong>Request sent</strong>
                        <p>The Kotlin team will follow up at the work email address you provided.</p>
                    </div>
                ) : (
                    <fieldset disabled={!ready || status === 'submitting'} className={styles.fields}>
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
                                pattern=".*\S.*"
                                maxLength={255}
                            />
                            <Input
                                id="contact-lastName"
                                name="lastName"
                                label={fieldLabel('Last name *')}
                                autoComplete="family-name"
                                required
                                pattern=".*\S.*"
                                maxLength={255}
                            />
                            <Input
                                ref={emailRef}
                                id="contact-email"
                                name="email"
                                label={fieldLabel('Work email address *')}
                                type="email"
                                autoComplete="email"
                                required
                                maxLength={255}
                                aria-describedby={emailError ? 'contact-email-error' : undefined}
                                error={
                                    emailError && (
                                        <span id="contact-email-error" role="alert">
                                            {emailError}
                                        </span>
                                    )
                                }
                                onChange={() => setEmailError(null)}
                            />
                            <Input
                                id="contact-company"
                                name="company"
                                label={fieldLabel('Company *')}
                                autoComplete="organization"
                                required
                                pattern=".*\S.*"
                                maxLength={255}
                            />
                            <ContactSelect name="Role__c" label="Role" options={ROLES} />
                            <Input
                                id="contact-jobTitle"
                                name="title"
                                label={fieldLabel('Job title (optional)')}
                                autoComplete="organization-title"
                                maxLength={255}
                            />
                            <ContactSelect
                                name="country"
                                label="Country/Region"
                                options={COUNTRY_NAMES}
                                autoComplete="country-name"
                                selectRef={countryRef}
                            />
                            <fieldset className={styles.teamSize}>
                                <legend>{fieldLabel('Engineering team size *')}</legend>
                                <div className={styles.sizeOptions}>
                                    {TEAM_SIZES.map((size) => (
                                        <label key={size} className={cn(textCn('rs-text-3'), styles.sizeOption)}>
                                            <input type="radio" name="Number_of_Developers__c" value={size} required />
                                            <span>{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                        <Input
                            id="contact-components"
                            name="codeReviewTool"
                            label={fieldLabel('Components and versions (optional)')}
                            placeholder="Kotlin, Ktor, kotlinx libraries, or other components"
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
                        <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.privacy)}>
                            By submitting this form, I acknowledge that JetBrains s.r.o. may process my personal data I
                            provided above for purposes explained above and may engage{' '}
                            <a
                                className={textCn('rs-link')}
                                href="https://www.jetbrains.com/legal/privacy/third-parties.html"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                third parties
                            </a>{' '}
                            in such processing. More details about the processing are in{' '}
                            <a
                                className={textCn('rs-link')}
                                href="https://www.jetbrains.com/legal/docs/privacy/privacy/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                JetBrains Privacy Notice
                            </a>
                            .
                        </p>
                        {status === 'failed' && (
                            <p role="alert" className={cn(textCn('rs-text-2'), styles.error)}>
                                We couldn’t send your request. Please try again.
                            </p>
                        )}
                        <Button type="submit" size="l" className={styles.submit}>
                            {status === 'submitting' ? 'Sending…' : 'Send request'}
                        </Button>
                    </fieldset>
                )}
            </form>
        </FormLayout>
    );
};
