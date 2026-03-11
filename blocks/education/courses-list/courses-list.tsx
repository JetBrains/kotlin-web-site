import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './courses-list.module.css';

interface Course {
    name: string;
    url: string;
}

interface University {
    id: string;
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
            <div className={cn(styles.header, textCn('rs-h4'))}>
                <div className={cn(styles.cell, styles.cellFirst)}>University title</div>
                <div className={cn(styles.cell, styles.cellSecond)}>Location</div>
                <div className={cn(styles.cell, styles.cellThird)}>Teaching Kotlin</div>
            </div>
            {universities.map((university) => (
                <div className={cn(styles.item, textCn('rs-text-2', { hardness: 'hard' }))} key={university.id}>
                    <div className={cn(styles.cell, styles.cellFirst)}>{university.title}</div>
                    <div className={cn(styles.cell, styles.cellSecond)}>{university.location}</div>
                    <div className={cn(styles.cell, styles.cellThird)}>
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
