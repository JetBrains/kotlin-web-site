import cn from 'classnames';
import { useCallback, useMemo, ReactNode, useEffect, useRef, useState } from 'react';
import styles from './masonry-grid.module.css';

export interface MasonryGridProps<T> {
    items: T[];
    columnCount?: number;
    gap?: number;
    renderItem: (item: T, index: number) => ReactNode;
    getKey: (item: T, index: number) => string | number;
    className?: string;
    columnClassName?: string;
    itemClassName?: string;
    mobileBreakpoint?: number;
    onLayoutReady?: () => void;
}

// Greedy placement: every item goes to the currently shortest column.
function distributeByHeight(heights: number[], columnCount: number, gap: number): number[][] {
    const cols: number[][] = Array.from({ length: columnCount }, () => []);
    const colHeights: number[] = Array.from({ length: columnCount }, () => 0);

    heights.forEach((height, index) => {
        let minIndex = 0;
        for (let c = 1; c < columnCount; c++) {
            if (colHeights[c] < colHeights[minIndex]) minIndex = c;
        }
        cols[minIndex].push(index);
        // Add gap except for the very first item in a column
        colHeights[minIndex] += (colHeights[minIndex] > 0 ? gap : 0) + height;
    });

    return cols;
}

// The distribution holds indexes into `items`, so it is only usable for the list it was measured on.
interface Distribution<T> {
    source: T[];
    columnCount: number;
    columns: number[][];
}

function isSameDistribution<T>(current: Distribution<T> | null, next: Distribution<T>): boolean {
    if (current === null) return false;
    if (current.source !== next.source || current.columnCount !== next.columnCount) return false;
    return current.columns.every(
        (column, i) => column.length === next.columns[i].length && column.every((index, j) => index === next.columns[i][j])
    );
}

// A card is only as tall as its media, so the grid is not measurable until the media has arrived.
function hasLoadingImages(container: HTMLElement): boolean {
    return Array.from(container.querySelectorAll('img')).some((image) => !image.complete);
}

export function MasonryGrid<T>({
    items,
    columnCount = 2,
    gap,
    renderItem,
    getKey,
    className,
    columnClassName,
    itemClassName,
    mobileBreakpoint = 808,
    onLayoutReady
}: MasonryGridProps<T>) {
    const [isMobile, setIsMobile] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // Refs to the rendered items, indexed by the item's position in `items`
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const onLayoutReadyRef = useRef(onLayoutReady);
    onLayoutReadyRef.current = onLayoutReady;

    // Debounce helper
    const debounce = (fn: () => void, ms: number) => {
        let id: number | undefined;
        return () => {
            if (id) window.clearTimeout(id);
            id = window.setTimeout(fn, ms);
        };
    };

    // Track viewport breakpoint
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= mobileBreakpoint);
        // Debounced to avoid thrashing
        const debounced = debounce(handleResize, 150);
        handleResize();
        window.addEventListener('resize', debounced);
        return () => window.removeEventListener('resize', debounced);
    }, [mobileBreakpoint]);

    const effectiveColumnCount = Math.max(1, isMobile ? 1 : columnCount);

    // Cards reflow when the grid gets wider or narrower, so a width change re-opens the measuring window
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Rounded, so that a subpixel width does not keep re-triggering the measurement
        const observer = new ResizeObserver(([entry]) => setContainerWidth(Math.round(entry.contentRect.width)));
        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    // Until the items have been measured, fall back to a simple cyclic distribution to avoid empty UI
    const cyclicColumns = useMemo(
        () =>
            items.reduce<number[][]>(
                (cols, _, index) => {
                    cols[index % effectiveColumnCount].push(index);
                    return cols;
                },
                Array.from({ length: effectiveColumnCount }, () => [])
            ),
        [items, effectiveColumnCount]
    );

    const [distribution, setDistribution] = useState<Distribution<T> | null>(null);
    const isDistributionCurrent =
        distribution !== null && distribution.source === items && distribution.columnCount === effectiveColumnCount;
    const columns = isDistributionCurrent ? distribution.columns : cyclicColumns;

    const setItemRef = useCallback(
        (index: number) => (element: HTMLDivElement | null) => {
            itemRefs.current[index] = element;
        },
        []
    );

    // Measure the rendered items and redistribute them. Card heights only settle once their images
    // have loaded, so the measurement is repeated until the last one arrives — and then stopped.
    // Redistributing moves cards between columns, which React implements as a remount, so a grid that
    // kept re-measuring would rearrange itself under a reader and reset the state of the cards it moves.
    // Past that point the layout is only recomputed when `items`, the column count or the width change,
    // each of which re-runs this effect.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        itemRefs.current.length = items.length;

        let frame = 0;

        const measure = () => {
            const heights = items.map((_, index) => itemRefs.current[index]?.offsetHeight ?? 0);
            const next: Distribution<T> = {
                source: items,
                columnCount: effectiveColumnCount,
                columns: distributeByHeight(heights, effectiveColumnCount, gap ?? 0)
            };
            setDistribution((current) => (isSameDistribution(current, next) ? current : next));
        };

        const stopMeasuring = () => {
            window.cancelAnimationFrame(frame);
            container.removeEventListener('load', remeasure, true);
            container.removeEventListener('error', remeasure, true);
            window.removeEventListener('load', onWindowLoad);
        };

        // The layout is final: hand it to `onLayoutReady` and leave it alone from here on.
        const settle = () => {
            stopMeasuring();
            onLayoutReadyRef.current?.();
        };

        // Coalesced into a single frame, so a batch of images arriving together is measured once.
        function remeasure() {
            window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(() => {
                const isLastMeasurement = !hasLoadingImages(container);
                measure();
                if (isLastMeasurement) settle();
            });
        }

        // Whatever has not arrived by now never will, so this is as final as the layout gets.
        function onWindowLoad() {
            window.cancelAnimationFrame(frame);
            measure();
            settle();
        }

        // `load` and `error` do not bubble, but they do reach a capturing listener on the grid. Listening
        // there rather than on each image keeps working for the images React remounts with their card.
        container.addEventListener('load', remeasure, true);
        container.addEventListener('error', remeasure, true);
        // Backstop for images that never resolve, and for those the browser decided not to fetch at all.
        if (document.readyState !== 'complete') window.addEventListener('load', onWindowLoad);

        remeasure();

        return stopMeasuring;
    }, [items, effectiveColumnCount, gap, containerWidth]);

    const style = gap !== undefined ? { gap: `${gap}px` } : undefined;

    return (
        <div ref={containerRef} className={cn(styles.grid, className)} style={style}>
            {columns.map((column, columnIndex) => (
                <div
                    key={columnIndex}
                    className={cn(styles.column, columnClassName)}
                    style={style}
                    data-testid="masonry-column"
                >
                    {column.map((index) => (
                        <div
                            key={getKey(items[index], index)}
                            ref={setItemRef(index)}
                            className={cn(styles.item, itemClassName)}
                        >
                            {renderItem(items[index], index)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
