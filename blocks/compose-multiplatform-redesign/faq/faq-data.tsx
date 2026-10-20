import React, { ReactNode } from 'react';

// Copy verbatim from the mock (.f2c/pages/compose-multiplatform-redesign/manifest.json, section 07-faq).
// One entry per paragraph as the dump groups them; the markup step regroups
// them into headings, leads and cards but never rewrites a character.
export const FAQ_COPY: { id: string; text: ReactNode }[] = [
    { id: 'faq-1', text: 'FAQ' },
    { id: 'faq-2', text: 'What’s the difference between Kotlin Multiplatform and Compose Multiplatform?' },
    { id: 'faq-3', text: 'Are Kotlin Multiplatform and Compose Multiplatform ready for production?' },
    { id: 'faq-4', text: 'How is Kotlin Multiplatform different from Flutter or React Native?' }
];
