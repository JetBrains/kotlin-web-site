import { Fragment } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './who-can-become.module.css';

const CONTRIBUTIONS = [
    {
        title: 'Content creation',
        description: 'Writing articles, producing videos or podcasts, creating courses, or publishing other educational materials.',
    },
    {
        title: 'Public speaking',
        description: 'Presenting at conferences, meetups, webinars, or workshops.',
    },
    {
        title: 'Open-source contributions',
        description: 'Building, maintaining, or contributing to projects on GitHub.',
    },
    {
        title: 'Community leadership',
        description: 'Organizing meetups, running user groups, or creating opportunities for developers to connect.',
    },
    {
        title: 'Mentorship',
        description: 'Helping individual developers and teams learn, adopt, and make the most of Kotlin.',
    },
] as const;

export function WhoCanBecome() {
    const textCn = useTextStyles();

    return (
        <section className={styles.section} data-testid="ambassadors-who-can-become">
            <div
                className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}
                data-testid="ambassadors-who-content"
            >
                <div className={styles.grid}>
                    <div className={styles.info}>
                        <h2 className={cn(textCn('rs-h2'), styles.title)} data-testid="ambassadors-who-title">
                            Who can become a&nbsp;Kotlin Ambassador?
                        </h2>
                        <p className={cn(textCn('rs-text-1'), styles.description)}>
                            Kotlin Ambassadors are experienced developers, community contributors, creators who have
                            demonstrated technical expertise and a commitment to helping the Kotlin ecosystem grow.
                        </p>
                    </div>
                    <div className={styles.card} data-testid="ambassadors-contributions-card">
                        <p className={cn(textCn('rs-subtitle-2'), styles.cardTitle)}>Community contributions</p>
                        <dl className={styles.list}>
                            {CONTRIBUTIONS.map((contribution) => (
                                <Fragment key={contribution.title}>
                                    <dt className={cn(textCn('rs-h4'), styles.itemTitle)}>{contribution.title}</dt>
                                    <dd className={cn(textCn('rs-text-2'), styles.itemText)}>
                                        {contribution.description}
                                    </dd>
                                </Fragment>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    );
}
