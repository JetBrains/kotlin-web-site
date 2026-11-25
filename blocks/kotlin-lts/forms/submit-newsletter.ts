import { privacy } from '@jetbrains/kotlin-web-site-ui/out/packages/data-services';

const FORM_ID = '10127';
const CONSENT_ID = 'mkt.general.jb-intention';

export async function submitNewsletter(email: string) {
    const consent = await privacy.sendAcceptance(CONSENT_ID, email, { useNewEndpoint: true });
    if (!consent.ok) throw new Error('Consent request failed');

    const fields = {
        formid: FORM_ID,
        Email: email,
        kotlinSecurityNewsletter: true,
        munchkinId: '426-QVD-114',
        formVid: FORM_ID,
    };

    // Match the website UI client's Form Service checksum format.
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(Object.values(fields).join('|')));
    const checksum = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
    const response = await fetch('https://forms-service.jetbrains.com/marketo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, checksum, checksumFields: Object.keys(fields).join(',') }),
    });

    if (!response.ok) throw new Error('Newsletter signup failed');
}
