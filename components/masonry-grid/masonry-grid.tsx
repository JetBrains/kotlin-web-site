import cn from 'classnames';
import { useMemo, ReactNode, useEffect, useRef, useState } from 'react';
import styles from './masonry-grid.module.css';

export interface MasonryItemSizeContext {
    columnWidth: number;
}

export interface MasonryGridProps<T> {
    items: T[];
    columnCount?: number;
    gap?: number;
    renderItem: (item: T, index: number) => ReactNode;
    getKey: (item: T, index: number) => string | number;
    /**
     * Item height at ctx.columnWidth, computed without DOM measurement
     * (e.g. via @chenglou/pretext for text). Returns null while the height
     * is unknown — the grid stays on the cyclic fallback until then.
     */
    getItemHeight: (item: T, ctx: MasonryItemSizeContext) => number | null;
    className?: string;
    columnClassName?: string;
    itemClassName?: string;
    mobileBreakpoint?: number;
    onLayoutReady?: () => void;
}

export function MasonryGrid<T>({
    items,
    columnCount = 2,
    gap,
    renderItem,
    getKey,
    getItemHeight,
    className,
    columnClassName,
    itemClassName,
    mobileBreakpoint = 808,
    onLayoutReady
}: MasonryGridProps<T>) {
    const [isMobile, setIsMobile] = useState(false);

    // Container ref for responsive recalculation
    const gridRef = useRef<HTMLDivElement | null>(null);

    const [containerWidth, setContainerWidth] = useState<number>(0);

    // Debounce helper
    const debounce = (fn: () => void, ms: number) => {
        let id: number | undefined;
        return () => {
            if (id) window.clearTimeout(id);
            id = window.setTimeout(fn, ms);
        };
    };

    // Track viewport breakpoint and container width
    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                setIsMobile(window.innerWidth <= mobileBreakpoint);
                if (gridRef.current) {
                    setContainerWidth(gridRef.current.clientWidth);
                }
            }
        };
        // Debounced to avoid thrashing
        const debounced = debounce(handleResize, 150);
        handleResize();
        window.addEventListener('resize', debounced);
        return () => window.removeEventListener('resize', debounced);
    }, [mobileBreakpoint]);

    const effectiveColumnCount = Math.max(1, isMobile ? 1 : columnCount);

    // Compute per-column width
    const columnWidth = useMemo(() => {
        const g = gap ?? 0;
        if (!containerWidth || effectiveColumnCount <= 0) return 0;
        return Math.max(0, Math.floor((containerWidth - g * (effectiveColumnCount - 1)) / effectiveColumnCount));
    }, [containerWidth, effectiveColumnCount, gap]);

    // Cyclic distribution fallback: used before heights are known (and in SSG HTML)
    const cyclicColumns = useMemo(() => {
        const cols: T[][] = Array.from({ length: effectiveColumnCount }, () => []);
        items.forEach((item, index) => {
            const columnIndex = index % effectiveColumnCount;
            cols[columnIndex].push(item);
        });
        return cols;
    }, [items, effectiveColumnCount]);

    // Greedy placement by shortest column, computed synchronously from the
    // provided heights — pure arithmetic, no DOM measurement.
    const greedyColumns = useMemo<T[][] | null>(() => {
        if (columnWidth <= 0 || effectiveColumnCount <= 0) return null;
        const g = gap ?? 0;

        const cols: T[][] = Array.from({ length: effectiveColumnCount }, () => []);
        const colHeights: number[] = Array.from({ length: effectiveColumnCount }, () => 0);

        for (const item of items) {
            const height = getItemHeight(item, { columnWidth });
            // Heights not ready yet — fall back to the cyclic distribution
            if (height === null || !Number.isFinite(height) || height < 0) return null;

            // Find the shortest column
            let minIndex = 0;
            for (let c = 1; c < effectiveColumnCount; c++) {
                if (colHeights[c] < colHeights[minIndex]) {
                    minIndex = c;
                }
            }
            cols[minIndex].push(item);
            // Add gap except for the very first item in a column
            colHeights[minIndex] += (colHeights[minIndex] > 0 ? g : 0) + height;
        }

        return cols;
    }, [items, effectiveColumnCount, columnWidth, gap, getItemHeight]);

    const columns = greedyColumns ?? cyclicColumns;

    const onLayoutReadyRef = useRef(onLayoutReady);
    onLayoutReadyRef.current = onLayoutReady;
    useEffect(() => {
        if (greedyColumns) onLayoutReadyRef.current?.();
    }, [greedyColumns]);

    const style = gap !== undefined ? { gap: `${gap}px` } : undefined;

    return (
        <div ref={gridRef} className={cn(styles.grid, className)} style={style}>
            {columns.map((column, columnIndex) => (
                <div
                    key={columnIndex}
                    className={cn(styles.column, columnClassName)}
                    style={style}
                >
                    {column.map((item, itemIndex) => {
                        // Preserve stable keys based on original index order
                        const originalIndex = columnIndex + itemIndex * Math.max(1, effectiveColumnCount);
                        return (
                            <div
                                key={getKey(item, originalIndex)}
                                className={cn(styles.item, itemClassName)}
                            >
                                {renderItem(item, originalIndex)}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
