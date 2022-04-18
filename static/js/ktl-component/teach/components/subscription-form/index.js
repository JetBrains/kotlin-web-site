import React, {useState} from 'react';
import {privacy} from '@jetbrains/kotlin-web-site-ui/out/packages/data-services';
import '@jetbrains/kotlin-web-site-ui/out/components/typography';
import {FormikInput, FormikSubmitButton, FormikPrivacyCheckbox} from '@jetbrains/kotlin-web-site-ui/out/blocks/formik-wrapper';

import {Formik, Form} from 'formik';
import {validateForm} from './forms-validation';
import createMarketoSubmitter from './create-marketo-submitter';
import './index.scss';
import CheckIcon from '@rescui/icons/lib/check';

const FORM_ID = '4516';
const consentId = privacy.ConsentId.NEWSLETTER;
const initialValues = {
  Email: ''
};

export const SubscriptionForm = () => {
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
      {({setFieldValue}) => (
        <Form className="teach-subscription-form">
          <img src="/assets/images/ktl-component/teach/icons/mail.svg"
               className="teach-subscription-form__icon" alt="Subscribe form"/>

          <div className="teach-subscription-form__text ktl-h3">
            Subscribe to be the first to know about new resources, webinars, and educational initiatives.
          </div>

          <FormikInput
            name="Email"
            placeholder="Email address"
            type="email"
            onClear={() => setFieldValue('Email', '')}
            className="teach-subscription-form__input"
          />

          <FormikPrivacyCheckbox consentId={consentId} privacy={privacy} className="teach-subscription-form__checkbox" />

          {isSubmitted ?
            <span className="teach-subscription-form__button teach-subscription-form__submitted">
              <span className="teach-subscription-form__submitted-text">Subscribe</span>
              <CheckIcon className="teach-subscription-form__submitted-icon" />
            </span>
            :
            <FormikSubmitButton
              size="m"
              className="teach-subscription-form__button"
            >
              Subscribe
            </FormikSubmitButton>
          }
        </Form>
      )}
    </Formik>
  );
};
