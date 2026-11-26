import React, { FC, useEffect, useRef } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './newsletter.module.css';

export const NewsletterConsent: FC<{ messageId: string }> = ({ messageId }) => {
    const textCn = useTextStyles();
    const disclosureRef = useRef<HTMLDetailsElement>(null);
    const triggerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const disclosure = disclosureRef.current;

        const dismissOutside = (event: PointerEvent) => {
            if (disclosure.open && !disclosure.contains(event.target as Node)) {
                disclosure.open = false;
            }
        };

        const dismissOnEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || !disclosure.open) return;

            if (disclosure.contains(document.activeElement)) triggerRef.current?.focus();
            disclosure.open = false;
        };

        document.addEventListener('pointerdown', dismissOutside);
        document.addEventListener('keydown', dismissOnEscape);
        return () => {
            document.removeEventListener('pointerdown', dismissOutside);
            document.removeEventListener('keydown', dismissOnEscape);
        };
    }, []);

    return (
        <div
            className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.consent)}
            onPointerLeave={(event) => {
                const disclosure = disclosureRef.current;
                if (event.pointerType === 'mouse' && !disclosure.contains(document.activeElement)) {
                    disclosure.open = false;
                }
            }}
        >
            <span id={messageId}>I agree that my personal data will be processed for this purpose.</span>{' '}
            <details
                className={styles.privacyDetails}
                ref={disclosureRef}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                        event.currentTarget.open = false;
                    }
                }}
            >
                <summary
                    aria-label="Privacy details"
                    className={styles.privacyInfo}
                    ref={triggerRef}
                    onPointerEnter={(event) => {
                        if (event.pointerType === 'mouse') disclosureRef.current.open = true;
                    }}
                    onFocus={(event) => {
                        if (event.currentTarget.matches(':focus-visible')) disclosureRef.current.open = true;
                    }}
                >
                    <span aria-hidden="true">i</span>
                </summary>
                <div className={styles.privacyPopover}>
                    <p className={textCn('rs-text-3')}>
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
                </div>
            </details>
        </div>
    );
};
