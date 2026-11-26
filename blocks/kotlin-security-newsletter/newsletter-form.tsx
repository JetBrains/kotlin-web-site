import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Form, Hidden, Input, SubmitButton } from '@webteam/forms';

import { NewsletterConsent } from './newsletter-consent';
import { submitNewsletter } from './submit-newsletter';
import { CONSENT_ID, FORM_ID, PRIVACY_MESSAGE_ID } from './constants';
import styles from './newsletter.module.css';

const SubmitMessage: FC = () => {
    const textCn = useTextStyles();

    return (
        <p role="status" className={cn(textCn('rs-text-2'), styles.result)}>
            Thanks for signing up for the Kotlin Security Newsletter.
        </p>
    );
};

export const NewsletterForm: FC = () => {
    const [ready, setReady] = useState(false);

    useEffect(() => setReady(true), []);

    return (
        <Form
            formId={FORM_ID}
            submitter={submitNewsletter}
            submitMessage={SubmitMessage}
            className={styles.form}
        >
            <noscript>Enable JavaScript to use this form.</noscript>
            <fieldset disabled={!ready} className={styles.fields}>
                <Hidden name="kotlinSecurityNewsletter" type="boolean" value={true} />
                <Hidden name="privacyConsent" type="boolean" value={true} />
                <Hidden name="privacyConsentType" type="array" value={[CONSENT_ID]} />
                <Input
                    id="newsletter-email"
                    name="Email"
                    aria-label="Email address"
                    placeholder="your.email@example.com"
                    aria-describedby={PRIVACY_MESSAGE_ID}
                    type="email"
                    autoComplete="email"
                    size="l"
                    required
                />
                <NewsletterConsent messageId={PRIVACY_MESSAGE_ID} />
                <SubmitButton size="l" className={styles.subscribe}>
                    Subscribe
                </SubmitButton>
            </fieldset>
        </Form>
    );
};
