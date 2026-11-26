import React, { FC, FormEvent, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { Input } from '@rescui/input';
import { useTextStyles } from '@rescui/typography';

import { submitNewsletter } from './submit-newsletter';
import styles from './newsletter.module.css';

type SignupStatus = 'idle' | 'submitting' | 'subscribed' | 'error';

export const NewsletterForm: FC = () => {
    const textCn = useTextStyles();
    const [ready, setReady] = useState(false);
    const [status, setStatus] = useState<SignupStatus>('idle');
    const submitting = useRef(false);

    useEffect(() => setReady(true), []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!ready || submitting.current || status === 'subscribed') return;

        const email = String(new FormData(event.currentTarget).get('Email') ?? '').trim();
        if (!email) return;

        submitting.current = true;
        setStatus('submitting');
        try {
            await submitNewsletter(email);
            setStatus('subscribed');
        } catch {
            setStatus('error');
        } finally {
            submitting.current = false;
        }
    };

    return (
        <form
            method="post"
            className={styles.form}
            onSubmit={handleSubmit}
            onInput={() => setStatus('idle')}
            aria-label="Kotlin Security Newsletter signup"
        >
            <noscript>Enable JavaScript to use this form.</noscript>
            <fieldset disabled={!ready || status === 'submitting'} className={styles.fields}>
                <Input
                    id="newsletter-email"
                    name="Email"
                    label="Email address"
                    aria-describedby="newsletter-privacy"
                    type="email"
                    autoComplete="email"
                    size="l"
                    required
                />
                <details className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.consent)}>
                    <summary>
                        <span id="newsletter-privacy">
                            I agree that my personal data will be processed for this purpose.
                        </span>{' '}
                        <span className={styles.privacyInfo} aria-hidden="true">
                            i
                        </span>
                        <span className={styles.visuallyHidden}> Privacy details</span>
                    </summary>
                    <p>
                        By submitting this form, I agree that JetBrains s.r.o. may process the personal data I provided
                        above and my location for the purpose explained above and may engage{' '}
                        <a
                            className={textCn('rs-link')}
                            href="https://www.jetbrains.com/legal/privacy/third-parties.html"
                        >
                            third parties
                        </a>{' '}
                        in such processing. The consent can be revoked in{' '}
                        <a className={textCn('rs-link')} href="https://account.jetbrains.com/profile-details/privacy">
                            my profile
                        </a>{' '}
                        at any time. More details about the processing are in{' '}
                        <a className={textCn('rs-link')} href="https://www.jetbrains.com/legal/docs/privacy/privacy/">
                            JetBrains Privacy Notice
                        </a>
                        . In addition, an unsubscribe link is included in each email.
                    </p>
                </details>
                <Button type="submit" size="l" disabled={status === 'subscribed'} className={styles.subscribe}>
                    {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
                </Button>
            </fieldset>
            <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.unsubscribe)}>
                You can unsubscribe at any time.
            </p>
            {status === 'subscribed' && (
                <p role="status" className={cn(textCn('rs-text-2'), styles.result)}>
                    Thanks for signing up for the Kotlin Security Newsletter.
                </p>
            )}
            {status === 'error' && (
                <p role="alert" className={cn(textCn('rs-text-2'), styles.result)}>
                    We couldn’t complete your signup. Please try again.
                </p>
            )}
        </form>
    );
};
