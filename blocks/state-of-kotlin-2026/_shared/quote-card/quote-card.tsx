import React, { CSSProperties, FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './quote-card.module.css';

type QuoteCardProps = {
    logoSrc?: string;
    logoAlt?: string;
    logoWidth?: number;
    logoHeight?: number;
    company?: string;
    quote: string;
    /**
     * The design reuses this card for a plain company statement, which it sets without
     * quotation marks – and without an attribution below it.
     */
    quoted?: boolean;
    author?: string;
    role?: string;
    linkText?: string;
    linkHref?: string;
    className?: string;
    testId?: string;
};

export const QuoteCard: FC<QuoteCardProps> = ({
    logoSrc,
    logoAlt,
    logoWidth,
    logoHeight = 48,
    company,
    quote,
    quoted = true,
    author,
    role,
    linkText,
    linkHref = '',
    className,
    testId,
}) => {
    const textCn = useTextStyles();

    return (
        <div className={cn(styles.card, className, textCn('rs-text-1'))} data-testid={testId}>
            {logoSrc && (
                <span className={styles.logoBox}>
                    <img
                        src={logoSrc}
                        alt={logoAlt || ''}
                        className={styles.logo}
                        width={logoWidth}
                        height={logoHeight}
                        style={{ '--sok-logo-height': `${logoHeight}px` } as CSSProperties}
                    />
                </span>
            )}
            {company && <h4 className={cn(styles.company, textCn('rs-h3'))}>{company}</h4>}
            <p className={cn(styles.quote, textCn('rs-text-1'))}>{quoted ? <>&ldquo;{quote}&rdquo;</> : quote}</p>
            {author && (
                <div className={styles.attribution}>
                    <p className={cn(styles.author, textCn('rs-h3'))}>{author}</p>
                    {role && <p className={cn(styles.role, textCn('rs-text-2'))}>{role}</p>}
                </div>
            )}
            {linkText && (
                <a
                    href={linkHref}
                    className={cn(styles.link, textCn('rs-link'))}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {linkText}
                </a>
            )}
        </div>
    );
};
