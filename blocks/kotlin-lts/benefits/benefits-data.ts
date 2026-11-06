export type BenefitItem = {
    title: string;
    text: string;
};

export const BENEFIT_ITEMS: BenefitItem[] = [
    {
        title: 'Priority patching',
        text: "Receive security fixes before vulnerabilities are publicly disclosed, so attackers won't have a chance to exploit them."
    },
    {
        title: 'Private maintenance releases',
        text: 'Patched artifacts available through a subscriber-only repository.'
    },
    {
        title: 'Verified updates',
        text: 'Every maintenance release validated by our engineering teams through full automated test suites and manual verification.'
    },
    {
        title: 'Contractual SLAs',
        text: 'Severity-based commitments for response and fix delivery.'
    }
];
