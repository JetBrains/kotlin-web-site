import React, { FC } from 'react';
import cn from 'classnames';
import { cardCn } from '@rescui/card';
import { CodeIcon, CheckDoubleOutlineIcon, FileOutlineIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';

import shared from '../kotlin-lts.module.css';
import styles from './constraints.module.css';

const CONSTRAINTS = [
    {
        icon: CodeIcon,
        title: 'Upgrades involve substantial work',
        text: 'A newer release line can require code changes, compatibility checks, and regression testing.',
    },
    {
        icon: CheckDoubleOutlineIcon,
        title: 'Validation takes time',
        text: 'Your backend services, mobile apps, or Android-based systems need extensive testing and approval.',
    },
    {
        icon: FileOutlineIcon,
        title: 'Support needs to be documented',
        text: 'Your engineering and security teams need clear coverage, support periods, and remediation commitments.',
    },
];

export const Constraints: FC = () => {
    const textCn = useTextStyles();

    return (
        <section
            className={cn(shared.section, shared.light, styles.section)}
            aria-labelledby="lts-constraints-title"
            data-testid="lts-constraints"
        >
            <div className="ktl-layout ktl-layout--center">
                <h2 id="lts-constraints-title" className={cn(textCn('rs-h1'), shared.title)}>
                    When support can help
                </h2>
                <p className={cn(textCn('rs-text-1', { hardness: 'average' }), shared.lead)}>
                    When updates need to fit your release process and addressing a vulnerability can involve more than
                    updating a dependency.
                </p>
                <div className={styles.grid}>
                    {CONSTRAINTS.map(({ icon: Icon, title, text }) => (
                        <article key={title} className={cn(cardCn({ paddings: 32, borderRadius: 16 }), styles.card)}>
                            <span className={styles.icon} aria-hidden="true">
                                <Icon />
                            </span>
                            <h3 className={cn(textCn('rs-h3'), styles.title)}>{title}</h3>
                            <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.description)}>
                                {text}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
