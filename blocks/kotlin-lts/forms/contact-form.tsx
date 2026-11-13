import React, { FC } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { Input } from '@rescui/input';
import { Textarea } from '@rescui/textarea';
import { useTextStyles } from '@rescui/typography';

import { FormLayout } from './form-layout';
import { usePreviewForm } from './use-preview-form';
import styles from './forms.module.css';

export const ContactForm: FC = () => {
    const textCn = useTextStyles();
    const { ready, previewed, setPreviewed, handleSubmit } = usePreviewForm();

    return (
        <FormLayout
            eyebrow="Contact the Kotlin team"
            title="Discuss a commercial subscription"
            intro="Talk to the Kotlin team about your required coverage, supported versions, upgrade constraints, and support period. We’ll review your needs together and discuss whether commercial support is a fit."
            aside={
                <>
                    <h2 className={cn(textCn('rs-h3'), styles.asideTitle)}>What happens next</h2>
                    <ol className={cn(textCn('rs-text-2'), styles.nextSteps)}>
                        <li>We review your support requirements.</li>
                        <li>We contact you to discuss components, versions, and update constraints.</li>
                        <li>Together, we establish coverage and whether a commercial subscription fits your needs.</li>
                    </ol>
                    <p className={textCn('rs-text-2', { hardness: 'average' })}>
                        You can start the conversation before you know the exact coverage you need.
                    </p>
                </>
            }
        >
            <form
                onSubmit={handleSubmit}
                onInput={() => setPreviewed(false)}
                aria-label="Commercial support inquiry preview"
            >
                <fieldset disabled={!ready} className={styles.fields}>
                    <legend className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.required)}>
                        * Required fields
                    </legend>
                    <div className={styles.row}>
                        <Input
                            id="contact-name"
                            name="name"
                            label="Full name *"
                            autoComplete="name"
                            required
                            pattern=".*\S.*"
                        />
                        <Input
                            id="contact-email"
                            name="email"
                            label="Work email *"
                            type="email"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <Input
                        id="contact-company"
                        name="company"
                        label="Company *"
                        autoComplete="organization"
                        required
                        pattern=".*\S.*"
                    />
                    <Input
                        id="contact-components"
                        name="components"
                        label="Components and versions (optional)"
                        placeholder="Kotlin, Ktor, kotlinx libraries, or other components"
                    />
                    <Textarea
                        id="contact-needs"
                        name="needs"
                        label="What would you like to discuss? (optional)"
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
