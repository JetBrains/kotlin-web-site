import React, { FC, FormEvent, useRef, useState } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { Checkbox } from '@rescui/checkbox';
import { Input } from '@rescui/input';
import { useTextStyles } from '@rescui/typography';

import { FormLayout } from './form-layout';
import { usePreviewForm } from './use-preview-form';
import styles from './forms.module.css';

const TOPICS = [
    {
        value: 'core',
        title: 'Kotlin Core',
        description:
            'Compiler, standard library, and official kotlinx libraries, including coroutines and serialization.',
    },
    {
        value: 'kotlin-ecosystem',
        title: 'Kotlin ecosystem',
        description: 'Ktor, its plugins, and Exposed.',
    },
    {
        value: 'jvm',
        title: 'Broader JVM ecosystem',
        description: 'Relevant JVM libraries, build tools, data services, and deployment dependencies.',
    },
];

export const NewsletterForm: FC = () => {
    const textCn = useTextStyles();
    const { ready, previewed, setPreviewed, handleSubmit } = usePreviewForm();
    const [selected, setSelected] = useState<string[]>([]);
    const [topicError, setTopicError] = useState(false);
    const firstTopic = useRef<HTMLInputElement>(null);

    const previewSignup = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selected.length === 0) {
            setPreviewed(false);
            setTopicError(true);
            firstTopic.current?.focus();
            return;
        }
        handleSubmit(event);
    };

    return (
        <FormLayout
            eyebrow="Free newsletter"
            title="Security updates for Kotlin teams"
            intro="Follow relevant vulnerabilities, affected versions, and available fixes. Choose the security updates you want to receive."
            aside={
                <>
                    <h2 className={cn(textCn('rs-h3'), styles.asideTitle)}>Choose what is relevant to you</h2>
                    <p className={textCn('rs-text-2')}>
                        Each topic is independent. For example, you can select Kotlin Core and the broader JVM ecosystem
                        together.
                    </p>
                    <p className={textCn('rs-text-2', { hardness: 'average' })}>
                        These are newsletter preferences. They do not define commercial patch coverage or enroll you in
                        a paid subscription.
                    </p>
                </>
            }
        >
            <form
                onSubmit={previewSignup}
                onInput={() => setPreviewed(false)}
                aria-label="Security newsletter signup preview"
            >
                <fieldset disabled={!ready} className={styles.fields}>
                    <legend className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.required)}>
                        * Required fields
                    </legend>
                    <Input
                        id="newsletter-email"
                        name="email"
                        label="Email *"
                        type="email"
                        autoComplete="email"
                        required
                    />
                    <fieldset
                        className={styles.topics}
                        aria-describedby="topic-hint topic-error"
                        aria-invalid={topicError}
                    >
                        <legend className={cn(textCn('rs-h4'), styles.topicLegend)}>Security update topics *</legend>
                        <p id="topic-hint" className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.hint)}>
                            Choose any combination. Select at least one topic.
                        </p>
                        {TOPICS.map(({ value, title, description }, index) => (
                            <Checkbox
                                key={value}
                                name="topics"
                                value={value}
                                ref={index === 0 ? firstTopic : undefined}
                                checked={selected.includes(value)}
                                className={styles.topic}
                                onChange={(event) => {
                                    setSelected(
                                        event.target.checked
                                            ? [...selected, value]
                                            : selected.filter((item) => item !== value)
                                    );
                                    setTopicError(false);
                                    setPreviewed(false);
                                }}
                            >
                                <span className={textCn('rs-text-2')}>
                                    <strong>{title}</strong>
                                    <span
                                        className={cn(
                                            textCn('rs-text-2', { hardness: 'average' }),
                                            styles.topicDescription
                                        )}
                                    >
                                        {description}
                                    </span>
                                </span>
                            </Checkbox>
                        ))}
                        <p
                            id="topic-error"
                            role="alert"
                            hidden={!topicError}
                            className={cn(textCn('rs-text-2'), styles.error)}
                        >
                            Please select at least one security update topic.
                        </p>
                    </fieldset>
                    <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.privacy)}>
                        Read the{' '}
                        <a className={textCn('rs-link')} href="https://www.jetbrains.com/legal/docs/privacy/privacy/">
                            JetBrains Privacy Policy
                        </a>
                        .
                    </p>
                    <Button type="submit" size="l" className={styles.submit}>
                        Preview signup
                    </Button>
                </fieldset>
                {previewed && (
                    <div role="status" className={cn(textCn('rs-text-2'), styles.result)}>
                        <strong>Email confirmation preview</strong>
                        <p>No email has been sent and no subscription has been created.</p>
                    </div>
                )}
            </form>
        </FormLayout>
    );
};
