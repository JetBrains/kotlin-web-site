import React, {useCallback, useEffect, useState} from 'react';
import GoogleMapReact from 'google-map-react';
import {TeachMapMarker} from './teach-map-marker.jsx';
import './teach-map.scss';
import {settings} from "../../../../util/map-settings";
import { ErrorBoundary } from "react-error-boundary";

export const TeachMap = ({className}) => {
  const [universities, setUniversities] = useState([]);
  const [activeId, setActiveId] = useState('');

  const handleChildClick = useCallback((key) => {
    setActiveId(key);
  }, []);

  useEffect(() => {
    fetch('/data/universities.json')
      .then(response => {
        return response.json();
      })
      .then(data => {
        const items = data.map(university => {
          return {
            ...university,
            id: `${university.title}-${university.location}-${university.geo.lat}-${university.geo.lng}`
          }
        });
        setUniversities(items)
      });
  }, []);

  return (
    <ErrorBoundary fallback={<div>Map is unavailable</div>}>
      <div className={`teach-map ${className ? className : ''}`}>
        <GoogleMapReact
          bootstrapURLKeys={{key: settings.key}}
          defaultCenter={settings.defaultCenter}
          defaultZoom={settings.defaultZoom}
          options={settings.options}
          onChildClick={handleChildClick}
        >
          {universities.map(item => (
            <TeachMapMarker
              key={item.id}
              lat={item.geo.lat}
              lng={item.geo.lng}
              university={item}
              showTooltip={item.id === activeId}
              onClose={handleChildClick}
            />
          ))}

        </GoogleMapReact>
      </div>
    </ErrorBoundary>
  );
}