import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './courses-list.module.css';

interface Course {
    name: string;
    url: string;
}

interface University {
    title: string;
    location: string;
    courses: Course[];
}

interface CoursesListProps {
    universities: University[];
}

export const CoursesList: FC<CoursesListProps> = ({ universities }) => {
    const textCn = useTextStyles();
    return (
        <div className={styles.list}>
            <div className={styles.header}>
                <div className={cn(styles.cell, styles.cellFirst, textCn('rs-h4',))}>University title</div>
                <div className={cn(styles.cell, styles.cellSecond, textCn('rs-h4',))}>Location</div>
                <div className={cn(styles.cell, styles.cellThird, textCn('rs-h4',))}>Teaching Kotlin</div>
            </div>
            {universities.map((university) => (
                <div className={styles.item} key={`${university.title}-${university.location}`}>
                    <div className={cn(styles.cell, styles.cellFirst, textCn('rs-text-2', { hardness: 'hard' }))}>{university.title}</div>
                    <div className={cn(styles.cell, styles.cellSecond, textCn('rs-text-2', { hardness: 'hard' }))}>{university.location}</div>
                    <div className={cn(styles.cell, styles.cellThird, textCn('rs-text-2', { hardness: 'hard' }))}>
                        {university.courses.map((course) => (
                            <a className={textCn('rs-link', { external: true, hardness: 'hard' })} href={course.url} target="_blank" rel="noopener noreferrer" key={`${course.name}-${course.url}`}>
                                {course.name}
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
