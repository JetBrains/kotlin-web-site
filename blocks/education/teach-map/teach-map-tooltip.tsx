import React, { FC, useCallback, MouseEvent } from 'react';
import cn from 'classnames';
import styles from './teach-map-tooltip.module.css';
import { CloseIcon } from '@rescui/icons';
import { University } from './teach-map';

interface TeachMapTooltipProps {
    university: University;
    onClose: () => void;
}

export const TeachMapTooltip: FC<TeachMapTooltipProps> = ({ university, onClose }) => {
    const handleClick = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();
            onClose();
        },
        [onClose]
    );

    return (
        <div className={cn(styles.tooltip, 'ktl-text-3')} data-test="teach-map-tooltip">
            <div className={styles.header}>
                <div>
                    <div className={styles.headerText}>{university.title}</div>
                    {university.location}
                </div>
                <CloseIcon size="s" className={styles.closeIcon} onClick={handleClick} />
            </div>
            <div className={styles.content}>
                <div>Course:</div>
                {university.courses.map((course) => (
                    <div key={`${course.url}-${course.name}`}>
                        <a href={course.url} target="_blank" rel="noopener noreferrer">
                            {course.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};
