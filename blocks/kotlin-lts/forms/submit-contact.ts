import { formService } from '@webteam/data-services';
import type { Submitter } from '@webteam/forms';
import { loadGoogleCaptchaScript } from '@webteam/forms/lib/captcha/googleCaptcha';
import { getTencentToken, loadTencentCaptchaScript } from '@webteam/forms/lib/captcha/tencentCaptcha';
import { getTencentNextToken, loadTencentNextCaptchaScript } from '@webteam/forms/lib/captcha/tencentNextCaptcha';

export const FORM_ID = 'consent/10118';
export const CONSENT_ID = 'mkt.general.user-intention';
const EMAIL_VALIDATION_URL = 'https://account.jetbrains.com/services/rest/validation/v1/checkEmail';
const SUBMISSION_FAILED = 'We couldn’t send your request. Please try again.';

type Assessment = {
    assessmentType: string;
    requestId: string;
    captchaDetails?: { siteKey?: string };
};

type FormsServiceResponse = {
    success?: boolean;
    assessment?: Assessment;
};

async function validateWorkEmail(email: string): Promise<string | null> {
    const url = new URL(EMAIL_VALIDATION_URL);
    url.searchParams.set('email', email);

    try {
        const response = await fetch(url, {
            headers: { Accept: 'application/json' },
            signal: AbortSignal.timeout?.(10_000),
        });
        if (!response.ok) throw new Error('Work email validation failed');

        const result = await response.json();
        if (result.isFree || result.isDisposable || result.isEducational) {
            return 'Enter your work email address.';
        }
        if (result.isValid !== true || result.isUnderPurchaseSanctions) {
            return 'Enter a valid work email address.';
        }
        return null;
    } catch {
        return 'We couldn’t verify your work email address. Please try again.';
    }
}

function postJson(url: string | URL, body: object) {
    return fetch(url, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        referrerPolicy: 'strict-origin-when-cross-origin',
        signal: AbortSignal.timeout?.(25_000),
    });
}

async function assessSubmission({ assessmentType, requestId, captchaDetails }: Assessment) {
    const siteKey = captchaDetails?.siteKey;
    if (!requestId || !siteKey) throw new Error('Forms Service returned an incomplete CAPTCHA challenge');

    let captchaResult: object;
    switch (assessmentType) {
        case 'reCaptcha v3':
            await loadGoogleCaptchaScript(siteKey);
            await new Promise<void>((resolve) => window.grecaptcha.ready(resolve));
            captchaResult = { token: await window.grecaptcha.execute(siteKey, { action: 'submit' }) };
            break;
        case 'tencent':
            await loadTencentCaptchaScript();
            captchaResult = await getTencentToken(siteKey, 'zh-cn');
            break;
        case 'tencent_next':
            await loadTencentNextCaptchaScript();
            captchaResult = await getTencentNextToken(siteKey, 'zh-cn');
            break;
        default:
            throw new Error('Forms Service returned an unsupported CAPTCHA challenge');
    }

    const response = await postJson(new URL('/assessment', formService.urls.submitUrl), {
        requestId,
        assessmentResponse: { ...captchaResult, type: assessmentType },
    });
    if (!response.ok || (await response.json())?.success !== true) {
        throw new Error('Forms Service did not accept the CAPTCHA response');
    }
}

export const submitContact: Submitter = async (formData) => {
    const emailError = await validateWorkEmail(String(formData.email ?? ''));
    if (emailError) throw { email: emailError };

    try {
        // Form 10118 is registered with the Forms Service schema and consent handler.
        const response = await postJson(formService.urls.submitUrl, formData);
        if (!response.ok && response.status !== 429) {
            throw new Error('Forms Service request failed');
        }

        const result: FormsServiceResponse = await response.json();
        if (response.ok && result?.success === true) return { success: true };
        if (result?.assessment) {
            await assessSubmission(result.assessment);
            return { success: true };
        }
    } catch {
        throw { form: SUBMISSION_FAILED };
    }

    throw { form: SUBMISSION_FAILED };
};
