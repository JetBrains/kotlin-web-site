import React, { FC } from 'react';
import cn from 'classnames';
import { PlusOutlineIcon, MinusOutlineIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';

import { PUBLIC_SUPPORT_URL, SECTION_IDS } from '../constants';
import shared from '../kotlin-lts.module.css';
import styles from './faq.module.css';

// Provisional answers and the outstanding owner decisions are recorded in ../REVIEW.md.
const FAQ_ITEMS = [
    {
        question: 'What does paid support add to public Kotlin security support?',
        answer: 'Public security support covers the JVM standard library under the published policy. A commercial subscription defines an agreed scope for targeted patches, private delivery, and support terms. Discuss the additional support your team needs with us.',
    },
    {
        question: 'Which components, platforms, and release lines are covered?',
        answer: 'Coverage needs to be agreed for your subscription. Share the components, platforms, and release lines you use so the team can confirm available coverage and any exclusions.',
    },
    {
        question: 'Can I stay on my exact version?',
        answer: 'Share your current versions and upgrade constraints with the team. Support is scoped to agreed release lines; confirm which patch version you would need to use before choosing a subscription.',
    },
    {
        question: 'How do we receive patches, and what testing is still needed?',
        answer: 'Review subscriber repository access and build requirements with the team. Your team integrates the patched dependency and remains responsible for application testing, approval, and deployment.',
    },
    {
        question: 'Which security issues qualify, and what timelines apply?',
        answer: 'Patch eligibility, notification, and delivery terms need to be confirmed for your subscription. Talk to the team about your security requirements and required timelines.',
    },
    {
        question: 'What happens after I contact the team?',
        answer: 'We’ll review your components, versions, upgrade constraints, and support requirements together. The initial conversation helps establish which update options are available and whether commercial support fits your needs.',
    },
    {
        question: 'How is the subscription priced?',
        answer: 'Contact the team to discuss pricing for your required coverage and support period.',
    },
];

export const Faq: FC = () => {
    const textCn = useTextStyles();

    return (
        <section
            id={SECTION_IDS.faq}
            className={cn(shared.section, shared.light, styles.section)}
            aria-labelledby="lts-faq-title"
            data-testid="lts-faq"
        >
            <div className="ktl-layout ktl-layout--center">
                <p className={cn(textCn('rs-text-2'), shared.eyebrow)}>Frequently asked questions</p>
                <h2 id="lts-faq-title" className={cn(textCn('rs-h1'), shared.title)}>
                    Questions before you get in touch
                </h2>
                <div className={styles.questions}>
                    {FAQ_ITEMS.map(({ question, answer }, index) => (
                        <details key={question} className={styles.item}>
                            <summary className={cn(textCn('rs-text-2'), styles.question)}>
                                {question}
                                <span className={styles.icons} aria-hidden="true">
                                    <PlusOutlineIcon className={styles.plus} />
                                    <MinusOutlineIcon className={styles.minus} />
                                </span>
                            </summary>
                            <div className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.answer)}>
                                <p>{answer}</p>
                                {index === 0 && (
                                    <a className={textCn('rs-link')} href={PUBLIC_SUPPORT_URL}>
                                        Read the public support policy
                                    </a>
                                )}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};
