import cn from 'classnames';

import { Checkbox, Form, Input, SubmitButton } from '@webteam/forms';
import type { Submitter } from '@webteam/forms';
import { privacy, submitToMarketo } from '@webteam/data-services';
import { useTextStyles } from '@rescui/typography';

import styles from './invitation.module.css';

// TODO(marketing): confirm the Marketo form id and field names before the release (KTL-5273).
const FORM_ID = 'TODO';
// TODO(marketing): confirm the consent id; USER_INTENTION is the non-deprecated default (KTL-5273).
const CONSENT_ID = privacy.ConsentId.USER_INTENTION;
// TODO(marketing): confirm the Marketo field name for the terms flag (KTL-5273).
const TERMS_FIELD = 'ambassadorsTermsAccepted';
// TODO(marketing): confirm the Marketo field name for the newsletter opt-in (KTL-5273).
const NEWSLETTER_FIELD = 'privacyConsent';
// TODO(marketing): replace with the real Terms & Conditions URL before the release (KTL-5273).
const TERMS_URL = '#';
const PRIVACY_URL = 'https://www.jetbrains.com/legal/docs/privacy/privacy/';

// Checkbox errors bypass the form dictionary and a field validator makes the webteam Checkbox
// re-render in a loop, so the terms acceptance is enforced in the submitter instead: the
// rejection maps straight onto the field and renders the message as-is.
const TERMS_REQUIRED_MESSAGE = 'This field is required';

const submitter: Submitter = async function submitter(formData) {
    const email = String(formData.email ?? '');
    const newsletterOptIn = Boolean(formData.newsletterOptIn);

    if (!formData.termsAccepted) {
        return Promise.reject({ termsAccepted: TERMS_REQUIRED_MESSAGE });
    }

    // Fail fast until marketing provides the real form id: a placeholder must never
    // reach the live forms service.
    if (FORM_ID === 'TODO') {
        return Promise.reject({ form: 'The form is not configured yet, please try again later.' });
    }

    try {
        if (newsletterOptIn) {
            // The consent is recorded only for an explicit opt-in.
            await privacy.sendAcceptance(CONSENT_ID, email);
        }

        await submitToMarketo({
            formid: FORM_ID,
            FirstName: formData.FirstName,
            LastName: formData.LastName,
            Email: email,
            [TERMS_FIELD]: Boolean(formData.termsAccepted),
            [NEWSLETTER_FIELD]: newsletterOptIn
        });
    } catch {
        return Promise.reject({
            form: 'An error occurred while sending your message, please try again later.'
        });
    }

    // TODO(design): replace with the real success state when its design arrives (KTL-5273).
    window.alert('Thank you for accepting the invitation!');

    return { success: true, cause: [] };
};

export function Invitation() {
    const textCn = useTextStyles();

    return (
        <section data-testid="kotlin-ambassador-invitation">
            <div
                className={cn('ktl-layout-v2', 'ktl-layout--center', styles.gradientCard)}
                data-testid="kotlin-ambassador-gradient-card"
            >
                <div className={styles.intro} data-testid="kotlin-ambassador-intro">
                    <p className={cn(textCn('rs-subtitle-2'), styles.introText)}>
                        Your work makes a difference to the Kotlin community. You share your knowledge, inspire other
                        developers, and help the ecosystem grow &ndash; and we&rsquo;d love to recognize that.
                    </p>
                    <p className={cn(textCn('rs-subtitle-2'), styles.introText)}>
                        We&rsquo;d love to invite you to join the Kotlin Ambassadors Program: a community of experts,
                        creators, educators, and community leaders who share your passion for Kotlin.
                    </p>
                </div>
                <div className={styles.formCard} data-testid="kotlin-ambassador-form-card">
                    <Form formId={FORM_ID} submitter={submitter} className={styles.form}>
                        <div className={styles.fields}>
                            <Input
                                name="FirstName"
                                label="First name"
                                placeholder="Your first name"
                                required
                                className={styles.field}
                            />
                            <Input
                                name="LastName"
                                label="Last name"
                                placeholder="Your last name"
                                required
                                className={styles.field}
                            />
                            <Input
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="Your email"
                                required
                                className={styles.field}
                            />
                            {/* `writeFalse` keeps the field key in the form data, so the submitter
                                rejection maps onto this field instead of the generic form error. */}
                            <Checkbox name="termsAccepted" writeFalse size="s" className={styles.checkbox}>
                                I agree to the{' '}
                                <a className={textCn('rs-link')} href={TERMS_URL} target="_blank" rel="noreferrer noopener">
                                    Terms &amp; Conditions
                                </a>{' '}
                                and{' '}
                                <a className={textCn('rs-link')} href={PRIVACY_URL} target="_blank" rel="noreferrer noopener">
                                    Privacy Policy
                                </a>
                                .
                            </Checkbox>
                            <Checkbox name="newsletterOptIn" writeFalse size="s" className={styles.checkbox}>
                                Send me helpful educational materials and program news.
                            </Checkbox>
                        </div>
                        <SubmitButton mode="classic" size="l">
                            Accept invitation
                        </SubmitButton>
                    </Form>
                </div>
            </div>
        </section>
    );
}
