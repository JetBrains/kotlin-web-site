import React, { FC } from 'react';
import cn from 'classnames';

import styles from './decoration.module.css';

export const GradientBlockDecoration: FC = () => (
    <div className={styles.layer} aria-hidden="true" data-testid="ambassadors-hero-decoration">
        <img className={cn(styles.item, styles.seal)} src="/images/community/ambassadors/seal.webp" alt="" />
        <img className={cn(styles.item, styles.kElement)} src="/images/community/ambassadors/k-element.webp" alt="" />
        <img
            className={cn(styles.item, styles.contributorBadge)}
            src="/images/community/ambassadors/badge-contributor.webp"
            alt=""
        />
    </div>
);

export const HeroDecoration: FC = () => (
    <div className={styles.layer} aria-hidden="true" data-testid="ambassadors-hero-plate">
        <img
            className={cn(styles.item, styles.heroBadge)}
            src="/images/community/ambassadors/hero-badge.webp"
            alt=""
        />
    </div>
);

export const ProgramDecoration: FC = () => (
    <div className={styles.layer} aria-hidden="true" data-testid="ambassadors-program-decoration">
        <img
            className={cn(styles.item, styles.programCreator)}
            src="/images/community/ambassadors/badge-creator.webp"
            alt=""
        />
    </div>
);

export const QuoteDecoration: FC = () => (
    <div className={styles.layer} aria-hidden="true" data-testid="ambassadors-quote-decoration">
        <img
            className={cn(styles.item, styles.programEducator)}
            src="/images/community/ambassadors/badge-educator.webp"
            alt=""
        />
        <img
            className={cn(styles.item, styles.programPlate)}
            src="/images/community/ambassadors/plate-ambassador.webp"
            alt=""
        />
    </div>
);
