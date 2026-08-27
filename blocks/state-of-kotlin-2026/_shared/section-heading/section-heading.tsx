import React, { CSSProperties, FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './section-heading.module.css';

type SectionHeadingProps = {
    title: string;
    description?: string;
    /**
     * Caps the title's width, in px, to reproduce a line break the design draws into a heading.
     * Preferred over a `<br>`: it applies on the widest layout only — the stylesheet drops the
     * cap from the first breakpoint down, where the design sets the title across full width.
     */
    titleMaxWidth?: number;
    className?: string;
    testId?: string;
};

export const SectionHeading: FC<SectionHeadingProps> = ({
    title,
    description,
    titleMaxWidth,
    className,
    testId,
}) => {
    const textCn = useTextStyles();

    return (
        <div className={cn(styles.heading, className)} data-testid={testId}>
            <h2
                className={cn(styles.title, textCn('rs-h1'))}
                style={
                    titleMaxWidth
                        ? ({ '--sok-heading-title-max-width': `${titleMaxWidth}px` } as CSSProperties)
                        : undefined
                }
                data-testid={testId ? `${testId}-title` : undefined}
            >
                {title}
            </h2>
            {description && <p className={cn(styles.description, textCn('rs-subtitle-2'))}>{description}</p>}
        </div>
    );
};
