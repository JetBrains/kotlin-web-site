import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './chart-figure.module.css';

type ChartFigureProps = {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
    className?: string;
    testId?: string;
};

export const ChartFigure: FC<ChartFigureProps> = ({ src, alt, width, height, caption, className, testId }) => {
    const textCn = useTextStyles();

    return (
        <figure className={cn(styles.figure, className)} data-testid={testId}>
            <img src={src} alt={alt} width={width} height={height} className={styles.image} />
            {caption && (
                <figcaption className={cn(styles.caption, textCn('rs-text-3', { hardness: 'pale' }))}>
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};
