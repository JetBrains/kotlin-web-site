import React from 'react';
import cn from 'classnames';
import { createTextCn } from '@rescui/typography';
import { Button } from '@rescui/button';
import styles from './note-block.module.css';
import { Stamp } from './stamp';
import { Form, Textarea, Input, SubmitButton, PrivacyConsent, createFormServiceSubmitter } from '@webteam/forms';

const textCn = createTextCn('dark');

function SubmitMessage({ onSendMore }: { onSendMore: () => void }) {
    return (
        <div className={styles.successMessage}>
            <span className={textCn('rs-subtitle-2')}>Thank you for your note!</span>
            <Button mode="outline" size={'l'} className={styles.sendMoreButton} onClick={onSendMore}>Send more</Button>
        </div>
    );
}

export const NoteBlock = () => {
    const [formKey, setFormKey] = React.useState(0);
    const submitter = createFormServiceSubmitter('https://forms-service.jetbrains.com/feedback');
    const submitMessage = React.useCallback(() => <SubmitMessage onSendMore={() => setFormKey(k => k + 1)} />, []);

    return (
        <div className={styles.noteBlock}>
            <div className={styles.inner}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h2 className={cn(textCn('rs-h1'), styles.title)}>Leave a Note for Kotlin&apos;s Future!</h2>
                        <div className={cn(textCn('rs-subtitle-2', { hardness: 'hard' }), styles.subtitle)}>
                            Share a birthday wish or a bold prediction for where Kotlin&apos;s headed next.
                        </div>
                    </div>
                    <div className={styles.stampDesktop}>
                        <Stamp />
                    </div>
                </div>

                <Form
                    key={formKey}
                    formId="9613"
                    debug={true}
                    submitter={submitter}
                    submitMessage={submitMessage}
                    className={styles.form}
                >
                    <div className={styles.textareaWrapper}>
                        <Textarea
                            name="details"
                            label="Write your note for Kotlin's future"
                            className={styles.textarea}
                            minRows={12}
                            maxRows={12}
                            required
                            autoComplete={'off'}
                            boldLabel={false}
                            note={<></>}
                        />
                        <div className={styles.stampMobile}>
                            <Stamp />
                        </div>
                    </div>

                    <div className={styles.fields}>
                        <Input label="First Name" name="FirstName" type="text" required className={styles.input} />
                        <Input label="Last Name" name="LastName" type="text" className={styles.input} />
                        <Input label="Your Email" name="email" type="email" className={styles.input} required />
                        <PrivacyConsent consentId="mkt.general.user-intention" required />
                        <SubmitButton mode="rock" className={styles.submitButton}>
                            Send the Note
                        </SubmitButton>
                    </div>
                </Form>
            </div>

        </div>
    );
};
