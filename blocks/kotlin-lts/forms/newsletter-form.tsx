import React, { FC, FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { Input } from '@rescui/input';
import { useTextStyles } from '@rescui/typography';

import cubeGraphics from '@/public/images/state-of-kotlin-2026/deco-cube.webp';
import sphereGraphics from '@/public/images/state-of-kotlin-2026/deco-sphere.webp';
import { FormLayout } from './form-layout';
import { submitNewsletter } from './submit-newsletter';
import styles from './forms.module.css';

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
        <FormLayout
            title="Kotlin Security Newsletter"
            intro="Fixed CVEs, affected versions, and dependency updates in a free, regular digest."
            artwork={
                <div className={styles.newsletterShapes}>
                    <Image src={cubeGraphics} alt="" sizes="180px" />
                    <Image src={sphereGraphics} alt="" sizes="112px" />
                </div>
            }
        >
            <form
                onSubmit={handleSubmit}
                onInput={() => setStatus('idle')}
                aria-label="Security newsletter signup"
            >
                <fieldset disabled={!ready || status === 'submitting'} className={cn(styles.fields, styles.newsletterFields)}>
                    <Input
                        id="newsletter-email"
                        name="Email"
                        aria-label="Email"
                        aria-describedby="newsletter-privacy"
                        placeholder="Email"
                        type="email"
                        autoComplete="email"
                        required
                    />
                    <details className={cn(textCn('rs-text-2'), styles.newsletterConsent)}>
                        <summary>
                            <span id="newsletter-privacy">I agree that my personal data will be processed for this purpose.</span>{' '}
                            <span className={styles.privacyInfo} aria-hidden="true">i</span>
                            <span className={styles.visuallyHidden}> Privacy details</span>
                        </summary>
                        <p>
                            By submitting this form, I agree that JetBrains s.r.o. may process the personal data I
                            provided above and my location for the purpose explained above and may engage{' '}
                            <a className={textCn('rs-link')} href="https://www.jetbrains.com/legal/privacy/third-parties.html">
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
                    <Button
                        type="submit"
                        size="l"
                        disabled={!ready || status === 'submitting' || status === 'subscribed'}
                        className={cn(styles.submit, styles.newsletterSubmit)}
                    >
                        {status === 'submitting' ? 'Submitting…' : 'Submit'}
                    </Button>
                </fieldset>
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
        </FormLayout>
    );
};
