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
        answer: (
            <>
                Public security support covers the Kotlin standard library for the JVM under the published policy.
                Paid support covers{' '}
                <a className={styles.inlineLink} href={`#${SECTION_IDS.coverage}`}>
                    a broader range of Kotlin components
                </a>{' '}
                and offers a support window agreed with your team, including support beyond the public window.
                It also includes private patch delivery, direct communication, and security advisories with guidance
                and workarounds.
            </>
        ),
    },
    {
        question: 'When should we consider paid Kotlin LTS?',
        answer: 'Consider paid Kotlin LTS if you need to keep your current Kotlin version in production and continue receiving fixes while you prepare for an upgrade.',
        blockers: [
            'Gradle and plugin compatibility',
            'Certification and audit requirements',
            'Regression testing',
            'Release freezes',
            'Distributed or hard-to-update deployments',
        ],
    },
    {
        question: 'Which components, platforms, and release lines are covered?',
        answer: 'Paid support covers Kotlin, including the compiler, standard library, and build plugins. It also covers Ktor, Exposed, Compose Multiplatform, and kotlinx libraries such as coroutines and serialization. We work with your team to confirm which components, platforms, and release lines your subscription covers and for how long.',
    },
    {
        question: 'Can I stay on my exact version?',
        answer: 'Yes. You can request security fixes for the specific version you use. Share your current versions and upgrade constraints with the team so we can agree the scope and provide a quote for your requirements.',
    },
    {
        question: 'How do we receive patches, and what testing is still needed?',
        answer: 'We deliver patches through a private subscriber repository. Patch builds pass through JetBrains’ full testing pipeline before delivery. Your team integrates the patched dependency and remains responsible for application testing, approval, and deployment.',
    },
    {
        question: 'Which security issues qualify, and what timelines apply?',
        answer: 'Fixes for newly disclosed CVEs are eligible for backporting from newer releases to the components and versions covered by your subscription. We’ll agree with your team on delivery timelines based on the issue and your support scope.',
        followUp: 'If a specific performance issue or another bug is affecting your team, you can also ask us whether a fix can be included in your support scope.',
    },
    {
        question: 'What happens after I contact the team?',
        answer: 'We’ll review your components, versions, upgrade constraints, and support requirements together. The initial conversation helps establish which update options are available and whether paid support fits your needs.',
    },
    {
        question: 'How is the subscription priced?',
        answer: 'Pricing depends on the components in your Kotlin stack, the versions you need to support, and your required support window. Contact the team to discuss your requirements and receive a tailored quote.',
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
                <h2 id="lts-faq-title" className={cn(textCn('rs-h1'), shared.title)}>
                    Questions before you get in touch
                </h2>
                <div className={styles.questions}>
                    {FAQ_ITEMS.map(({ question, answer, blockers, followUp }, index) => (
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
                                {followUp && <p>{followUp}</p>}
                                {blockers && (
                                    <>
                                        <p><strong>Common upgrade blockers</strong></p>
                                        <ul>
                                            {blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
                                        </ul>
                                    </>
                                )}
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
