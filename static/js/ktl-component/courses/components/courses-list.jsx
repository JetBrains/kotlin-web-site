import React from "react";
import './courses-list.scss';

export const CoursesList = ({universities}) => {
  return (
    <div className="ktl-courses-list">
      <div className="ktl-courses-list-header">
        <div className="ktl-courses-list-cell ktl-courses-list-cell_first ktl-h4">University title</div>
        <div className="ktl-courses-list-cell ktl-courses-list-cell_second ktl-h4">Location</div>
        <div className="ktl-courses-list-cell ktl-courses-list-cell_third ktl-h4">Teaching Kotlin</div>
      </div>
      {universities.map(university => (
        <div className="ktl-courses-list__item" key={`${university.title}-${university.location}`}>
          <div className="ktl-courses-list-cell ktl-courses-list-cell_first ktl-text-2">{university.title}</div>
          <div className="ktl-courses-list-cell ktl-courses-list-cell_second ktl-text-2">{university.location}</div>
          <div className="ktl-courses-list-cell ktl-courses-list-cell_third ktl-text-2">
            {university.courses.map(course => (
              <a href={course.url} target="_blank" key={`${course.name}-${course.url}`}>{course.name}</a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
