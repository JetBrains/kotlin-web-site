import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { createFormServiceSubmitter, Form, Hidden, Input, PrivacyNotice, SubmitButton } from '@webteam/forms';

import { CONSENT_ID, FORM_ID } from './constants';
import styles from './newsletter.module.css';

const SubmitMessage: FC = () => {
    const textCn = useTextStyles();

    return (
        <p role="status" className={cn(textCn('rs-text-2'), styles.result)}>
            Thanks for signing up for the Kotlin Security Newsletter.
        </p>
    );
};

const submitter = createFormServiceSubmitter('https://forms-service.jetbrains.com/feedback');

export const NewsletterForm: FC = () => {
    const [ready, setReady] = useState(false);

    useEffect(() => setReady(true), []);

    return (
        <Form
            formId={FORM_ID}
            submitter={submitter}
            submitMessage={SubmitMessage}
            className={styles.form}
        >
            <noscript>Enable JavaScript to use this form.</noscript>
            <fieldset disabled={!ready} className={styles.fields}>
                <Hidden name="kotlinSecurityNewsletter" type="boolean" value={true} />
                <Input
                    id="newsletter-email"
                    name="email"
                    aria-label="Email address"
                    placeholder="your.email@example.com"
                    type="email"
                    autoComplete="email"
                    size="l"
                    required
                />
                <PrivacyNotice consentId={CONSENT_ID} size="m" preferShortText />
                <SubmitButton size="l" className={styles.subscribe}>
                    Subscribe
                </SubmitButton>
            </fieldset>
        </Form>
    );
};
