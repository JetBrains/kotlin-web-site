import React, { useMemo, ReactNode } from 'react';
import cn from 'classnames';
import { useSnapCarousel } from 'react-snap-carousel';

import styles from './snap-carousel.module.css';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import { ArrowLeftIcon, ArrowRightIcon } from '@rescui/icons';

interface SnapCarouselProps {
    children: ReactNode;
}

export const SnapCarousel = ({ children }: SnapCarouselProps) => {
    const { scrollRef, activePageIndex, prev, next, pages } = useSnapCarousel();
    const textCn = useTextStyles();

    const childrenWithProps = useMemo(
        () =>
            React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                    const isChildFunction = typeof child.type === 'function';
                    return React.cloneElement(child, {
                        ...(isChildFunction && { isActive: activePageIndex === index }),
                        className: cn(styles.slide, child.props.className)
                    });
                }
                return child;
            }),
        [children, activePageIndex]
    );

    return (
        <div>
            <div
                className={cn(
                    styles.block
                )}
            >
                <div className={cn(styles.carousel)}>
                    <div
                        ref={scrollRef}
                        className={styles.wrapper}
                    >
                        {childrenWithProps}
                    </div>
                </div>
            </div>

            <div className={styles.navigation}>
                <Button onClick={() => prev()} mode={'outline'} icon={<ArrowLeftIcon />} />
                <p className={textCn('rs-text-2')}>{activePageIndex + 1}/{pages.length}</p>
                <Button onClick={() => next()} mode={'outline'} icon={<ArrowRightIcon />} />
            </div>
        </div>

    );
};
