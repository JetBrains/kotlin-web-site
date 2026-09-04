import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './go-deeper-banner.module.css';

type GoDeeperBannerProps = {
    text: string;
    href?: string;
    onNavigate?: () => void;
    className?: string;
    testId?: string;
};

export const GoDeeperBanner: FC<GoDeeperBannerProps> = ({ text, href = '', onNavigate, className, testId }) => {
    const textCn = useTextStyles();

    const handleClick = useCallback(() => {
        onNavigate?.();
    }, [onNavigate]);

    return (
        <a
            href={href}
            className={cn(styles.banner, className)}
            data-testid={testId}
            onClick={handleClick}
            target="_blank"
            rel="noopener noreferrer"
        >
            <span className={cn(styles.text, textCn('rs-subtitle-2'))}>{text} ↗</span>
        </a>
    );
};
