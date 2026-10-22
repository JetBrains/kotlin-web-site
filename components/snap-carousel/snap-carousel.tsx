import React, { useMemo, ReactNode, Attributes, useCallback, useRef, useState, useLayoutEffect } from 'react';
import cn from 'classnames';
import { useSnapCarousel } from 'react-snap-carousel';

import styles from './snap-carousel.module.css';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import { ArrowLeftIcon, ArrowRightIcon } from '@rescui/icons';

interface SnapCarouselProps {
    children: ReactNode;
    navigationAlign?: 'center' | 'right';
    adaptiveHeight?: boolean;
}

export const SnapCarousel = ({ children, navigationAlign = 'center', adaptiveHeight = false }: SnapCarouselProps) => {
    // useSnapCarousel starts with no pages and only finds them by measuring the DOM on the client,
    // so the server-rendered HTML shows "1/0" and a disabled next button. Assume one slide per page until then.
    const initialPages = useMemo(() => React.Children.map(children, (_, index) => [index]) ?? [], [children]);
    const { scrollRef, activePageIndex, prev, next, pages, hasPrevPage, hasNextPage } = useSnapCarousel({
        initialPages,
    });
    const textCn = useTextStyles();

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const setWrapperRef = useCallback(
        (el: HTMLDivElement | null) => {
            wrapperRef.current = el;
            scrollRef(el);
        },
        [scrollRef]
    );

    const [height, setHeight] = useState<number>();

    useLayoutEffect(() => {
        const activeSlide = wrapperRef.current?.children[activePageIndex];
        if (!adaptiveHeight || !(activeSlide instanceof HTMLElement)) return;

        const updateHeight = () => setHeight(activeSlide.offsetHeight);
        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        observer.observe(activeSlide);
        return () => observer.disconnect();
    }, [adaptiveHeight, activePageIndex]);

    const childrenWithProps = useMemo(
        () =>
            React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                    const isChildFunction = typeof child.type === 'function';
                    return React.cloneElement(child, {
                        ...(isChildFunction && { isActive: activePageIndex === index }),
                        className: cn(styles.slide, child.props.className)
                    } as Attributes);
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
                        ref={setWrapperRef}
                        className={cn(styles.wrapper, { [styles.wrapperAdaptive]: adaptiveHeight })}
                        style={adaptiveHeight ? { height } : undefined}
                    >
                        {childrenWithProps}
                    </div>
                </div>
            </div>

            <div className={cn(styles.navigation, { [styles.navigationRight]: navigationAlign === 'right' })}>
                <Button
                    onClick={() => prev()}
                    mode={'outline'}
                    icon={<ArrowLeftIcon />}
                    disabled={!hasPrevPage}
                    aria-label="Previous slide"
                />
                <p className={textCn('rs-text-2')} data-testid="snap-carousel-counter">
                    {activePageIndex + 1}/{pages.length}
                </p>
                <Button
                    onClick={() => next()}
                    mode={'outline'}
                    icon={<ArrowRightIcon />}
                    disabled={!hasNextPage}
                    aria-label="Next slide"
                />
            </div>
        </div>

    );
};
