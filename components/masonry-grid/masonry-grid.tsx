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
    // have loaded, so the measurement is repeated whenever an item changes size.
    useEffect(() => {
        itemRefs.current.length = items.length;

        let frame = 0;
        const redistribute = () => {
            window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(() => {
                const heights = items.map((_, index) => itemRefs.current[index]?.offsetHeight ?? 0);
                const next: Distribution<T> = {
                    source: items,
                    columnCount: effectiveColumnCount,
                    columns: distributeByHeight(heights, effectiveColumnCount, gap ?? 0)
                };
                setDistribution((current) => (isSameDistribution(current, next) ? current : next));
                onLayoutReadyRef.current?.();
            });
        };

        const observer = new ResizeObserver(redistribute);
        itemRefs.current.forEach((element) => element && observer.observe(element));
        redistribute();

        return () => {
            window.cancelAnimationFrame(frame);
            observer.disconnect();
        };
        // `columns` is a dependency because moving an item to another column remounts it,
        // which leaves the observer watching detached nodes.
    }, [items, columns, effectiveColumnCount, gap]);

    const style = gap !== undefined ? { gap: `${gap}px` } : undefined;

    return (
        <div className={cn(styles.grid, className)} style={style}>
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
