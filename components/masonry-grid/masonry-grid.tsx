import cn from 'classnames';
import { useMemo, ReactNode, useEffect, useState } from 'react';
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

    useEffect(() => {
        const update = () => {
            if (typeof window !== 'undefined') {
                setIsMobile(window.innerWidth <= mobileBreakpoint);
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [mobileBreakpoint]);

    const effectiveColumnCount = Math.max(1, isMobile ? 1 : columnCount);

    const columns = useMemo(() => {
        const cols: T[][] = Array.from({ length: effectiveColumnCount }, () => []);

        items.forEach((item, index) => {
            const columnIndex = index % effectiveColumnCount;
            cols[columnIndex].push(item);
        });

        return cols;
    }, [items, effectiveColumnCount]);

    const style = gap !== undefined ? { gap: `${gap}px` } : undefined;

    return (
        <div className={cn(styles.grid, className)} style={style}>
            {columns.map((column, columnIndex) => (
                <div
                    key={columnIndex}
                    className={cn(styles.column, columnClassName)}
                    style={style}
                >
                    {column.map((item, itemIndex) => {
                        const originalIndex = columnIndex + itemIndex * effectiveColumnCount;
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
