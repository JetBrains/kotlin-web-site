import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './who-can-become.module.css';
import { HeroDecoration } from '@/blocks/community/ambassadors/decoration/decoration';

type Contribution = {
    title: string;
    description: string;
};

const CONTRIBUTIONS: Contribution[] = [
    {
        title: 'Content creation',
        description: 'Writing articles, producing videos or podcasts, creating courses, or publishing other educational materials.',
    },
    {
        title: 'Public speaking',
        description: 'Sharing your expertise at conferences, meetups, webinars, or workshops.',
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
];

export const WhoCanBecome: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.section} data-testid="ambassadors-who-can-become">
            <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
                <HeroDecoration />
                <div className={styles.grid}>
                    <div className={styles.left}>
                        <h2 className={cn(textCn('rs-h2'), styles.title)} data-testid="ambassadors-who-title">
                            Who can become a Kotlin Ambassador?
                        </h2>
                        <p className={cn(textCn('rs-text-1'), styles.description)}>
                            Kotlin Ambassadors are experienced developers, community contributors, creators who have
                            demonstrated technical expertise and a commitment to helping the Kotlin ecosystem grow.
                        </p>
                    </div>
                    <div className={styles.card} data-testid="ambassadors-contributions-card">
                        <p className={cn(textCn('rs-subtitle-2'), styles.cardTitle)}>Community contributions</p>
                        <ul className={styles.list}>
                            {CONTRIBUTIONS.map((contribution) => (
                                <li className={styles.listItem} key={contribution.title}>
                                    <h3 className={cn(textCn('rs-h4'), styles.itemTitle)}>{contribution.title}</h3>
                                    <p className={cn(textCn('rs-text-2'), styles.itemText)}>
                                        {contribution.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};
