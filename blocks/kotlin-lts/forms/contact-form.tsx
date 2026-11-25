import React, { FC } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { Input } from '@rescui/input';
import { Textarea } from '@rescui/textarea';
import { useTextStyles } from '@rescui/typography';

import countries from './contact-countries.json';
import { FormLayout } from './form-layout';
import { usePreviewForm } from './use-preview-form';
import styles from './forms.module.css';

const ROLES = ['Executive', 'VP', 'Director', 'Manager', 'Individual contributor', 'Other'];
const TEAM_SIZES = ['0-25', '26-50', '51-100', '101-200', '201-500', '501+'];
type ContactSelectProps = {
    name: string;
    label: string;
    options: readonly string[];
    autoComplete?: string;
};

const ContactSelect: FC<ContactSelectProps> = ({ name, label, options, autoComplete }) => {
    const textCn = useTextStyles();

    return (
        <label className={cn(textCn('rs-text-2'), styles.selectField)}>
            <span className={styles.fieldLabel}>{label} *</span>
            <select name={name} autoComplete={autoComplete} defaultValue="" required>
                <option value="" disabled>Select an option</option>
                {options.map((option) => <option key={option}>{option}</option>)}
            </select>
        </label>
    );
};

export const ContactForm: FC = () => {
    const textCn = useTextStyles();
    const fieldLabel = (label: string) => <span className={cn(textCn('rs-text-2'), styles.fieldLabel)}>{label}</span>;
    const { ready, previewed, setPreviewed, handleSubmit } = usePreviewForm();

    return (
        <FormLayout
            title="Discuss a paid subscription"
            intro="Talk to the Kotlin team about your required coverage, supported versions, upgrade constraints, and support period. We’ll review your needs together and discuss whether paid support is a fit."
        >
            <form
                onSubmit={handleSubmit}
                onInput={() => setPreviewed(false)}
                aria-label="Paid support inquiry preview"
            >
                <fieldset disabled={!ready} className={styles.fields}>
                    <legend className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.required)}>
                        * Required fields
                    </legend>
                    <div className={styles.row}>
                        <Input id="contact-firstName" name="firstName" label={fieldLabel('First name *')} autoComplete="given-name" required pattern=".*\S.*" />
                        <Input id="contact-lastName" name="lastName" label={fieldLabel('Last name *')} autoComplete="family-name" required pattern=".*\S.*" />
                        <Input id="contact-email" name="email" label={fieldLabel('Work email address *')} type="email" autoComplete="email" required />
                        <Input id="contact-company" name="company" label={fieldLabel('Company *')} autoComplete="organization" required pattern=".*\S.*" />
                        <ContactSelect name="role" label="Role" options={ROLES} />
                        <Input id="contact-jobTitle" name="jobTitle" label={fieldLabel('Job title (optional)')} autoComplete="organization-title" />
                        <ContactSelect name="country" label="Country/Region" options={countries} autoComplete="country-name" />
                        <fieldset className={styles.teamSize}>
                            <legend>{fieldLabel('Engineering team size *')}</legend>
                            <div className={styles.sizeOptions}>
                                {TEAM_SIZES.map((size) => (
                                    <label key={size} className={cn(textCn('rs-text-3'), styles.sizeOption)}>
                                        <input type="radio" name="teamSize" value={size} required />
                                        <span>{size}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                    <Input
                        id="contact-components"
                        name="components"
                        label={fieldLabel('Components and versions (optional)')}
                        placeholder="Kotlin, Ktor, kotlinx libraries, or other components"
                    />
                    <Textarea
                        id="contact-needs"
                        name="needs"
                        label={fieldLabel('What would you like to discuss? (optional)')}
                        placeholder="Tell us about your support needs or what makes updating difficult."
                        minRows={4}
                    />
                    <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.privacy)}>
                        Read the{' '}
                        <a className={textCn('rs-link')} href="https://www.jetbrains.com/legal/docs/privacy/privacy/">
                            JetBrains Privacy Policy
                        </a>
                        .
                    </p>
                    <Button type="submit" size="l" className={styles.submit}>
                        Preview request
                    </Button>
                </fieldset>
                {previewed && (
                    <div role="status" className={cn(textCn('rs-text-2'), styles.result)}>
                        <strong>Request preview complete</strong>
                        <p>No request has been sent. This preview does not contact the Kotlin team.</p>
                    </div>
                )}
            </form>
        </FormLayout>
    );
};
