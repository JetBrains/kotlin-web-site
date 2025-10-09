import cn from 'classnames';
import { useMemo, ReactNode } from 'react';
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
}

export function MasonryGrid<T>({
                                   items,
                                   columnCount = 2,
                                   gap,
                                   renderItem,
                                   getKey,
                                   className,
                                   columnClassName,
                                   itemClassName
                               }: MasonryGridProps<T>) {
    const columns = useMemo(() => {
        const cols: T[][] = Array.from({ length: columnCount }, () => []);

        items.forEach((item, index) => {
            const columnIndex = index % columnCount;
            cols[columnIndex].push(item);
        });

        return cols;
    }, [items, columnCount]);

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
                        const originalIndex = columnIndex + itemIndex * columnCount;
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
