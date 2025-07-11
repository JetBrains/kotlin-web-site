import React, { useState, FC } from 'react';
import { privacy } from '@jetbrains/kotlin-web-site-ui/out/packages/data-services';
import '@jetbrains/kotlin-web-site-ui/out/components/typography';
import { FormikInput, FormikSubmitButton, FormikPrivacyCheckbox } from '@jetbrains/kotlin-web-site-ui/out/blocks/formik-wrapper';

import { Formik, Form } from 'formik';
import { validateForm } from './forms-validation';
import createMarketoSubmitter from './create-marketo-submitter';
import styles from './subscription-form.module.css';
import CheckIcon from '@rescui/icons/lib/check';

const FORM_ID = '4687';
const consentId = privacy.ConsentId.NEWSLETTER;
const initialValues = {
  Email: ''
};

export const SubscriptionForm: FC = () => {
  const [isSubmitted, setSubmitted] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={(values, formikBag) => {
        createMarketoSubmitter({
          onSubmitted: () => setSubmitted(true),
          formId: FORM_ID,
          consentIds: consentId,
          valuesTransformer: values => {
            return {
              Email: values.Email,
              kotlinforEducationNewsletter: true,
              privacyConsent: true
            };
          }
        })(values, formikBag);
      }}
    >
      {({ setFieldValue }) => (
        <Form className={styles.form}>
          <img 
            src="/assets/images/ktl-component/teach/icons/mail.svg"
            className={styles.icon} 
            alt="Subscribe form"
          />

          <div className={`${styles.text} ktl-h3`}>
            Subscribe to be the first to know about new resources, webinars, and educational initiatives.
          </div>

          <FormikInput
            name="Email"
            placeholder="Email address"
            type="email"
            onClear={() => setFieldValue('Email', '')}
            className={styles.input}
          />

          <FormikPrivacyCheckbox 
            consentId={consentId} 
            privacy={privacy} 
            className={styles.checkbox} 
          />

          {isSubmitted ? (
            <span className={`${styles.button} ${styles.submitted}`}>
              <span className={styles.submittedText}>Subscribe</span>
              <CheckIcon className={styles.submittedIcon} />
            </span>
          ) : (
            <FormikSubmitButton
              size="m"
              className={styles.button}
            >
              Subscribe
            </FormikSubmitButton>
          )}
        </Form>
      )}
    </Formik>
  );
};