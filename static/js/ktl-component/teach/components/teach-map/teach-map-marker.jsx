import React from "react";
import './teach-map-marker.scss';
import {TeachMapTooltip} from './teach-map-tooltip.jsx';

export const TeachMapMarker = ({university, showTooltip, onClose}) => {
  return (
    <div className={`teach-map-marker ${showTooltip ? 'teach-map-marker_active': ''}`}>
      {showTooltip && <TeachMapTooltip university={university} onClose={onClose}/>}
    </div>
  );
}
