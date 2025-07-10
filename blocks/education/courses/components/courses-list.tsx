import React, { FC } from 'react';
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
  return (
    <div className={styles.coursesList}>
      <div className={styles.coursesListHeader}>
        <div className={`${styles.cellFirst} ktl-h4`}>University title</div>
        <div className={`${styles.cellSecond} ktl-h4`}>Location</div>
        <div className={`${styles.cellThird} ktl-h4`}>Teaching Kotlin</div>
      </div>
      {universities.map(university => (
        <div className={styles.coursesListItem} key={`${university.title}-${university.location}`}>
          <div className={`${styles.cellFirst} ktl-text-2`}>{university.title}</div>
          <div className={`${styles.cellSecond} ktl-text-2`}>{university.location}</div>
          <div className={`${styles.cellThird} ktl-text-2`}>
            {university.courses.map(course => (
              <a 
                href={course.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                key={`${course.name}-${course.url}`}
              >
                {course.name}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};