import React, { FC } from 'react';
import cn from 'classnames';
import { cardCn } from '@rescui/card';
import { useTextStyles } from '@rescui/typography';
import { CodeIcon, PackageIcon, ServerIcon, FolderIcon, TabletIcon } from '@rescui/icons';

import { CONTACT_TEAM_URL, SECTION_IDS } from '../constants';
import { COVERAGE_ITEMS } from './coverage-data';
import { useCardEntrance } from '../use-card-entrance';

import shared from '../kotlin-lts.module.css';
import styles from './coverage.module.css';

const COVERAGE_ICONS = {
    kotlin: CodeIcon,
    kotlinx: PackageIcon,
    ktor: ServerIcon,
    exposed: FolderIcon,
    compose: TabletIcon,
};

export const Coverage: FC = () => {
    const textCn = useTextStyles();
    const gridRef = useCardEntrance<HTMLUListElement>();

    return (
        <section
            id={SECTION_IDS.coverage}
            aria-labelledby="lts-coverage-title"
            className={cn(shared.section, shared.soft)}
            data-testid="lts-coverage"
        >
            <div className="ktl-layout ktl-layout--center">
                <h2
                    id="lts-coverage-title"
                    className={cn(textCn('rs-h1'), shared.title)}
                    data-testid="lts-coverage-title"
                >
                    Discuss coverage for your Kotlin stack
                </h2>
                <p className={cn(textCn('rs-text-1', { hardness: 'average' }), shared.lead)}>
                    Confirm the components, platforms, and release lines your applications depend on.
                </p>

                <ul ref={gridRef} className={styles.grid}>
                    {COVERAGE_ITEMS.map(({ id, title, text }) => {
                        const Icon = COVERAGE_ICONS[id];
                        return (
                            <li
                                key={id}
                                className={cn(cardCn({ paddings: 24, borderRadius: 16 }), styles.card)}
                                data-testid="lts-coverage-item"
                            >
                                <span className={styles.icon} aria-hidden="true">
                                    <Icon size="m" />
                                </span>
                                <div className={styles.cardCopy}>
                                    <h3 className={cn(textCn('rs-h3'), styles.cardTitle)}>{title}</h3>
                                    <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.cardText)}>
                                        {text}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.footnote)}>
                    Coverage applies to the components and release lines agreed for your subscription.{' '}
                    <a href={CONTACT_TEAM_URL} className={textCn('rs-link')}>
                        Contact the team
                    </a>{' '}
                    to review your versions and support requirements.
                </p>
            </div>
        </section>
    );
};
