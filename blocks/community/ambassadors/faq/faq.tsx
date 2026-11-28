import cn from 'classnames';

import { ThemeProvider } from '@rescui/ui-contexts';
import { useTextStyles } from '@rescui/typography';

import { ColumnedFaq, type ColumnedFaqItem } from '@/components/columned-faq/columned-faq';

import styles from './faq.module.css';

const FAQ_ITEMS: ColumnedFaqItem[] = [
    {
        question: 'How are Kotlin Ambassadors selected?',
        answer: (
            <>
                <p>
                    Kotlin Ambassadors are invited based on their technical expertise, community contributions, and
                    established reputation within the Kotlin ecosystem.
                </p>
                <p>Candidates may be identified by the Kotlin team or nominated by existing ambassadors.</p>
                <p>
                    Nominations are reviewed with input from the ambassador community to ensure that new members share
                    the program's values and commitment to the Kotlin ecosystem.
                </p>
                <p>Candidates must be at least 18 years old and not currently employed by JetBrains.</p>
            </>
        ),
    },
    {
        question: 'Can I apply to become a Kotlin Ambassador?',
        answer: (
            <>
                <p>The program is currently invitation-based and does not accept self-nominations.</p>
                <p>
                    However, existing ambassadors can nominate other community members whose contributions they believe
                    deserve recognition.
                </p>
            </>
        ),
    },
    {
        question: 'How long does the membership last?',
        answer: (
            <>
                <p>Kotlin Ambassador membership has no fixed expiration date.</p>
                <p>
                    As long as an Ambassador remains actively involved in the Kotlin ecosystem and continues to uphold
                    the program&apos;s values, they can remain part of the program.
                </p>
            </>
        ),
    },
    {
        question: 'Is there a Code of Conduct?',
        answer: (
            <>
                Yes. All Kotlin Ambassadors are expected to follow a shared{' '}
                <a
                    className={styles.link}
                    href={'https://github.com/jetbrains#code-of-conduct'}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Code of Conduct
                </a>{' '}
                that promotes respectful communication, professional conduct, and positive participation in the
                community.
            </>
        ),
    },
];

export function Faq() {
    const textCn = useTextStyles();

    return (
        <section className={styles.section} data-testid="ambassadors-faq">
            <div
                className={cn(styles.content, 'ktl-layout-v2 ktl-layout--center')}
                data-testid="ambassadors-faq-content"
            >
                <h2 className={cn(textCn('rs-h2'), styles.title)} data-testid="ambassadors-faq-title">
                    Frequently asked questions
                </h2>
                <ThemeProvider theme="dark">
                    <ColumnedFaq items={FAQ_ITEMS} columnsCount={1} icon="arrow" borderBottom />
                </ThemeProvider>
            </div>
        </section>
    );
}
