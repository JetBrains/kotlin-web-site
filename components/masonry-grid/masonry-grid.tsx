import cn from 'classnames';
import { useMemo, ReactNode, useEffect, useRef, useState } from 'react';
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
}: MasonryGridProps<T>) {
    const [isMobile, setIsMobile] = useState(false);

    // Container refs for measuring and responsive recalculation
    const gridRef = useRef<HTMLDivElement | null>(null);
    const measureWrapperRef = useRef<HTMLDivElement | null>(null);
    const measureItemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    // Compute per-column width (used by hidden measuring container)
    const columnWidth = useMemo(() => {
        const g = gap ?? 0;
        if (!containerWidth || effectiveColumnCount <= 0) return 0;
        return Math.max(0, Math.floor((containerWidth - g * (effectiveColumnCount - 1)) / effectiveColumnCount));
    }, [containerWidth, effectiveColumnCount, gap]);

    // State with the final greedy distribution
    const [greedyColumns, setGreedyColumns] = useState<T[][] | null>(null);

    // Measure item heights in a hidden container and distribute greedily
    useEffect(() => {
        // Avoid running on server or when measurement isn't possible yet
        if (typeof window === 'undefined') return;
        if (effectiveColumnCount <= 0) return;
        if (!measureWrapperRef.current) return;
        if (columnWidth <= 0) return;

        // Defer until browser lays out hidden nodes
        const id = window.setTimeout(() => {
            // Collect heights for each item (fallback to 0 if not measurable)
            const heights = items.map((_, i) => measureItemRefs.current[i]?.offsetHeight ?? 0);

            // Greedy placement by current column total heights
            const cols: T[][] = Array.from({ length: effectiveColumnCount }, () => []);
            const colHeights: number[] = Array.from({ length: effectiveColumnCount }, () => 0);
            const g = gap ?? 0;

            items.forEach((item, i) => {
                // Find the shortest column
                let minIndex = 0;
                let minValue = colHeights[0];
                for (let c = 1; c < effectiveColumnCount; c++) {
                    if (colHeights[c] < minValue) {
                        minIndex = c;
                        minValue = colHeights[c];
                    }
                }
                cols[minIndex].push(item);
                const h = heights[i] || 0;
                // Add gap except for the very first item in a column
                colHeights[minIndex] += (colHeights[minIndex] > 0 ? g : 0) + h;
            });

            setGreedyColumns(cols);
        }, 0);

        return () => window.clearTimeout(id);
        // Recompute when items, columns or width change
    }, [items, effectiveColumnCount, columnWidth, gap]);

    // If we don't have measurements yet, fall back to simple cyclic distribution to avoid empty UI
    const cyclicColumns = useMemo(() => {
        const cols: T[][] = Array.from({ length: effectiveColumnCount }, () => []);
        items.forEach((item, index) => {
            const columnIndex = index % effectiveColumnCount;
            cols[columnIndex].push(item);
        });
        return cols;
    }, [items, effectiveColumnCount]);

    const columns = greedyColumns ?? cyclicColumns;

    const style = gap !== undefined ? { gap: `${gap}px` } : undefined;

    return (
        <>
            {/* Visible grid */}
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
                                    {/*<div style={{color: 'white'}}>{originalIndex}</div>*/}
                                    {renderItem(item, originalIndex)}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Hidden measuring container: renders all items at exact column width to get real heights */}
            <div
                ref={measureWrapperRef}
                aria-hidden
                style={{
                    position: 'absolute',
                    visibility: 'hidden',
                    pointerEvents: 'none',
                    left: -99999,
                    top: 0,
                    width: columnWidth || undefined,
                }}
            >
                {/* Force the same width as a column so heights match real layout */}
                <div style={{ width: columnWidth }}>
                    {items.map((item, i) => (
                        <div
                            key={getKey(item, i)}
                            ref={(el) => (measureItemRefs.current[i] = el)}
                            className={cn(styles.item, itemClassName)}
                            style={{ marginBottom: gap && i < items.length - 1 ? gap : undefined }}
                        >
                            {renderItem(item, i)}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
