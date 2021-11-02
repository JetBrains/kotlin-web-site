import React, {useCallback} from "react";
import './teach-map-tooltip.scss';
import {CloseIcon} from '@rescui/icons';

export const TeachMapTooltip = ({university, onClose}) => {
  const handleClick = useCallback(event => {
    event.stopPropagation();
    onClose();
  }, []);

  return (
    <div className="teach-map-tooltip ktl-text-3">
      <div className="teach-map-tooltip__header">
        <div>
          <div className="teach-map-tooltip__header-text">{university.title}</div>
          {university.location}
        </div>
        <CloseIcon className="teach-map-tooltip__close-icon" onClick={handleClick}/>
      </div>
      <div className="teach-map-tooltip__content">
        <div>Course:</div>
        {university.courses.map(course => (
          <div key={`${course.url}-${course.name}`}>
            <a href={course.url} target="_blank">
              {course.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
