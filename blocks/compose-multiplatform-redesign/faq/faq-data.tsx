import { ReactNode } from 'react';

// Copy verbatim from the mock (section 07-faq). The mock draws only the questions;
// the answer is a placeholder (R12) so the accordion can be operated.
export const FAQ_TITLE: ReactNode = 'FAQ';

export const FAQ_ANSWER_PLACEHOLDER = 'Answer copy to follow — the mock carries only the question.';

export const FAQ_COLUMNS: { id: string; question: ReactNode }[][] = [
    [
        { id: 'faq-1', question: 'What’s the difference between Kotlin Multiplatform and Compose Multiplatform?' },
        { id: 'faq-2', question: 'Are Kotlin Multiplatform and Compose Multiplatform ready for production?' },
    ],
    [{ id: 'faq-3', question: 'How is Kotlin Multiplatform different from Flutter or React Native?' }],
];
